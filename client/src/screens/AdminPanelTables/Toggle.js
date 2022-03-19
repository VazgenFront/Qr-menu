import React, { useState } from "react";
import "./AdminPanelTables.css";

export const Toggle = ({
  checked,
  setChecked,
  size = "default",
  disabled,
  offstyle = "btn-danger",
  onstyle = "btn-success",
}) => {
  let displayStyle = checked ? onstyle : offstyle;

  const handleChange = (e) => {
    setChecked(e.target.checked);
  };
  return (
    <div>
      <label>
        <span className={`${size} switch-wrapper`}>
          <input
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={(e) => handleChange(e)}
          />
          <span className={`${displayStyle} switch`}>
            <span className="switch-handle" />
          </span>
        </span>
      </label>
    </div>
  );
};
