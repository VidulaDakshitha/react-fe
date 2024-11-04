import { ErrorMessage, Field, FieldProps, Form, Formik } from "formik";
import { createTaskApiAttributes } from "../../../types/api_types";
import InputField from "../../../core/InputField/InputField";
import "./CreateTask.scss";
import SelectField from "../../../core/SelectField/SelectField";
import Button from "../../../core/Button/Button";
import { createTaskApi } from "../../../services/task.service";
import { ApiAttributes, createTaskProps } from "../../../types/types";
import { ErrorNotification } from "../../../components/ErrorNotification/ErrorNotification";
import { toast } from "react-toastify";
import { useState } from "react";
import { BsDash, BsPlusLg } from "react-icons/bs";
import ImageUpload from "../../../components/FileUpload/FileUpload";
import CustomModal from "../../../components/Modal/Modal";
import { SkillClient } from "../../../components/SkillClient/SkillClient";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import * as Yup from "yup";
import AddSubContractors from "./AdvancedOption/AddSubContractors";
import { useUserRole } from "../../../hooks/HasRole";
interface Skill {
  id: number;
  skill: string;
}

interface SkillsProps {
  skills: Skill[];
  updateSkillList: (skills: Skill[]) => void;
}

const createTaskValidation = Yup.object().shape({
  title: Yup.string()
    .min(2, "Too Short!")
    .max(60, "Too Long!")
    .required("Required"),
  description: Yup.string().required("Required"),
  budget: Yup.number().required("Required"),
  currency: Yup.string().required("Required"),
  bid_type: Yup.string().required("Required"),
  bid_deadline: Yup.date()
    .required("Required")
    .test(
      "is-future-date",
      "Bid deadline must be in the future",
      (value) => value && new Date(value) > new Date()
    ),
    communication_deadline: Yup.date()
    .test(
      "is-future-date",
      "Communication deadline must be in the future",
      (value) => value && new Date(value) > new Date()
    ),
  task_deadline: Yup.date()
    .required("Required")
    .test(
      "is-future-date",
      "Task deadline must be in the future",
      (value) => value && new Date(value) > new Date()
    )
    .test(
      "is-after-bid-deadline",
      "Task deadline must be after bid deadline",
      function (value) {
        const { bid_deadline } = this.parent;
        return (
          value && bid_deadline && new Date(value) > new Date(bid_deadline)
        );
      }
    ),
  acceptance_criteria: Yup.string().required("Required"),
  job_type: Yup.string().required("Required"),

  files: Yup.array(),
});

