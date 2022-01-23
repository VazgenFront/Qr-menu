/* eslint-disable jsx-a11y/accessible-emoji */
import axios from "axios";
import React, { useState } from "react";
import { Field, Form } from "react-final-form";
import { useHistory, useParams } from "react-router-dom";
import "./AdminAuth.css";

const AboutUs = () => {
  const history = useHistory();

  // eslint-disable-next-line no-unused-vars
  const [token, setToken] = useState("");
  const login = async (values) => {
    const username = values.login;
    const password = values.password;

    await axios
      .post("http://localhost:4000/api/account/authenticate", {
        username,
        password,
      })
      .then(async (res) => {
        console.log("res", res);
        await setToken(res.data.body.token);
        localStorage.setItem("adminToken", res.data.body.token);
      });

    // values.login = "";
    // values.password = "";

    // history.push(`/${id}/${cafeName}/admin-panel/dashboard`);
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
