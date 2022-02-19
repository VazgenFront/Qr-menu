import React, { useState, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import "./Readmore.css";

const ReadMore = ({ children, isName }) => {
  const text = children;
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  const state = useContext(ThemeContext);
  const { navbarTitleColor } = state.styles;
  return <p className="text">{text.slice(0, 60)}...</p>;
};

export default ReadMore;
