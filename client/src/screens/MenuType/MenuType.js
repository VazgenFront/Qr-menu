import React, { useState, useEffect, useContext } from "react";
import { useParams, NavLink, useHistory } from "react-router-dom";
import { GET_MENUTYPE_INFO, MAKE_ORDER } from "../../queries/queries";
import { useQuery, useMutation } from "@apollo/client";
import "./menuTypes.css";
import { ThemeContext } from "../../context/ThemeContext";
import BuyingInfo from "../../components/BuyingInfo/BuyingInfo";

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

  const history = useHistory();

  const [
    addOrder,
    { loading: loadingAddOrder, data: addOrderData, error: addOrderDataError },
  ] = useMutation(MAKE_ORDER);

  useEffect(() => {
    data?.menuItemsOfType && setMenuTypes(() => [...data?.menuItemsOfType]);
  }, [data]);

  const { fontFamily, navbarTitleColor, navbarBgColor } = state.styles;

  const addToCard = (id) => {
    const menuItemId = Number(id);
    addOrder({
      variables: {
        accountId: cafeId,
        tableId: tableId,
        reserveToken: localStorage.getItem("token"),
        orderList: [{ menuItemId: menuItemId, itemCount: 1 }],
      },
    });
    history.push(`/${cafeName}/${cafeId}/${tableId}/card`);
  };

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
              addToCard={addToCard}
            />
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default MenuType;
