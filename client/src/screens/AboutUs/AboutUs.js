import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./index.css";

function AboutUs() {
  // const history = useHistory();

  // const cleanLocaleStorageIfIsNotClientPage = () => {
  //   if (history.location.pathname === "/") {
  //     localStorage.removeItem("cafeName");
  //     localStorage.removeItem("cafeId");
  //     JSON.stringify(localStorage.removeItem("styles"));
  //     JSON.stringify(localStorage.removeItem("menuItems"));
  //   }
  // };

  // useEffect(() => {
  //   cleanLocaleStorageIfIsNotClientPage();
  // }, [history]);

  return (
    <div style={{ color: "red" }}>
      <h1>About US</h1>
    </div>
  );
}

export default AboutUs;
