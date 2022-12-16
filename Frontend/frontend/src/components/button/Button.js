import React from "react";
import "./Button.scss";

export const Button = (props) => {
  return (
    <button className="btn" {...props}>
      {props.children}
    </button>
  );
};

export const SmallButton = (props) => {
  return (
    <button className={`btn-small ${props.isactive && "active"}`} {...props}>
      {props.children}
    </button>
  );
};