export const CreateTask = ({ closeModal, recallData }: createTaskProps) => {
  const [skills, setSkills] = useState(["English", "Photoshop"]);
  const [files, setFiles] = useState<any[]>();
  const [skillList, setSkillList] = useState<Skill[]>([]);
  const [selectedSubContractor, setSelectedSubContractor] = useState<any>([]);

  const [modalShow, setModalShow] = useState(false);
  const toggleModal = () => setModalShow(!modalShow);
  const [isLoading, setIsLoading] = useState(false);
  const { roles, hasRole, hasOrganization } = useUserRole();
  const initialValues = {
    title: "",
    description: "",
    budget: 0.0,
    currency: "SEK",
    bid_type: "",
    communication_type: "",
    bid_deadline: "",
    communication_deadline: "",
    task_deadline: "",
    required_skills: skillList.map((skill) => skill.id),
    sub_contractors: selectedSubContractor
    .filter((user: any) => user.type === "worker")
    .map((user: any) => user.id),
    sub_organization_ids:selectedSubContractor
    .filter((user: any) => user.type === "company")
    .map((user: any) => user.id),
    acceptance_criteria: "",
    exit_criteria:"",
    job_type: "",
    experience_level: "entry",
    files: files,
    updated_on: "2024-05-23 00:00:00+00",
  };

  // Validation schema using Yup
  const validationSchema = {};
  // Handle form submission
  const onSubmit = async (
    values: createTaskApiAttributes,
    { setSubmitting, setFieldValue }: any
  ) => {
    values.required_skills = await skillList.map((skill) => skill.id);
    if (selectedSubContractor.length > 0) {
      values.sub_contractors = await selectedSubContractor
      .filter((user: any) => user.type === "worker")
      .map((user: any) => user.id)
      values.sub_organization_ids = await selectedSubContractor
      .filter((user: any) => user.type === "company")
      .map((user: any) => user.id)
    } else {
      delete values.sub_contractors;
      delete values.sub_organization_ids;
    }

    console.log(values)
    setIsLoading(true);

    const task_request: any = await createTaskApi(values);
    setIsLoading(false);
    if (task_request.status == 201) {
      toast.success("Task created successfully");
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
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={createTaskValidation}
      >
        {(formik) => (
          <Form className="ps-5 pe-5">
            <div className="row">
              <div className="col-12 label pt-2 pb-2">Title</div>

              <div className="col-12">
                <InputField
                  label=""
                  className="task-input mb-3"
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
                <ErrorMessage
                  name="description"
                  component="div"
                  className="error"
                />
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

                <ErrorMessage
                  name="acceptance_criteria"
                  component="div"
                  className="error"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-12 label  pb-2">Exit Criteria</div>

              <div className="col-12 pb-3">
                <Field name="exit_criteria">
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

                <ErrorMessage
                  name="acceptance_criteria"
                  component="div"
                  className="error"
                />
              </div>
            </div>


            <div className="row">
              <div className="col-lg-6 col-md-6 col-12  pt-2">
                <div className="label mb-3">Communication Type</div>
                <div className="row mb-3">
                  <div className="col-lg-4 col-md-4 col-6">
                    <div
                      className="pe-5 type-box"
                      onClick={() => formik.setFieldValue("communication_type", "open")}
                    >
                      <Field
                        type="radio"
                        name="communication_type"
                        className="me-2"
                        value="open"
                      />
                      <span className="terms">Open</span>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-4 col-6">
                    <div
                      className="pe-5 type-box"
                      onClick={() => formik.setFieldValue("communication_type", "closed")}
                    >
                      <Field
                        type="radio"
                        name="communication_type"
                        className="me-2"
                        value="closed"
                      />
                      <span className="terms">Closed</span>
                    </div>
                  </div>
                </div>
                <ErrorMessage
                  name="bid_type"
                  component="div"
                  className="error"
                />
              </div>
            </div>


     <div className="row">
              <div className="col-lg-4 col-md-4 col-12 pt-2">
                <div className="label pb-2">Bid Deadline</div>
                <div>
                  <InputField
                    label=""
                    className="task-input mb-4 task-deadline"
                    name="bid_deadline"
                    isDisabled={false}
                    fieldType="datetime-local"
                    placeholder={""}
                  />
                </div>
              </div>

              <div className="col-lg-4 col-md-4 col-12 pt-2">
                <div className="label pb-2">Task Deadline</div>
                <div>
                  <InputField
                    label=""
                    className="task-input mb-4 task-deadline"
                    name="task_deadline"
                    isDisabled={false}
                    fieldType="datetime-local"
                    placeholder={""}
                  />
                </div>
              </div>

              
      {formik.values.communication_type === "open" &&               <div className="col-lg-4 col-md-4 col-12 pt-2">
                <div className="label pb-2">Communication Deadline</div>
                <div>
                  <InputField
                    label=""
                    className="task-input mb-4 task-deadline"
                    name="communication_deadline"
                    isDisabled={false}
                    fieldType="datetime-local"
                    placeholder={""}
                  />
                </div>
              </div>}
            </div>


            <div className="row">
              <div className="col-lg-6 col-md-6 col-12  pt-2">
                <div className="label mb-3">Bid Type</div>
                <div className="row mb-3">
                  <div className="col-lg-4 col-md-4 col-6">
                    <div
                      className="pe-5 type-box"
                      onClick={() => formik.setFieldValue("bid_type", "open")}
                    >
                      <Field
                        type="radio"
                        name="bid_type"
                        className="me-2"
                        value="open"
                      />
                      <span className="terms">Open Bid</span>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-4 col-6">
                    <div
                      className="pe-5 type-box"
                      onClick={() => formik.setFieldValue("bid_type", "closed")}
                    >
                      <Field
                        type="radio"
                        name="bid_type"
                        className="me-2"
                        value="closed"
                      />
                      <span className="terms">Close Bid</span>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-4 col-6">
                    <div
                      className="pe-5 type-box"
                      onClick={() => formik.setFieldValue("bid_type", "max_price")}
                    >
                      <Field
                        type="radio"
                        name="bid_type"
                        className="me-2"
                        value="max_price"
                      />
                      <span className="terms">Max Price</span>
                    </div>
                  </div>
                </div>
                <ErrorMessage
                  name="bid_type"
                  component="div"
                  className="error"
                />
              </div>
            </div>

{formik.values.bid_type === "max_price" && 
            <div className="row">
              <div className="col-12">
                <div className="label pt-2">Task Budget</div>

                <div className="col-12 pt-2">
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
            </div>}





            <div className="col-12 mt-3">
              <div className="label mb-3">Task Type</div>
              <div className="row">
                <div className="col-lg-2 col-md-4 col-6">
                  <div
                    className=""
                    onClick={() => formik.setFieldValue("job_type", "remote")}
                  >
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

                <div className="col-lg-2 col-md-4 col-6">
                  <div
                    className=""
                    onClick={() => formik.setFieldValue("job_type", "onsite")}
                  >
                    <div className=" pe-5 type-box">
                      <Field
                        type="radio"
                        name="job_type"
                        className="me-2"
                        value="onsite"
                      />
                      <span className="terms">Physical</span>
                    </div>
                  </div>
                </div>

                <div className="col-lg-2 col-md-4 col-6 pt-lg-0 pt-md-0 pt-3">
                  <div
                    className=""
                    onClick={() => formik.setFieldValue("job_type", "hybrid")}
                  >
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
                <ErrorMessage
                  name="job_type"
                  component="div"
                  className="error"
                />
              </div>
            </div>

            <div className="pt-4">
              <div className="col-12 label  pb-2">Skills</div>

              <div className="row">
                {skillList &&
                  skillList.map((skill: any) => (
                    <div className="col-lg-2 col-md-4 col-6 pt-lg-0 pt-md-0 pt-3">
                      <div className="skill-box2">
                        {skill.skill} <BsDash />
                      </div>
                    </div>
                  ))}
                <div className="col-lg-2 col-md-4 col-6 pt-lg-0 pt-md-0 pt-3">
                  <div className="skill-box" onClick={() => toggleModal()}>
                    Add More <BsPlusLg />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 mt-4">
              <div className="label mb-3">Attachment</div>

              <ImageUpload
                onFilesChange={(files) =>
                  handleFilesChange(files, formik.setFieldValue)
                }
              />
            </div>
   {['task_manager','admin'].some((role:any) => hasRole(role)) &&         <AddSubContractors
              selectedSubContractor={selectedSubContractor}
              setSelectedSubContractor={setSelectedSubContractor}
            />}
            <div>
              <div className="d-flex justify-content-end mt-3 pb-lg-0 pb-4">
                <Button
                  className="task-btn"
                  buttonText={"Post Task"}
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
