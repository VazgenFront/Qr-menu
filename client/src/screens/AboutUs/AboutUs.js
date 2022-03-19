import React from "react";
import "./index.css";
import aboutus from "./qrmenu.png";

function AboutUs() {
  return (
    <div className="aboutUs_box">
      <div className="vector__img__up">
        <img className="about__us__img" src={aboutus} alt="" />
        <span className="welcome__title">We are glad to have you with us!</span>
        <span className="welcome__text">
          The QR-menu was created for your safety and convenience. It will give
          you new opportunities: take a closer look at the dishes, allow you to
          make an online order and much more. Enjoy!
        </span>
        <span className="enjoy__txt">Enjoy!</span>
      </div>

      <div className="vector__img__down">
        <span className="steps__txt">
          Open your camera and scan QR Code to start your jorney!
        </span>
      </div>
    </div>
  );
}

export default AboutUs;
