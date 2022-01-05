import React, { useContext, useEffect } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useParams } from "react-router-dom";

const MenuType = () => {
  const { cafeName, menuType } = useParams();

  return <div>It is Menus {menuType}</div>;
};

export default MenuType;
