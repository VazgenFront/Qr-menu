import { useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import BuyingInfo from "../../components/BuyingInfo/BuyingInfo";
import { ThemeContext } from "../../context/ThemeContext";
import { GET_MENU_ITEM, MAKE_ORDER } from "../../queries/queries";
import "./MenuItem.css";

const MenuItem = () => {
  const [item, setItem] = useState({});
  const history = useHistory();
  const { itemId, cafeName, cafeId, tableId } = useParams();
  const state = useContext(ThemeContext);
  const { navbarBgColor, navbarTitleColor } = state.styles;

  const [
    addOrder,
    { loading: loadingAddOrder, data: addOrderData, error: addOrderDataError },
  ] = useMutation(MAKE_ORDER);

  const { data, loading, error } = useQuery(GET_MENU_ITEM, {
    variables: {
      _id: itemId,
    },
  });

  useEffect(() => {
    setItem(() => ({
      ...data?.menuItem,
    }));
  }, [data]);

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
  };

  return (
    <div className="menuItem__box" style={{ background: navbarBgColor }}>
      <span className="menuItem__title" style={{ color: navbarTitleColor }}>
        {item?.name}
      </span>
      <img src={item?.img} alt="img" className="menuItem__img" />
      <span
        className="menuItem__description"
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
  );
};

export default MenuItem;
