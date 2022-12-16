import React from "react";
import "./Header.scss";

export const Header = (props) => {
  return <h1 {...props}>{props.children}</h1>;
};
