import { useMutation } from "@apollo/client";
import React, { useContext, useEffect } from "react";
import { NavLink, useHistory, useParams } from "react-router-dom";
import BuyingInfo from "../../components/Navbar/BuyingInfo/BuyingInfo";
import { ThemeContext } from "../../context/ThemeContext";
import { GET_TABBLE_TOKEN, MAKE_ORDER } from "../../queries/queries";
import "./Cafe.css";

const Cafe = () => {
  const state = useContext(ThemeContext);
  const { cafeName, cafeId, tableId } = useParams();
  const history = useHistory();
  const [
    getToken,
    { loading: loadingToken, error: tokenError, data: tokenData },
  ] = useMutation(GET_TABBLE_TOKEN);

  const [
    addOrder,
    { loading: loadingAddOrder, data: addOrderData, error: addOrderDataError },
  ] = useMutation(MAKE_ORDER);

  useEffect(() => {
    localStorage.setItem("cafeId", cafeId);
    localStorage.setItem("cafeName", cafeName);
    localStorage.setItem("tableId", tableId);
    state.getCafeName(cafeName);
    state.getCafeId(cafeId);
    state.getTableId(tableId);

    !localStorage.getItem("token") &&
      getToken({
        variables: {
          accountId: cafeId,
          tableId: tableId,
        },
      });
  }, []);

  const mockedInfo = [];
  mockedInfo.push(state.menuItems);
  const newMockedTypes = mockedInfo.flat();

  const { fontFamily, navbarTitleColor, navbarBgColor } = state.styles;

  const addToCard = (e, id) => {
    addOrder({
      variables: {
        accountId: cafeId,
        tableId: tableId,
        reserveToken: localStorage.getItem("token"),
        orderList: [{ menuItemId: id, itemCount: 1 }],
      },
    });
    history.push(`/${cafeName}/${cafeId}/${tableId}/card`);
  };

  addOrderData?.addOrder?.cart &&
    localStorage.setItem("items", JSON.stringify(addOrderData?.addOrder?.cart));

  const isEmpty = Object.keys(state.styles).length === 0;

  return (
    <>
      {isEmpty ? null : (
        <div className="cafeInfo__box" style={{ fontFamily: fontFamily }}>
          <span className="cafeInfo__title" style={{ color: navbarTitleColor }}>
            Dishes of the day
          </span>

          <div className="cafeInfo__recommended">
            {newMockedTypes.map((item, index) => (
              <NavLink
                to={`/${cafeName}/${cafeId}/${tableId}/item/${item?._id}`}
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
      )}
    </>
  );
};

export default Cafe;
