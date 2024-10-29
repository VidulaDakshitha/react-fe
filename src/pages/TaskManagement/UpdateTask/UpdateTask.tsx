import { Field, FieldProps, Form, Formik } from "formik";
import { createTaskApiAttributes } from "../../../types/api_types";
import InputField from "../../../core/InputField/InputField";
import "./UpdateTask.scss";
import SelectField from "../../../core/SelectField/SelectField";
import Button from "../../../core/Button/Button";
import { UpdateTaskApi, createTaskApi, getTaskByIdApi } from "../../../services/task.service";
import { ApiAttributes, TaskUpdateProps } from "../../../types/types";
import { ErrorNotification } from "../../../components/ErrorNotification/ErrorNotification";
import { toast } from "react-toastify";
import { BsDash, BsPlusLg } from "react-icons/bs";
import { useEffect, useState } from "react";
import ImageUpload from "../../../components/FileUpload/FileUpload";
import CustomModal from "../../../components/Modal/Modal";
import { SkillClient } from "../../../components/SkillClient/SkillClient";
import { ViewAttachment } from "../../../components/ViewAttachment/ViewAttachment";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import AddSubContractors from "../CreateTask/AdvancedOption/AddSubContractors";
import { useUserRole } from "../../../hooks/HasRole";

interface Skill {
  id: number;
  skill: string;
}

interface SkillsProps {
  skills: Skill[];
  updateSkillList: (skills: Skill[]) => void;
}

