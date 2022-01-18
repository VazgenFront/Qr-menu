import { useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import BuyingInfo from "../../components/BuyingInfo/BuyingInfo";
import { ThemeContext } from "../../context/ThemeContext";
import { GET_MENUTYPE_INFO, MAKE_ORDER } from "../../queries/queries";
import "./menuTypes.css";

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
    const serverCafeId = Number(cafeId);
    const serverTableId = Number(tableId);

    addOrder({
      variables: {
        accountId: serverCafeId,
        tableId: serverTableId,
        reserveToken: localStorage.getItem("token"),
        orderList: [{ menuItemId: menuItemId, itemCount: 1 }],
      },
    });
  };

  return (
    <div className="menuTypes__box" style={{ background: navbarBgColor }}>
      <div className="cafeInfo__recommended">
        {menuTypes.map((item, index) => (
          <div
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuType;
