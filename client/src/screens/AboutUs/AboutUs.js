import React from "react";
import "./index.css";
import aboutus from "./qrmenu.png";

function AboutUs() {
  return (
    <div className="aboutUs_box">
      <img src={aboutus} alt="img" className="aboutus_img" />
      <span className="aboutus_title">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Modi
        temporibus dicta quisquam quas vero dignissimos, sunt et. Animi, dolor
        natus numquam doloremque labore alias. Necessitatibus quidem iure
        tenetur aliquid porro.
      </span>
    </div>
  );
}

export default AboutUs;
