import { useEffect, useRef, useState } from "react";
import "./Chat.scss";
import avatar from "../../assets/profile.png";
import { useFormik } from "formik";
import submit from "../../assets/submit.svg";
// import useMyContext from "../../hooks/useContext";
import {
  createChatRoomApi,
  getAllChatsApi,
  getAllChatsHistoryApi,
} from "../../services/chat.service";
import { jsonToUrlParams } from "../../utils/json_to_params.service";
import { useLocation } from "react-router-dom";
import { useWebSocket } from "../../context/webSocketContext";
import useChatWebSocket from "../../hooks/sendMessageHook";
import { remote_chat_url_v1 } from "../../environment/environment";
import { convertUtcDateToLocalTime, convertUtcTimeToLocalTime } from "../../utils/date_time";

export const Chat = () => {
  const location = useLocation();
  const chat_id = localStorage.getItem("chat_id");
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("id");
  // const { value, setValue } = useMyContext();
  const { messages } = useWebSocket();
  const [chats, setChats] = useState([]);
  const [chatHistory, setHistory] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState<string>();
  const [selectChat, setSelectedChat] = useState<any>();
  const [newChatRoomId, setNewChatRoomId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRoomCreatedRef = useRef(false); // Ref to track chat room creation

  const { userMessages, sendMessage } = useChatWebSocket(
    `${remote_chat_url_v1}ws/chat/${selectedRoom}/${chat_id}/${selectChat?.consumer_data.chat_id}/`,
    selectedRoom || ""
  );

  const formik = useFormik({
    initialValues: {
      search_term: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      sendMessage(values.search_term);
      formik.resetForm();
      getChatHistory(selectedRoom ?? "");
    },
  });

  useEffect(() => {
    getChats();
  }, []);

  useEffect(() => {
    if (messages && messages.data) {
      try {
        const parsedMessage = JSON.parse(messages.data);
        if (parsedMessage.room && parsedMessage.room === selectedRoom) {
          getChatHistory(parsedMessage.room);
        } else {
          getChats();
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
    console.log("messages", messages.timeStamp);
  }, [messages]);

  useEffect(() => {
    if (userId && !chatRoomCreatedRef.current) {
      createChatRoom();
    }
  }, [userId]);

  useEffect(() => {
    if (newChatRoomId && chats.length > 0) {
      triggerReceipient(newChatRoomId);
      setNewChatRoomId(null);
    }
  }, [chats, newChatRoomId]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getChats = async () => {
    let params = {
      page: 1,
      limit: 20,
    };
    const chat_data: any = await getAllChatsApi(jsonToUrlParams(params));
    if (chat_data.status === 200) {
      setChats(chat_data.data.data);
    }
  };

  const getChatHistory = async (room_id: string) => {
    let params = {
      page: 1,
      limit: 200,
    };
    setSelectedRoom(room_id);
    const chat_data: any = await getAllChatsHistoryApi(
      jsonToUrlParams(params),
      room_id
    );

    if (chat_data.status === 200) {
      setHistory(chat_data.data.data);
    }
  };

  const createChatRoom = async () => {
    let request = {
      consumer_id: userId,
    };
    const chat_data: any = await createChatRoomApi(request);
    if (chat_data.status === 201) {
      chatRoomCreatedRef.current = true; // Set ref to true after creating chat room
      setNewChatRoomId(chat_data.data.data.chat_room_id);
      getChats();
    }
  };

  const selectChatRoom = (chat: any) => {
    setSelectedChat(chat);
    getChatHistory(chat.chat_room_id);
  };

  const triggerReceipient = (data: string) => {
    const result: any = chats.find((item: any) => item.chat_room_id === data);
    if (result) {
      setSelectedChat(result);
      getChatHistory(result.chat_room_id);
    }
  };

  return (
    <div className=" pt-5 mt-4">
      <div className="container hide-mobile">
        <div className="row mb-5">
          <div className="col-4">
            <div className="chat-container">
              {chats &&
                chats.map((chat: any) => (
                  <div
                    className="chat-box"
                    onClick={() => selectChatRoom(chat)}
                  >
                    <div
                      className={`chat-box-inner ${
                        selectChat &&
                        selectChat.chat_room_id === chat.chat_room_id
                          ? "chat-box-inner-active"
                          : ""
                      }`}
                    >
                      <div className="row">
                        <div className="col-2 d-flex align-items-center">
                          <div className="avtr">
                            {chat && chat.consumer_data?.first_name.charAt(0)}
                            {chat && chat.consumer_data?.last_name.charAt(0)}
                          </div>
                        </div>
                        <div className="col-9">
                          <div className="d-flex justify-content-between">
                            <div className="chat-title">
                              {chat && chat.consumer_data?.first_name}{" "}
                              {chat && chat.consumer_data?.last_name}
                            </div>
                            {/* <div>00.32.00</div> */}
                          </div>
                          <div className="chat-message">
                            view chat messages ....
                          </div>
                        </div>
                        <div className="col-1 d-flex align-items-center p-2">
                          <div className="notify-indicator">1</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {chats.length==0 && <div className="text-center pt-3 menu-option">No chats available</div>}
            </div>
          </div>
          {selectChat && (
            <div className="col-8">
              <div className="chatting-container">
                <div className="chatting-header d-flex">
                  <div style={{ width: "40px" }} className="me-3">
                    <div className="avtr">
                      {selectChat &&
                        selectChat.consumer_data?.first_name.charAt(0)}
                      {selectChat &&
                        selectChat.consumer_data?.last_name.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <div className="message-name">
                      {selectChat && selectChat.consumer_data?.first_name}{" "}
                      {selectChat && selectChat.consumer_data?.last_name}
                    </div>
                    <div>{localStorage.getItem("type")=="client"?"Client":"Proffesional"}</div>
                  </div>
                </div>

                <div className="messages-container">
                  {chatHistory &&
                    chatHistory.map((message: any) => (
                      <>
                        {message.sender !== chat_id && (
                          <div className="d-flex ps-4 pe-4 pt-3">
                            {/* <div
                            style={{ width: "40px" }}
                            className="d-flex align-items-start me-4"
                          >
                            <img src={avatar} width={"40px"} />
                          </div> */}

                            <div
                              style={{ width: "40px" }}
                              className="d-flex align-items-start me-3"
                            >
                              <div className="avtr">
                                {selectChat &&
                                  selectChat.consumer_data?.first_name.charAt(
                                    0
                                  )}
                                {selectChat &&
                                  selectChat.consumer_data?.last_name.charAt(0)}
                              </div>
                            </div>
                            <div>
                              <div className="message-rs">
                                {message.message}
                              </div>
                              <div className="message-time">{convertUtcDateToLocalTime(message.created_on)} {convertUtcTimeToLocalTime(message.created_on)}</div>
                            </div>
                          </div>
                        )}

                        {message.sender === chat_id && (
                          <div className="d-flex justify-content-end ps-4 pe-4 pt-3">
                            <div className="pe-4">
                              <div className="message-rp">
                                {message.message}
                              </div>
                              <div className="message-time">{convertUtcDateToLocalTime(message.created_on)} {convertUtcTimeToLocalTime(message.created_on)}</div>
                            </div>

                            <div
                              style={{ width: "40px" }}
                              className="d-flex align-items-start me-4"
                            >
                              <img src={avatar} width={"40px"} />
                            </div>
                          </div>
                        )}
                      </>
                    ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="ps-4 pe-4 pb-4">
                  <form onSubmit={formik.handleSubmit}>
                    <div className="chatting-box">
                      <textarea
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            formik.handleSubmit();
                          }
                        }}
                        placeholder="Ask me anything....."
                        className={` ps-2 pe-2 pt-1 ${
                          formik.values.search_term.length > 204
                            ? " chat-input2"
                            : " chat-input"
                        }`}
                        onChange={formik.handleChange}
                        name="search_term"
                        value={formik.values.search_term}
                      ></textarea>

                      <div className="d-flex justify-content-end ps-2 pe-2 pb-2">
                        <div>
                          {formik.values.search_term && (
                            <button
                              type="submit"
                              style={{
                                backgroundColor: "transparent",
                                border: "none",
                              }}
                            >
                              <img
                                className="w-75"
                                src={submit}
                                alt="Icon description"
                              />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>


      <div className="container">
      <div className="chatting-container">
              {chats && !selectChat &&
                chats.map((chat: any) => (
                  <div
                    className="chat-box"
                    onClick={() => selectChatRoom(chat)}
                  >
                    <div
                      className={`chat-box-inner ${
                        selectChat &&
                        selectChat.chat_room_id === chat.chat_room_id
                          ? "chat-box-inner-active"
                          : ""
                      }`}
                    >
                      <div className="row">
                        <div className="col-2 d-flex align-items-center">
                          <div className="avtr">
                            {chat && chat.consumer_data?.first_name.charAt(0)}
                            {chat && chat.consumer_data?.last_name.charAt(0)}
                          </div>
                        </div>
                        <div className="col-9">
                          <div className="d-flex justify-content-between">
                            <div className="chat-title">
                              {chat && chat.consumer_data?.first_name}{" "}
                              {chat && chat.consumer_data?.last_name}
                            </div>
                            {/* <div>00.32.00</div> */}
                          </div>
                          <div className="chat-message">
                            view chat messages ....
                          </div>
                        </div>
                        <div className="col-1 d-flex align-items-center p-2">
                          <div className="notify-indicator">1</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}


{selectChat && (
            <div>
              <div className="chatting-container hide-desktop">
                <div className="chatting-header d-flex">
                  <div style={{ width: "40px" }} className="me-3">
                    <div className="avtr">
                      {selectChat &&
                        selectChat.consumer_data?.first_name.charAt(0)}
                      {selectChat &&
                        selectChat.consumer_data?.last_name.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <div className="message-name">
                      {selectChat && selectChat.consumer_data?.first_name}{" "}
                      {selectChat && selectChat.consumer_data?.last_name}
                    </div>
                    <div>{localStorage.getItem("e_type")=="1"?"Client":"Proffesional"}</div>
                  </div>
                </div>

                <div className="messages-container">
                  {chatHistory &&
                    chatHistory.map((message: any) => (
                      <>
                        {message.sender !== chat_id && (
                          <div className="d-flex ps-4 pe-4 pt-3">
                            {/* <div
                            style={{ width: "40px" }}
                            className="d-flex align-items-start me-4"
                          >
                            <img src={avatar} width={"40px"} />
                          </div> */}

                            <div
                              style={{ width: "40px" }}
                              className="d-flex align-items-start me-3"
                            >
                              <div className="avtr">
                                {selectChat &&
                                  selectChat.consumer_data?.first_name.charAt(
                                    0
                                  )}
                                {selectChat &&
                                  selectChat.consumer_data?.last_name.charAt(0)}
                              </div>
                            </div>
                            <div>
                              <div className="message-rs">
                                {message.message}
                              </div>
                              <div className="message-time">{convertUtcDateToLocalTime(message.created_on)} {convertUtcTimeToLocalTime(message.created_on)}</div>
                            </div>
                          </div>
                        )}

                        {message.sender === chat_id && (
                          <div className="d-flex justify-content-end ps-4 pe-4 pt-3">
                            <div className="pe-4">
                              <div className="message-rp">
                                {message.message}
                              </div>
                              <div className="message-time">{convertUtcDateToLocalTime(message.created_on)} {convertUtcTimeToLocalTime(message.created_on)}</div>
                            </div>

                            <div
                              style={{ width: "40px" }}
                              className="d-flex align-items-start me-4"
                            >
                              <img src={avatar} width={"40px"} />
                            </div>
                          </div>
                        )}
                      </>
                    ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="ps-4 pe-4 pb-4">
                  <form onSubmit={formik.handleSubmit}>
                    <div className="chatting-box">
                      <textarea
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            formik.handleSubmit();
                          }
                        }}
                        placeholder="Ask me anything....."
                        className={` ps-2 pe-2 pt-1 ${
                          formik.values.search_term.length > 204
                            ? " chat-input2"
                            : " chat-input"
                        }`}
                        onChange={formik.handleChange}
                        name="search_term"
                        value={formik.values.search_term}
                      ></textarea>

                      <div className="d-flex justify-content-end ps-2 pe-2 pb-2">
                        <div>
                          {formik.values.search_term && (
                            <button
                              type="submit"
                              style={{
                                backgroundColor: "transparent",
                                border: "none",
                              }}
                            >
                              <img
                                className="w-75"
                                src={submit}
                                alt="Icon description"
                              />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
            </div>
      </div>
    </div>
  );
};
