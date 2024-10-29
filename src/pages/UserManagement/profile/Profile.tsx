import "./Profile.scss";
import profile from "../../../assets/profile-img.png";
import {Formik} from "formik";
import InputField from "../../../core/InputField/InputField";
import React, {useEffect, useState} from "react";
import Button from "../../../core/Button/Button";
import SelectField from "../../../core/SelectField/SelectField";
import {ErrorNotification} from "../../../components/ErrorNotification/ErrorNotification";
import {
    getUserDetailsApi,
    updateUserDetailsApi,
} from "../../../services/user.service";
import {toast} from "react-toastify";
import {Skills} from "../../../components/Skills/Skills";
import {Language} from "../../../components/Language/Language";
import {Certification} from "../../../components/Certification/Certification";
import {Project} from "../../../components/Project/Project";
import { Spinner } from '../../../components/Spinner/Spinner';

interface Skill {
    id: number;
    skill: string;
}

interface Language {
    id?: number | null;
    language: string | null;
    expertise_level: string | null;
    language_id: number | null;
    is_delete?: number | null;
}

interface Certification {
    id?: number | null;
    title: string;
    institution: string | null;
    description: string | null;
    from_date: string | null;
    to_date: string | null;
    is_delete?: number | null;
}

interface Project {
    id?: number | null;
    title: string;
    description: string | null;
    from_date: string | null;
    to_date: string | null;
    is_delete?: number | null;
}

