import { useState } from "react";
import { ModalWrapper } from "./ModalWrapper";
import axios from "axios";
import { useToggleModalOpen } from "../../utils";
export const Button = ({ item, token, needRefresh, setNeedRefresh }) => {
  const [reserved, setReserved] = useState(item.reserved);
  const [tableCart, setTableCart] = useState({ cart: [], tempCart: [] });
  const { addModalOpen, openAddModal, closeAddModal } = useToggleModalOpen();

  const getTables = (e) => {
    e.preventDefault();

    if (reserved) {
      setNeedRefresh(true);
      axios.post(
        "http://localhost:4000/api/account/closeTable",
        { tableId: item.tableId },
        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      setReserved(!reserved);
    }
  };

  const getTableOrder = () => {
    axios
      .get("http://localhost:4000/api/account/tableOrder", {
        headers: { "x-access-token": token },
        params: { tableId: item.tableId },
      })
      .then((data) => {
        setTableCart((prevState) => {
          return {
            ...prevState,
            cart: data.data.order.cart,
            tempCart: data.data.order.tempCart,
          };
        });
      });

    openAddModal();
  };

  return (
    <div style={{ display: "flex" }}>
      <button
        className={`btn ${reserved ? "delete" : "edit"}`}
        onClick={getTables}
      >
        {reserved ? "Reserved" : "Free"}
      </button>

      {reserved ? (
        <button
          className="btn detaild"
          style={{ marginLeft: "20px" }}
          onClick={getTableOrder}
        >
          Detaild
        </button>
      ) : null}
      {addModalOpen ? (
        <ModalWrapper
          modalIsOpen={true}
          closeModal={closeAddModal}
          token={token}
          setNeedRefresh={setNeedRefresh}
          needRefresh={needRefresh}
          tableCart={tableCart}
        />
      ) : null}
    </div>
  );
};
