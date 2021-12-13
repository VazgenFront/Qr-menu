import React from "react";
import { useParams } from "react-router-dom"
const MainPage = () => {
  const { cafeName } = useParams();
  return (
    <div>
      <h1 style={{ fontSize: "22px", color: "red" }}>
        Our Home Page {cafeName}
      </h1>
    </div>
  );
};

export default MainPage;