export const Profile = () => {
    const [userDetails, setUserDetails] = useState<any>();
    const [skillList, setSkillList] = useState<Skill[]>([]);
    const [languageList, setLanguageList] = useState<Language[]>([]);
    const [certificationList, setCertificationList] = useState<Certification[]>(
        []
    );
    const [projectList, setProjectList] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [organizationSkillList, setOrganizationSkillList] = useState<Skill[]>([]);

    useEffect(() => {
        getUserDetails();
    }, []);

    const getUserDetails = async () => {
        setIsLoading(true);
        const user_details: any = await getUserDetailsApi();
        if (user_details.status === 200) {
            setUserDetails(user_details.data);
            const skills: Skill[] = user_details.data.skills ?? [];
            setSkillList(skills);

            const languages: Language[] =
                user_details.data.languages ?? [];
            setLanguageList(languages);

            const certifications: Certification[] =
                user_details.data.certifications ?? [];
            setCertificationList(certifications);

            const projects: Project[] =
                user_details.data.projects ?? [];
            setProjectList(projects);

            // Set organization skills
            const organizationSkills: Skill[] = user_details.data.organization?.skills ?? [];
            setOrganizationSkillList(organizationSkills);
        } else {
            ErrorNotification(user_details.message);
        }
        setIsLoading(false);
    };

    if (isLoading) {
        return <Spinner size="large" />;
    }

    const updateSkillList = (newSkills: Skill[]) => {
        setSkillList(newSkills);
    };

    const updateLanguageList = (newLanguages: Language[]) => {
        setLanguageList(newLanguages);
    };

    const updateCertificationList = (newCertifications: Certification[]) => {
        setCertificationList(newCertifications);
    };

    const updateProjectList = (newProjects: Project[]) => {
        setProjectList(newProjects);
    };

    const updateOrganizationSkillList = (newSkills: Skill[]) => {
        setOrganizationSkillList(newSkills);
    };

    const initialValues = {
        first_name: userDetails?.first_name || "",
        last_name: userDetails?.last_name || "",
        user_name: userDetails?.user_name || "",
        phone_no: userDetails?.phone_no || "",
        email: userDetails?.email || "",
        profile_image: "",
        country: userDetails?.country || "",
    };

    const onSubmit = async (values: any, {setSubmitting}: any) => {
        if (values.user_name === userDetails?.user_name) {
            delete values.user_name;
        }
        if (values.email === userDetails?.email) {
            delete values.email;
        }
        if (values.phone_no === userDetails?.phone_no) {
            delete values.phone_no;
        }
        setIsLoading(true)
        const user_request: any = await updateUserDetailsApi(values);
        setIsLoading(false)
        if (user_request.status === 200) {
            toast.success("User details updated successfully");
            getUserDetails();
        } else {
            ErrorNotification(user_request.message);
        }
    };

    const initialValues2 = {
        name: userDetails?.organization?.name || "",
        url: userDetails?.organization?.url || "",
        address_line1: userDetails?.organization?.address_line1 || "",
        country: userDetails?.organization?.country || "",
        address_line2: userDetails?.organization?.address_line2 || "",
        city: userDetails?.organization?.city || "",
        zip_code: userDetails?.organization?.zip_code || "",
    };

    const onSubmit2 = async (values: any, {setSubmitting}: any) => {
        const organization_obj = {
            organization: {
                ...values,
                skills: organizationSkillList.map(skill => skill.id)
            }
        }
        setIsLoading(true)
        const user_request: any = await updateUserDetailsApi(organization_obj);
        setIsLoading(false)
        if (user_request.status === 200) {
            toast.success("Organization details updated successfully");
            getUserDetails();
        } else {
            ErrorNotification(user_request.message);
        }
    };

    return (
        <div className="p-5">
            <div className="profile-bg">
                <div className="profile-banner">
                    <img
                        className="profile-img"
                        width={"10%"}
                        src={profile}
                        alt="Profile"
                    />
                </div>

                <div className="profile-name">
                    {userDetails?.first_name || "John D."}
                </div>

                <div className="profile-location">
                    Stockholm, Sweden - 11:14 am local
                </div>
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    enableReinitialize
                >
                    {(formik) => (
                        <div className="p-5">
                            <div className="row">
                                <div className="col-6">
                                    <div className="label pt-2 pb-2">First Name</div>
                                    <InputField
                                        label=""
                                        className="task-input mb-4"
                                        name="first_name"
                                        isDisabled={false}
                                        fieldType="text"
                                        placeholder=""
                                    />
                                </div>

                                <div className="col-6">
                                    <div className="label pt-2 pb-2">Last Name</div>
                                    <InputField
                                        label=""
                                        className="task-input mb-4"
                                        name="last_name"
                                        isDisabled={false}
                                        fieldType="text"
                                        placeholder=""
                                    />
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="label pt-2 pb-2">User Name</div>
                                <InputField
                                    label=""
                                    className="task-input mb-4"
                                    name="user_name"
                                    isDisabled={false}
                                    fieldType="text"
                                    placeholder=""
                                />
                            </div>

                            <div className="col-12">
                                <div className="label pt-2 pb-2">Email</div>
                                <InputField
                                    label=""
                                    className="task-input mb-4"
                                    name="email"
                                    isDisabled={false}
                                    fieldType="text"
                                    placeholder=""
                                />
                            </div>

                            <div className="col-12">
                                <div className="label pt-2 pb-2">Phone</div>
                                <InputField
                                    label=""
                                    className="task-input mb-4"
                                    name="phone_no"
                                    isDisabled={false}
                                    fieldType="text"
                                    placeholder=""
                                />
                            </div>

                            <div className="col-12">
                            <div className="label pt-2 pb-2">Country</div>
                                            <SelectField
                                                name="country"
                                                options={[
                                                    {
                                                        value: "sweden",
                                                        label: "Sweden",
                                                    },
                                                ]}
                                                label=""
                                                className="task-input mb-3"
                                                LabelclassName="register-lbl"
                                            />
                                        </div>

                            <div className="d-flex justify-content-end mt-2 pb-lg-0 pb-4">
                                <Button
                                    className="task-btn"
                                    buttonText={"Save Changes"}
                                    type="submit"
                                    onClickHandler={formik.handleSubmit}
                                    isLoading={isLoading}
                                />
                            </div>
                        </div>
                    )}
                </Formik>
                {userDetails && userDetails.has_organization === 1 && userDetails.available_roles.includes('admin') && (
                    <>
                        <div className="organization">Organization</div>

                        <Formik initialValues={initialValues2} onSubmit={onSubmit2}>
                            {(formik) => (
                                <div className="p-5">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="label pt-2 pb-2">Organization Name</div>
                                            <InputField
                                                label=""
                                                className="task-input mb-4"
                                                name="name"
                                                isDisabled={false}
                                                fieldType="text"
                                                placeholder=""
                                            />
                                        </div>
                                    </div>

                                    <div className="col-6">
                                        <div className="label pt-2 pb-2">Organization Address</div>
                                        <div className="row">
                                            <div className="col-6">
                                                <InputField
                                                    label=""
                                                    className="task-input mb-4"
                                                    name="address_line1"
                                                    isDisabled={false}
                                                    fieldType="text"
                                                    placeholder="Line 1"
                                                />
                                            </div>

                                            <div className="col-6">
                                                <InputField
                                                    label=""
                                                    className="task-input mb-4"
                                                    name="address_line2"
                                                    isDisabled={false}
                                                    fieldType="text"
                                                    placeholder="Line 2"
                                                />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-6">
                                                <InputField
                                                    label=""
                                                    className="task-input mb-4"
                                                    name="city"
                                                    isDisabled={false}
                                                    fieldType="text"
                                                    placeholder="City"
                                                />
                                            </div>

                                            <div className="col-6">
                                                <InputField
                                                    label=""
                                                    className="task-input mb-4"
                                                    name="zip_code"
                                                    isDisabled={false}
                                                    fieldType="text"
                                                    placeholder="Postal Code"
                                                />
                                            </div>
                                        </div>

                                        <div className="col-6">
                                            <SelectField
                                                name="country"
                                                options={[
                                                    {
                                                        value: "sweden",
                                                        label: "Sweden",
                                                    },
                                                ]}
                                                label=""
                                                className="task-input mb-3"
                                                LabelclassName="register-lbl"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="label pt-2 pb-2">Organization Web URL</div>
                                        <InputField
                                            label=""
                                            className="task-input mb-4"
                                            name="url"
                                            isDisabled={false}
                                            fieldType="text"
                                            placeholder=""
                                        />
                                    </div>

                                    {/*<div className="col-12">*/}
                                    {/*  <div className="label pt-2 pb-2">Email</div>*/}
                                    {/*  <InputField*/}
                                    {/*    label=""*/}
                                    {/*    className="task-input mb-4"*/}
                                    {/*    name="email"*/}
                                    {/*    isDisabled={false}*/}
                                    {/*    fieldType="text"*/}
                                    {/*    placeholder=""*/}
                                    {/*  />*/}
                                    {/*</div>*/}

                                    <div className="d-flex justify-content-end mt-2 pb-lg-0 pb-4">
                                        <Button
                                            className="task-btn"
                                            buttonText={"Save Changes"}
                                            type="submit"
                                            onClickHandler={formik.handleSubmit}
                                            isLoading={isLoading}
                                        />
                                    </div>
                                </div>
                            )}
                        </Formik>
                        <div className="organization">Organizational Proficiency</div>
                        <Skills 
                            skills={organizationSkillList} 
                            updateSkillList={updateOrganizationSkillList}
                            isOrganizationSkills={true}
                        />
                    </>
                )}
            </div>
            {userDetails && userDetails.available_roles && 
             (userDetails.available_roles.includes('gig_worker') || 
              userDetails.available_roles.includes('consultant') || 
              userDetails.available_roles.includes('over_employee')) && (
                <>
                    <Skills skills={skillList} updateSkillList={updateSkillList}/>
                    <Language
                        languages={languageList}
                        updateLanguageList={updateLanguageList}
                    />
                    <Certification
                        certifications={certificationList}
                        updateCertificationList={updateCertificationList}
                    />
                    <Project
                        projects={projectList}
                        updateProjectList={updateProjectList}
                    />
                </>
            )}
        </div>
    );
};
