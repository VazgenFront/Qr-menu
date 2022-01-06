import React from "react";
import "./index.css";
import aboutus from "./qrmenu.png";

function AboutUs() {
  return (
    <div className="aboutUs_box">
      <img src={aboutus} alt="img" className="aboutus_img" />
      <span className="aboutus_title">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto
        ratione ducimus molestias laborum, quod voluptas quidem aspernatur quo
        quisquam inventore exercitationem! Commodi laboriosam, cum sunt velit
        est alias veniam sint. US
      </span>
    </div>
  );
}

export default AboutUs;
