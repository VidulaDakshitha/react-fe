import { useEffect, useState } from "react";
import "./ViewBidsClient.scss";
import bidprof from "../../../../assets/bid-prof.png";
import bidprof2 from "../../../../assets/bid-prof2.png";

import Button from "../../../../core/Button/Button";
import { ErrorNotification } from "../../../../components/ErrorNotification/ErrorNotification";
import { BidAcceptApi, getBidsApi } from "../../../../services/bid.service";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { NoData } from "../../../../components/NoData/NoData";

export const ViewBidsClient = ({ task_id }: any) => {
  const navigate = useNavigate();
  const [bids, setBids] = useState([]);
  const [bidDetail, setBidDetail] = useState<any>();
  const [accept, setAccept] = useState<boolean>(false);
  const [skills, setSkills] = useState([
    "Web Design",
    "Figma",
    "Mobile UI Design",
    "User Experience",
  ]);

  useEffect(() => {
    getAllBids();
  }, []);

  const getAllBids = async () => {
    let param = {
      task_id: task_id.id,
      origin:1
    };
    const tasks: any = await getBidsApi(param);
    console.log("bids", tasks);
    if (tasks.status == 200) {
      setBids(tasks.data.data);
    } else {
      ErrorNotification(tasks.message);
    }
  };

  const acceptBid = async (response: any) => {
    let payload;
    if (response) {
      payload = {
        is_accepted: 1,
      };
    } else {
      payload = {
        is_accepted: 0,
      };
    }

    const bid_request: any = await BidAcceptApi(bidDetail.id, payload);

    if (bid_request.status == 200) {
      toast.success("Successfully responded to Bid");
      getAllBids();
    } else {
      ErrorNotification(bid_request.message);
    }
  };

  const updateBidDetails = (bid_details: any) => {
    setBidDetail(bid_details);
  };
  return (
    <div>
      <div className="row">
        <div className="col-4">
          {bids &&
            bids.map((bid: any) => (
              <div className="bid-box" onClick={() => updateBidDetails(bid)}>
                <div className="row">
                  <div className="col-2">
                    <img src={bidprof} />
                  </div>
                  <div className="col-7">
                    <div className="bid-msg">
                      {" "}
                      {bid.created_by} placed a bid on your task{" "}
                    </div>
                  </div>
                  <div className="col-3">{bid.amount} USD</div>
                </div>
              </div>
            ))}
        </div>

        {bidDetail && (
          <div className="col-8 bid-bg">
            <div className="row bid-section1">
              <div className="col-2">
                <img width={"60%"} src={bidprof2} />
              </div>
              <div className="col-7">
                <div className="bidder-name">
                  {bidDetail && bidDetail.bidder_name}
                </div>
                <div className="bidder-desig">UI/UX Designer</div>
                <div className="bidder-location">Stockholms, Sweden</div>
              </div>

              <div className="col-2 d-flex align-items-center">
                <Button
                  className="task-btn w-100"
                  // buttonText={
                  //   "Chat with " +
                  //   // (bidDetail && bidDetail.bidder_name)
                  // }
                  buttonText="Chat Here"
                  type="submit"
                  onClickHandler={() =>
                    navigate("/chat/?id=" + bidDetail.bidder_id)
                  }
                />
              </div>
            </div>

            <div className="row bid-section2">
              <div className="bid-desc">Description</div>

              <div className="bid-desc-content">
                {bidDetail && bidDetail.description}
              </div>
            </div>

            <div className="row bid-section2">
              <div className="bid-desc">Bid Value</div>
              <div>
                {bidDetail && bidDetail.amount}{" "}
                {bidDetail && bidDetail.currency}
              </div>
            </div>

            <div className="row bid-section2">
              <div className="bid-desc">Revisions</div>
              <div className="revision-value">
                {bidDetail && bidDetail.revision}
              </div>
            </div>

            <div className="row">
              <div className="bid-desc">Skills and Expertise</div>

              <div className="row pt-3">
              <div className="skills-container2">
            {bidDetail &&
              bidDetail.task &&
              bidDetail.task.skills.map((skills: any) => (
                <div className=" skill-wrapper pb-3" key={skills.skill}>
                  <div className="skill">{skills.skill}</div>
                </div>
              ))}
          </div>
              </div>
            </div>


 
            {((bidDetail && bidDetail.is_accepted == 0) && accept===false) && (
              <div className="d-flex justify-content-end pt-5 pb-5">
                <Button
                  className="bid-btn me-3"
                  buttonText={"Ignore"}
                  type="button"
                  onClickHandler={() => acceptBid(false)}
                />

                <Button
                  className="task-btn"
                  buttonText={"Accept"}
                  type="submit"
                  onClickHandler={() => {acceptBid(true); setAccept(true)}}
                />
              </div>
            )}

            {((bidDetail && bidDetail.is_accepted == 1) || accept===true) && (
              <div className="d-flex justify-content-end pt-5 pb-5">
                <Button
                  className="view-btn2 me-3"
                  buttonText={"Accepted"}
                  type="button"
                  isDisabled
                  
                />
              </div>
            )}
          </div>
        )}

        {bids && bids.length == 0 && (
          <NoData noData="No bids available" noDataDesc="Bid data will be available after bids placed"/>
        )}
      </div>
    </div>
  );
};
