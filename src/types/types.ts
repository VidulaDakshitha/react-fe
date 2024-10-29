import { ReactNode } from "react";
import { getTaskApiAttributes } from "./api_types";

export type ProtectedRouteProps = {
    children: ReactNode;
    requiredRoles?: string[]; // Roles allowed for this route
  };

export type ApiAttributes = {
  data:any;
  status:number;
}  

export type SocialLoginButtonProps={
  platform:string; 
  onClick:()=>void; 
  isDisabled:boolean; 
  isLoading:boolean; 
  className?:string;
}

export type passwordProps = {
  label: string;
  name: any;
  LabelclassName?: string;
  classname?:string;
};

export type ErrorAlertProps = {
  error:string;
}

export type HeaderProps = {
  user:string;
}


export type ModalProps = {
  show:boolean;
  children: ReactNode;
  toggle:any;
  ModalHeader:string;
  size?:any;
}


export type createTaskProps = {
  closeModal:()=>void;
  recallData:()=>void;
}

export type createConnectionProps ={
  closeModal:()=>void;
  recallData:()=>void;
  editConnectionDetails?:any
}


export type TaskViewProps = {
  taskData:getTaskApiAttributes | undefined;
}

export type TaskUpdateProps = {
  task_id:string,
  taskData:getTaskApiAttributes | undefined;
  closeModal:()=>void;
  recallData:()=>void;

}


export type NoDataProps = {
noData:string,
noDataDesc:string

}