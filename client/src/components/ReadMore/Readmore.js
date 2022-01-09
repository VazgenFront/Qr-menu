import React, { useState, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import "./Readmore.css";

const ReadMore = ({ children }) => {
  const text = children;
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  const state = useContext(ThemeContext);
  const { navbarTitleColor } = state.styles;
  return (
    <p className="text">
      {isReadMore ? text.slice(0, 150) : text}
      <span
        onClick={toggleReadMore}
        className="read-or-hide"
        style={{ color: navbarTitleColor }}
      >
        {isReadMore ? "...read more" : " show less"}
      </span>
    </p>
  );
};

export default ReadMore;
