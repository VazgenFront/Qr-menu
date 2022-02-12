/* eslint-disable jsx-a11y/accessible-emoji */
import axios from "axios";
import React, { useState } from "react";
import { Field, Form } from "react-final-form";
import "./AdminAuth.css";

const AdminAuth = () => {
  // eslint-disable-next-line no-unused-vars
  const [token, setToken] = useState("");
  const [authError, setError] = useState(false);

  const login = async (values) => {
    const username = values.login;
    const password = values.password;

    await axios
      .post("/api/account/authenticate", {
        username,
        password,
      })
      .then(async (res) => {
        const { styleId, username } = res.data.body.account;
        localStorage.setItem("cafeId", styleId);
        localStorage.setItem("cafeName", username);
        await setToken(res.data.body.token);
        localStorage.setItem("adminTkn", res.data.body.token);
        window.location.href = `/admin-panel/${styleId}/${username}/dashboard/home`;
      })
      .catch(() => setError(true));

    values.login = "";
    values.password = "";
  };

  return (
    <div className="auth__box">
      <Form
        onSubmit={login}
        render={({ handleSubmit, values }) => (
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

            <button
              className="auth_button"
              disabled={!values.login || !values.password}
              type="submit"
            >
              Click
            </button>
            {authError && (!values.login || !values.password) ? (
              <p className="error_text">Login or Password is incorrect</p>
            ) : null}
          </form>
        )}
      />
    </div>
  );
};

export default AdminAuth;
