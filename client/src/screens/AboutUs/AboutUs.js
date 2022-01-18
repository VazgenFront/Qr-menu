import React from "react";
import "./index.css";
import aboutus from "./qrmenu.png";

function AboutUs() {
  return (
    <div className="aboutUs_box">
      <img src={aboutus} alt="img" className="aboutus_img" />
      <span className="aboutus_title">
        Welcome to QR-menu company! We are glad to have you with us! The QR-menu
        was created for your safety and convenience. It will give you new
        opportunities: take a closer look at the dishes, allow you to make an
        online order and much more. Enjoy!
      </span>
    </div>
  );
}

export default AboutUs;
