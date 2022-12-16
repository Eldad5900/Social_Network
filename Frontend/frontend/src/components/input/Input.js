import React from "react";
import "./Input.scss";

export const Input = (props) => {
  return (
    <input className="input" {...props}>
      {props.children}
    </input>
  );
};

export const TextArea = (props) => {
  return (
    <textarea className="input txtarea" {...props}>
      {props.children}
    </textarea>
  );
};
