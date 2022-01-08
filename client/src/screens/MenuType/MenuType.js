import React, { useState, useEffect, useContext } from "react";
import { useParams, NavLink } from "react-router-dom";
import { GET_MENUTYPE_INFO } from "../../queries/queries";
import { useQuery } from "@apollo/client";
import "./menuTypes.css";
import { ThemeContext } from "../../context/ThemeContext";
import BuyingInfo from "../../components/Navbar/BuyingInfo/BuyingInfo";

const MenuType = () => {
  const { cafeId, menuType, cafeName, tableId } = useParams();

  const [menuTypes, setMenuTypes] = useState([]);

  const state = useContext(ThemeContext);

  const { data, error, loading } = useQuery(GET_MENUTYPE_INFO, {
    variables: {
      accountId: cafeId,
      type: menuType,
    },
  });

  useEffect(() => {
    data?.menuItemsOfType && setMenuTypes(() => [...data?.menuItemsOfType]);
  }, [data]);

  const { fontFamily, navbarTitleColor, navbarBgColor } = state.styles;

  return (
    <div className="menuTypes__box" style={{ background: navbarBgColor }}>
      <div className="cafeInfo__recommended">
        {menuTypes.map((item, index) => (
          <NavLink
            to={`/${cafeName}/${cafeId}/${tableId}/item/${item?._id}`}
            className="menuType__menuItem"
            key={index}
            style={{
              background: navbarBgColor,
              border: `4px solid ${navbarTitleColor}`,
            }}
          >
            <img
              src={item?.img}
              alt="img"
              className="menuType__menuItem__img"
            />
            <span
              className="menuType__menuItems__name"
              style={{ color: navbarTitleColor }}
            >
              {item?.name}
            </span>
            <span
              className="menuType__menuItem__description"
              style={{ color: navbarTitleColor }}
            >
              {item?.description}
            </span>
            <BuyingInfo
              navbarTitleColor={navbarTitleColor}
              item={item}
              // addToCard={addToCard}
            />
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default MenuType;
