import { useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BuyingInfo from "../../components/BuyingInfo/BuyingInfo";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import ReadMore from "../../components/ReadMore/Readmore";
import Spinner from "../../components/Spinner/Spinner";
import { ThemeContext } from "../../context/ThemeContext";
import { GET_MENUTYPE_INFO, ADD__TEMP__CARD } from "../../queries/queries";
import "./menuTypes.css";

const MenuType = () => {
  const { cafeId, menuType, tableId } = useParams();

  const [menuTypes, setMenuTypes] = useState([]);

  const state = useContext(ThemeContext);

  const { data, error, loading } = useQuery(GET_MENUTYPE_INFO, {
    variables: {
      accountId: cafeId,
      type: menuType,
    },
  });

  const [addOrder, { loading: loadingAddOrder, error: addOrderDataError }] =
    useMutation(ADD__TEMP__CARD);

  useEffect(() => {
    data?.menuItemsOfType && setMenuTypes(() => [...data?.menuItemsOfType]);
  }, [data]);

  const { navbarTitleColor, navbarBgColor } = state.styles;

  const addToCard = async (id) => {
    const menuItemId = Number(id);

    const totalItemsCount = await addOrder({
      variables: {
        accountId: cafeId,
        tableId: tableId,
        reserveToken: localStorage.getItem("token"),
        orderList: [{ menuItemId: menuItemId, itemCount: 1 }],
      },
    }).then((data) => data.data?.addOrder?.totalItems);

    state.getTotalItemsCount(totalItemsCount);
  };

  if (loading) {
    return <Spinner color={navbarTitleColor} />;
  }

  if (error || addOrderDataError) {
    return (
      <ErrorMessage
        error={error || addOrderDataError}
        color={navbarTitleColor}
      />
    );
  }

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
              <ReadMore>{item?.description}</ReadMore>
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