export const UpdateTask = ({
  task_id,
  taskData,
  closeModal,
  recallData,
}: TaskUpdateProps) => {
  const [skills, setSkills] = useState(["English", "Photoshop"]);
  const [files, setFiles] = useState<any[]>();
  const [skillList, setSkillList] = useState<Skill[]>(taskData?.skills);
  const [modalShow, setModalShow] = useState(false);
  const toggleModal = () => setModalShow(!modalShow);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubContractor, setSelectedSubContractor] = useState<any>([]);
  const [task, setTasks] = useState<any>();
  const { roles, hasRole } = useUserRole();

  useEffect(()=>{
    getTaskByID()
  },[task_id])


  const getTaskByID=async ()=>{

   let task_data:any =await  getTaskByIdApi(task_id);
    console.log(task_data)
   if(task_data.status==200){
      setTasks(task_data.data)
      setSkillList(task_data.data.skills)
   }

  }

  const initialValues = {
    title: task?.title ? task.title : "",
    description: task?.description ? task.description : "",
    budget: task?.budget ? parseInt(task.budget) : 0,
    currency: task?.currency ? task.currency : "",
    bid_type: task?.bid_type ? task.bid_type : "",
    job_type: task?.job_type ? task.job_type : "",
    bid_deadline: task?.bid_deadline ? task.bid_deadline : "",
    task_deadline: task?.task_deadline ? task.task_deadline : "",
    acceptance_criteria: task?.acceptance_criteria
      ? task.acceptance_criteria
      : "",
    files: files,
  };

  // Validation schema using Yup
  const validationSchema = {};
  // Handle form submission
  const onSubmit = async (
    values: createTaskApiAttributes,
    { setSubmitting }: any
  ) => {
    values.required_skills = await skillList.map((skill) => skill.id);
    setIsLoading(true);
    const task_request: any = await UpdateTaskApi(
      values,
      task?.id ? task?.id : 0
    );
    setIsLoading(false);
    if (task_request.status == 200) {
      toast.success("task updated successfully");
      closeModal();
      recallData();
    } else {
      ErrorNotification(task_request.message);
    }
  };

  const handleFilesChange = async (
    files: { file: string }[],
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  ) => {
    console.log("Uploaded Files:", files);
    setFiles(files);
    setFieldValue("files", files);
  };

  const handleSkillUpdate = (newSkills: Skill[]) => {
    setSkillList(newSkills);
    // updateSkillList(newSkills);
  };

  const ApproveTask = async(isApproved:any)=>{
    let data_values={
      is_post_approved:isApproved
    }
    const task_request: any = await UpdateTaskApi(
      data_values,
      task?.id ? task?.id : 0
    );
    setIsLoading(false);
    if (task_request.status == 200) {
      toast.success("task updated successfully");
      closeModal();
      recallData();
    } else {
      ErrorNotification(task_request.message);
    }
  }

  return (
    <div>
      <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize>
        {(formik) => (
          <Form className="ps-5 pe-5">
            <div className="row">
              <div className="col-12 label pt-2 pb-2">Title</div>

              <div className="col-12">
                <InputField
                  label=""
                  className="task-input mb-4"
                  name="title"
                  isDisabled={false}
                  fieldType="text"
                  placeholder={""}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-12 label pb-2">Description</div>
              <div className="col-12 pb-3">
                <Field name="description">
                  {({ field, form }: FieldProps) => (
                    <CKEditor
                      editor={ClassicEditor}
                      data={field.value}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        form.setFieldValue(field.name, data);
                      }}
                    />
                  )}
                </Field>
              </div>
            </div>
            {/* 
            <div className="row">
              <div className="col-12 label pb-2">Skill</div>

              <div className="col-12">
                <InputField
                  label=""
                  className="task-input mb-4"
                  name="task_skill"
                  isDisabled={false}
                  fieldType="text"
                  placeholder={""}
                />
              </div>
            </div> */}

            <div className="row">
              <div className="col-6  pt-2">
                <div className="label pb-2">Task Deadline</div>
                <div>
                  <InputField
                    label=""
                    className="task-input mb-4 w-50"
                    name="task_deadline"
                    isDisabled={false}
                    fieldType="datetime-local"
                    placeholder={""}
                  />
                </div>
              </div>

              <div className="col-6">
                <div className="label mb-3">Bid Type</div>
                <div className="row">
                  <div className="col-4">
                    <div className="">
                      <div className=" pe-5 type-box">
                        <Field
                          type="radio"
                          name="bid_type"
                          className="me-2"
                          value="open"
                        />
                        <span className="terms">Open Bid</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="">
                      <div className=" pe-5 type-box">
                        <Field
                          type="radio"
                          name="bid_type"
                          className="me-2"
                          value="closed"
                        />
                        <span className="terms">Close Bid</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <div className="label pt-2">Task Budget</div>

                <div className="col-12 pt-2">
                  {/* <InputField
                    label=""
                    className="task-input mb-4"
                    name="budget"
                    isDisabled={false}
                    fieldType="number"
                    placeholder={""}
                  /> */}

                  <div className="input-group d-flex">
                    <InputField
                      label=""
                      className="budget-input mb-4"
                      name="budget"
                      isDisabled={false}
                      fieldType="number"
                      placeholder={""}
                    />
                    <div className="input-group-append">
                      <SelectField
                        name="currency"
                        options={[
                          {
                            value: "USD",
                            label: "USD",
                          },
                          {
                            value: "SEK",
                            label: "SEK",
                          },
                          {
                            value: "EUR",
                            label: "EUR",
                          },
                        ]}
                        label={""}
                        className="currency-select mb-3"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="col-5">
                <div className="label pt-2">Currency</div>

                <div className="col-9 pt-2">
                  <SelectField
                    name="currency"
                    options={[
                      {
                        value: "USD",
                        label: "USD",
                      },
                      {
                        value: "SEK",
                        label: "SEK",
                      },
                      {
                        value: "EUR",
                        label: "EUR",
                      },
                    ]}
                    label={""}
                    className="task-input mb-3"
                  />
                </div>
              </div> */}
            </div>

            <div className="row">
              <div className="col-6  pt-2">
                <div className="label pb-2">Bid End Date</div>
                <div>
                  <InputField
                    label=""
                    className="task-input mb-4 w-50"
                    name="bid_deadline"
                    isDisabled={false}
                    fieldType="datetime-local"
                    placeholder={""}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12 label  pb-2">Acceptance Criteria</div>

              <div className="col-12 pb-3">
                <Field name="acceptance_criteria">
                  {({ field, form }: FieldProps) => (
                    <CKEditor
                      editor={ClassicEditor}
                      data={field.value}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        form.setFieldValue(field.name, data);
                      }}
                    />
                  )}
                </Field>
              </div>
            </div>

            <div>
              <div className="col-12 label  pb-2">Skills</div>

              <div className="row">
                {skillList &&
                  skillList.map((skill: any) => (
                    <div className="col-2">
                      <div className="skill-box">
                        {skill.skill} <BsDash />
                      </div>
                    </div>
                  ))}
                <div className="col-2">
                  <div className="skill-box" onClick={() => toggleModal()}>
                    Add More <BsPlusLg />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 mt-4">
              <div className="label mb-3">Task Type (optional)</div>
              <div className="row">
                <div className="col-2">
                  <div className="">
                    <div className=" pe-5 type-box">
                      <Field
                        type="radio"
                        name="job_type"
                        className="me-2"
                        value="remote"
                      />
                      <span className="terms">Online</span>
                    </div>
                  </div>
                </div>

                <div className="col-2">
                  <div className="">
                    <div className=" pe-5 type-box">
                      <Field
                        type="radio"
                        name="job_type"
                        className="me-2"
                        value="physical"
                      />
                      <span className="terms">Physical</span>
                    </div>
                  </div>
                </div>

                <div className="col-2">
                  <div className="">
                    <div className=" pe-5 type-box">
                      <Field
                        type="radio"
                        name="job_type"
                        className="me-2"
                        value="hybrid"
                      />
                      <span className="terms">Hybrid</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 mt-4">
              <div className="label mb-3">Attachment</div>
              <ViewAttachment attachments={task && task.attachments} />
              <ImageUpload
                onFilesChange={(files) =>
                  handleFilesChange(files, formik.setFieldValue)
                }
              />
            </div>
            <AddSubContractors
              selectedSubContractor={selectedSubContractor}
              setSelectedSubContractor={setSelectedSubContractor}
            />
            <div className="mt-3">
              <div className="d-flex justify-content-end mt-1 pb-lg-0 pb-4 ">
           { task && task.is_post_approved == false && task.is_post_approved==false && ['admin','task_manager'].some((role:any) => hasRole(role)) && <>    <Button
                  className="task-btn me-2"
                  buttonText={"Approve Task"}
                  type="button"
                  isLoading={isLoading}
                  onClickHandler={()=>ApproveTask(1)}
                />

                <Button
                  className="task-btn me-2"
                  buttonText={"Decline Task"}
                  type="button"
                  isLoading={isLoading}
                  onClickHandler={()=>ApproveTask(0)}
                /></>}

                <Button
                  className="task-btn"
                  buttonText={"Update Task"}
                  type="submit"
                  isLoading={isLoading}
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>

      <CustomModal
        show={modalShow}
        toggle={toggleModal}
        size={"md"}
        ModalHeader="Add Skills"
      >
        <SkillClient
          skills={skillList}
          onSkillUpdate={handleSkillUpdate}
          close={toggleModal}
        />
      </CustomModal>
    </div>
  );
};
