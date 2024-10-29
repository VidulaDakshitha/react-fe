import { FieldHookConfig } from "formik";
import { ReactNode } from "react";

export type imageProps={
  alt:string;
  src:string;
  className?:string;
}

export interface ButtonProps {
  isDisabled?: boolean;
  buttonText?: string;
  onClickHandler?: () => void;
  className?: string;
  isLoading?: boolean;
  type?: 'button' | 'submit' | 'reset'; // Optional prop for specifying button type
  style?: React.CSSProperties; // Optional prop for inline styles
  icon?: ReactNode; // Optional prop for including an icon
  ariaLabel?: string; // Optional prop for accessibility
  children?:ReactNode;
}


export type InputProps = {
  id?:string;
  label?:string; 
  fieldType?:string, 
  name:string; 
  className?:string; 
  isDisabled?:boolean;
  placeholder:string;
  LabelclassName?:string; 
  onChange?:any;
}& FieldHookConfig<string>;


export type SelectProps = {
  id?:string;
  label?:string; 
  name:string; 
  className?:string; 
  isDisabled?:boolean;
  options:any[];
  LabelclassName?:string; 
  onChange2?:any
}& FieldHookConfig<string>;
