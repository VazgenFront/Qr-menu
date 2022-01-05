import React, { useContext, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import {} from "react/cjs/react.production.min";
import { ThemeContext } from "../../context/ThemeContext";
import "./Cafe.css";

const Cafe = () => {
  const state = useContext(ThemeContext);
  const { cafeName } = useParams();

  useEffect(() => {
    state.getCafeName(cafeName);
  }, []);

  const mockedInfo = [];
  mockedInfo.push(state.menuItems);
  const newMockedTypes = mockedInfo.flat();

  const { fontFamily, navbarTitleColor, mostBookedBorder } = state.styles;

  console.log("newMockedTypes", newMockedTypes);

  return (
    <div className="cafeInfo__box" style={{ fontFamily: fontFamily }}>
      <span className="cafeInfo__title" style={{ color: navbarTitleColor }}>
        Welcome to {cafeName} !
      </span>

      <div
        className="cafeInfo__recommended"
        style={{ border: `4px solid ${mostBookedBorder}` }}
      >
        {newMockedTypes.map((item, index) => (
          <div className="cafeInfo__menuItem" key={index}>
            <span>{item?.name}</span>
            <img
              src={item?.img}
              alt="img"
              className="cafeInfo__menuItem__img"
            />
            <span className="cafeInfo__menuItem__description">
              {item?.description}
            </span>
            <span className="cafeInfo__menuItem__price">
              {item?.price} AMD
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cafe;
