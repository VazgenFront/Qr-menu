/* eslint-disable jsx-a11y/accessible-emoji */
import React from "react";
import { Form, Field } from "react-final-form";

const AboutUs = () => {
  const login = async (values) => {
    console.log("values", values);
  };

  return (
    <div>
      <Form
        onSubmit={login}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div>
              <label>First Name</label>
              <Field
                name="firstName"
                component="input"
                type="text"
                placeholder="First Name"
              />
            </div>
            <div>
              <label>Last Name</label>
              <Field
                name="lastName"
                component="input"
                type="text"
                placeholder="Last Name"
              />
            </div>

            <button type="submit">Click</button>
          </form>
        )}
      />
    </div>
  );
};

export default AboutUs;
