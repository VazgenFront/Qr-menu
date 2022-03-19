import { useMutation } from "@apollo/client";
import { useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import {
  ADD__TEMP__CARD,
  REDUCE_MENU_ITEM_COUNT,
  REMOVE_CART_ITEM,
} from "../../queries/queries";
import ReadMore from "../ReadMore/Readmore";
import cancel from "./cancel.png";
import "./PreOrderWrapper.css";

const PreOrderItem = ({ item, setTotalTempCartPrice, totalTempCartPrice }) => {
  const state = useContext(ThemeContext);
  const reserveToken = localStorage.getItem("token");
  const cafeId = localStorage.getItem("cafeId");
  const tableId = localStorage.getItem("tableId");
  const [itemCount, setItemCount] = useState(item.itemCount);
  const [itemPrice, setItemPrice] = useState(item.itemTotalPrice);

  const [addTempCart] = useMutation(ADD__TEMP__CARD);
  const [reduceItem] = useMutation(REDUCE_MENU_ITEM_COUNT);
  const [removeCartItem] = useMutation(REMOVE_CART_ITEM);

  const addToCard = async () => {
    const menuItemId = Number(item.menuItemId);
    await addTempCart({
      variables: {
        accountId: cafeId,
        tableId: tableId,
        reserveToken: reserveToken,
        orderList: [{ menuItemId: menuItemId, itemCount: 1 }],
      },
    }).then((data) => {
      state.getTotalItemsCount(data.data.addToTempCart.tempTotalItems);
      const { tempCart } = data.data?.addToTempCart;
      const curr = tempCart.filter((itm) => {
        return itm.menuItemId === item.menuItemId;
      });

      setItemCount(() => {
        return curr[0]?.itemCount;
      });

      const totalPrice = tempCart.reduce(function (acc, prev) {
        return (acc += prev.itemTotalPrice);
      }, 0);

      setTotalTempCartPrice(totalPrice);

      setItemPrice(() => {
        return curr[0]?.itemTotalPrice;
      });
    });
  };

  const ReduceFromCart = async () => {
    const menuItemId = Number(item.menuItemId);
    itemCount > 1 &&
      (await reduceItem({
        variables: {
          accountId: cafeId,
          tableId: tableId,
          reserveToken: localStorage.getItem("token"),
          menuItemId,
        },
      })
        .then((data) => {
          state.getTotalItemsCount(
            data.data.reduceFromTempCartOneMenuItem.tempTotalItems
          );
          const { tempCart } = data.data?.reduceFromTempCartOneMenuItem;
          console.log("tempCart", tempCart);
          const curr = tempCart.filter((itm) => {
            return itm.menuItemId === item.menuItemId;
          });

          setItemCount(() => {
            return curr[0]?.itemCount;
          });

          const totalPrice = tempCart.reduce(function (acc, prev) {
            return (acc += prev.itemTotalPrice);
          }, 0);

          setTotalTempCartPrice(totalPrice);

          setItemPrice(() => {
            return curr[0]?.itemTotalPrice;
          });
        })
        .catch((e) => {
          console.log("e", e);
        }));
  };

  const removeItemFromCart = async () => {
    const menuItemId = Number(item.menuItemId);

    await removeCartItem({
      variables: {
        accountId: cafeId,
        tableId: tableId,
        reserveToken: localStorage.getItem("token"),
        menuItemId,
      },
    }).then((data) => {
      state.getTotalItemsCount(
        data.data.removeFromTempCartMenuItem.tempTotalItems
      );

      const { tempCart } = data.data?.removeFromTempCartMenuItem;

      const totalPrice = tempCart.reduce(function (acc, prev) {
        return (acc += prev.itemTotalPrice);
      }, 0);

      setTotalTempCartPrice(totalPrice);

      setItemCount(0);
    });
  };

  if (!itemCount) {
    return <></>;
  }

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
          {itemPrice} {item.currency}
        </span>
        <div className="preorder__item__info__pricequant">
          <div className="minus_box" onClick={ReduceFromCart}>
            -
          </div>
          <div className="count_box">{itemCount}</div>
          <div className="plus_box" onClick={addToCard}>
            +
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreOrderItem;
