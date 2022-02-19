import { useMutation } from "@apollo/client";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import {
  ADD__TEMP__CARD,
  REDUCE_MENU_ITEM_COUNT,
  REMOVE_CART_ITEM,
} from "../../queries/queries";
import ReadMore from "../ReadMore/Readmore";
import cancel from "./cancel.png";
import "./PreOrderWrapper.css";

const PreOrderItem = ({ item, setNeedRefresh, needRefresh }) => {
  const state = useContext(ThemeContext);

  const reserveToken = localStorage.getItem("token");
  const cafeId = localStorage.getItem("cafeId");
  const tableId = localStorage.getItem("tableId");

  const [addTempCart] = useMutation(ADD__TEMP__CARD);
  const [reduceItem] = useMutation(REDUCE_MENU_ITEM_COUNT);
  const [removeCartItem] = useMutation(REMOVE_CART_ITEM);

  const addToCard = () => {
    const menuItemId = Number(item.menuItemId);
    addTempCart({
      variables: {
        accountId: cafeId,
        tableId: tableId,
        reserveToken: reserveToken,
        orderList: [{ menuItemId: menuItemId, itemCount: 1 }],
      },
    }).then((data) => {
      state.getTotalItemsCount(data.data.addToTempCart.tempTotalItems);
      return data.data?.addOrder?.totalItems;
    });

    return setNeedRefresh(!needRefresh);
  };

  const removeFromCart = () => {
    const menuItemId = Number(item.menuItemId);

    reduceItem({
      variables: {
        accountId: cafeId,
        tableId: tableId,
        reserveToken: localStorage.getItem("token"),
        menuItemId,
      },
    }).then((data) => {
      state.getTotalItemsCount(data.data.reduceOneMenuItemCount.tempTotalItems);
      return data.data?.addOrder?.totalItems;
    });
    setNeedRefresh(!needRefresh);
  };

  const removeItemFromCart = () => {
    const menuItemId = Number(item.menuItemId);

    removeCartItem({
      variables: {
        accountId: cafeId,
        tableId: tableId,
        reserveToken: localStorage.getItem("token"),
        menuItemId,
      },
    }).then((data) => data.data?.removeMenuItemFromOrder?.totalItems);
    setNeedRefresh(!needRefresh);
  };

  return (
    <div className="preorder__item">
      <img src={item?.img} alt="img" className="preorder__item__img" />
      <div className="preorder__item__info__box">
        <div className="name__cancel">
          <span className="preorder__item__info__name">
            {item?.itemName.slice(0, 8)}...
          </span>

          <img
            src={cancel}
            alt="img"
            className="cancel__btn"
            onClick={removeItemFromCart}
          />
        </div>
        {/* <span className="preorder__item__info__description">{item.itemName}</span> */}
        <span className="preorder__item__info__description">
          <ReadMore>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam
            repudiandae repellat perspiciatis sit, beatae eaque nihil
          </ReadMore>
        </span>
        <span className="preorder__item__info__price">
          {item.itemTotalPrice} {item.currency}
        </span>
        <div className="preorder__item__info__pricequant">
          <div className="minus_box" onClick={removeFromCart}>
            -
          </div>
          <div className="count_box">{item.itemCount}</div>
          <div className="plus_box" onClick={addToCard}>
            +
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreOrderItem;
