import React, { useContext, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import "./Cafe.css";

const Cafe = () => {
  const state = useContext(ThemeContext);
  const { cafeName, cafeId } = useParams();
  const history = useHistory();

  useEffect(() => {
    localStorage.setItem("cafeId", cafeId);
    localStorage.setItem("cafeName", cafeName);
    state.getCafeName(cafeName);
    state.getCafeId(cafeId);
  }, []);

  const mockedInfo = [];
  mockedInfo.push(state.menuItems);
  const newMockedTypes = mockedInfo.flat();

  const { fontFamily, navbarTitleColor, navbarBgColor } = state.styles;

  const addToCard = (id) => {
    console.log("id", id);
    history.push(`/${cafeName}/card/${cafeId}`);
  };

  return (
    <div className="cafeInfo__box" style={{ fontFamily: fontFamily }}>
      <span className="cafeInfo__title" style={{ color: navbarTitleColor }}>
        Dishes of the day
      </span>

      <div className="cafeInfo__recommended">
        {newMockedTypes.map((item, index) => (
          <div
            className="cafeInfo__menuItem"
            key={index}
            style={{ background: navbarBgColor }}
          >
            <img
              src={item?.img}
              alt="img"
              className="cafeInfo__menuItem__img"
            />
            <span
              className="cafeInfo__menuItems__name"
              style={{ color: navbarTitleColor }}
            >
              {item?.name}
            </span>
            <span
              className="cafeInfo__menuItem__description"
              style={{ color: navbarTitleColor }}
            >
              {/* {item?.description} */}
              Հորթի միս, բրոկկոլի, սպանախ, բուլղարական պղպեղ, քունջութ, բազուկի
              ճավ
            </span>
            <div className="buying__info">
              <span
                className="cafeInfo__menuItem__price"
                style={{ color: navbarTitleColor }}
              >
                {item?.price} AMD
              </span>
              <button
                className="add__card_button"
                style={{ background: navbarTitleColor }}
                onClick={() => addToCard(item?._id)}
              >
                Buy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cafe;
