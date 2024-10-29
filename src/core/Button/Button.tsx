import React from "react";
import "./Button.scss";
import {ButtonProps} from "../../types/core";

const Button = ({
                    isDisabled,
                    buttonText,
                    onClickHandler,
                    className,
                    isLoading,
                    type = "button", // Default to 'button' if not specified
                    style,
                    icon,
                    ariaLabel,
                    children,
                }: ButtonProps) => {
    return (
        <button
            type={type}
            disabled={isDisabled || isLoading} // Consider the button disabled also when loading
            className={`${className} ${isLoading ? "loading" : ""}`}
            onClick={onClickHandler}
            style={style} // Apply any passed inline styles
            aria-label={ariaLabel || buttonText} // Use buttonText as fallback aria-label
        >
            {isLoading ? (
                <div className="loader"></div>
            ) : (
                <>
                    {icon && <span className="button-icon">{icon}</span>}{" "}
                    {/* Render icon if provided */}
                    {children ? children : buttonText}
                </>
            )}
        </button>
    );
};

export default Button;
