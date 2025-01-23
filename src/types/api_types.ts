export type loginApiAttributes = {
    email: string;
    password: string;
}

export type forgotPassApiAttributes = {
    email: string;
}

export type registerApiAttributes = {
    email: string;
    phone_no: string;
    first_name: string;
    last_name: string;
    user_name: string;
    is_client: boolean,
    is_freelancer: boolean
}


export type setPasswordApiAttributes = {
    password: string;
}


export type createTaskApiAttributes = {
    title: string,
    description: string,
    budget: number,
    currency: string,
    bid_type: boolean | string,
    bid_deadline: string,
    task_deadline: string,
    acceptance_criteria: string,
    required_skills?:any;
    sub_contractors?:any,
    sub_organization_ids?:any,

}

export type getTaskApiAttributes = {
    id: number,
    title: string,
    skills:any,
    description: string,
    budget: string,
    currency: string,
    bid_type: string,
    job_type:string,
    bid_deadline: string,
    task_deadline: string,
    exit_criteria:string,
    communication_deadline:string,
    communication_type:string,
    is_post_approved:number,
    is_post_rejected:number,
    acceptance_criteria: string,
    created_by: number,
    is_accepted:number,
    attachments?:any;
    is_completed:number,
    created_by_name?:string,
    created_on: string
}

export type updateSkillAPIAttributes = {
    required_skills: number[]
}


export type localeAttributes = {
    id?: number,
    language: number,
    expertise_level: string,
    is_delete?: number,
}


export type updateLanguageAPIAttributes = {
    locales: localeAttributes[]
}

export type certificationAttributes = {
    id?: number,
    title: string,
    institution: string,
    description: string,
    from_date: string,
    to_date: string,
    is_delete?: number,
}

export type updateCertificationAPIAttributes = {
    certifications: certificationAttributes[]
}

export type projectAttributes = {
    id?: number,
    title: string,
    description: string,
    from_date: string,
    to_date: string,
    is_delete?: number,
}

export type updateProjectAPIAttributes = {
    projects: projectAttributes[]
}

export type fIdAttributes = {
    user_id?: number,
    product_id: number,
    image: string
}