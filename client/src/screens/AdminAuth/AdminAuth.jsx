import React from "react";
import { useParams } from "react-router-dom";
import "./Admin.css";

const AdminAuth = () => {
  const { cafeName } = useParams();
  return (
    <div className="admin-auth">
      <span
        style={{
          color: "#fff",
          fontSize: "40px",
        }}
      >
        {cafeName} Admin-Panel
      </span>
    </div>
  );
};

export default AdminAuth;
