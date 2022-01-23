import React, { useContext, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { GET_TABBLE_TOKEN, MAKE_ORDER } from "../../queries/queries";
import { useParams } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import "./Cafe.css";
import ReadMore from "../../components/ReadMore/Readmore";
import Spinner from "../../components/Spinner/Spinner";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";

const Cafe = () => {
  const state = useContext(ThemeContext);
  const { cafeName, cafeId, tableId } = useParams();
  const [getToken, { loading: loadingToken, error: tokenError }] =
    useMutation(GET_TABBLE_TOKEN);

  const [addOrder, { data: addOrderData }] = useMutation(MAKE_ORDER);

  // localStorage.setItem("token", "ad3d1921-1502-49ee-ad69-5b6ec4e13440");

  useEffect(() => {
    localStorage.setItem("cafeName", cafeName);
    localStorage.setItem("tableId", tableId);
    localStorage.setItem("cafeId", cafeId);
    state.getCafeName(cafeName);
    state.getCafeId(cafeId);
    state.getTableId(tableId);

    !localStorage.getItem("token") &&
      getToken({
        variables: {
          accountId: Number(cafeId),
          tableId: Number(tableId),
        },
      }).then((data) =>
        localStorage.setItem("token", data?.data?.reserveTable?.reserveToken)
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname]);

  const mockedInfo = [];
  mockedInfo.push(state.menuItems);
  const newMockedTypes = mockedInfo.flat();

  const { fontFamily, navbarTitleColor, navbarBgColor } = state.styles;

  const addToCard = (id) => {
    const menuItemId = Number(id);
    const serverCafeId = Number(cafeId);
    const serverTableId = Number(tableId);
    console.log("serverCafeId", serverCafeId);
    addOrder({
      variables: {
        accountId: serverCafeId,
        tableId: serverTableId,
        reserveToken: localStorage.getItem("token"),
        orderList: [{ menuItemId: menuItemId, itemCount: 1 }],
      },
    }).then((data) => console.log(data.data.addOrder.totalItems));
  };

  addOrderData?.addOrder?.cart &&
    localStorage.setItem("items", JSON.stringify(addOrderData?.addOrder?.cart));
  const isEmpty = Object.keys(state.styles).length === 0;

  if (loadingToken) {
    return <Spinner color={navbarTitleColor} />;
  }

  if (tokenError) {
    return (
      <ErrorMessage error={tokenError?.message} color={navbarTitleColor} />
    );
  }

  return (
    <>
      {isEmpty ? null : (
        <div
          className="cafeInfo__box"
          style={{ fontFamily: fontFamily, background: navbarBgColor }}
        >
          <span className="cafeInfo__title" style={{ color: navbarTitleColor }}>
            Dishes of the day
          </span>
          <div className="cafeInfo__recommended">
            {newMockedTypes.map((item, index) => (
              <div
                className="cafeInfo__menuItem"
                key={index}
                style={{ border: `4px solid ${navbarTitleColor}` }}
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
                  <ReadMore>{item?.description}</ReadMore>
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
      )}
    </>
  );
};

export default Cafe;
