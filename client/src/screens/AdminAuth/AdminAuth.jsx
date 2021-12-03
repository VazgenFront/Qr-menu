import React from "react";
import { AdminAuthWrapper } from "./AdminAuth.styles";
import { useParams } from "react-router-dom";
const AdminAuth = () => {
  const { cafeName } = useParams();
  return (
    <AdminAuthWrapper>
      <span
        style={{
          color: "#fff",
          fontSize: "40px",
        }}
      >
        {cafeName} Admin-Panel
      </span>
    </AdminAuthWrapper>
  );
};

export default AdminAuth;
