/* eslint-disable jsx-a11y/accessible-emoji */
import React from "react";
import { Form, Field } from "react-final-form";
import "./AdminAuth.css";

const AboutUs = () => {
  const login = async (values) => {
    console.log("values", values);
    values.login = "";
    values.password = "";
  };

  return (
    <div className="auth__box">
      <Form
        onSubmit={login}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className="auth__form">
            <div className="input__box">
              <label className="input__box__label">Login</label>
              <Field
                className="textarea"
                name="login"
                component="input"
                type="text"
                placeholder="Enter your login..."
              />
            </div>
            <div className="input__box" style={{ marginTop: "20px" }}>
              <label className="input__box__label">Password</label>
              <Field
                className="textarea"
                name="password"
                component="input"
                type="password"
                placeholder="Enter your password..."
              />
            </div>

            <button className="auth_button" type="submit">
              Click
            </button>
          </form>
        )}
      />
    </div>
  );
};

export default AboutUs;
