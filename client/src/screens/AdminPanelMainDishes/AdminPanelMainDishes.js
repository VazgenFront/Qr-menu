import axios from "axios";
import React, { useEffect, useState } from "react";
import ModalWrapper from "../../components/Modal/Modal";
import "./AdminPanelMainDishes.css";

const AdminPanelMainDishes = () => {
  const token = localStorage.getItem("adminTkn");

  const [mainDishes, setMainDishes] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);
  const [selectedType, setSelectedType] = useState({});

  useEffect(async () => {
    await axios
      .get("http://localhost:4000/api/account/mainDishes", {
        headers: { "x-access-token": token },
      })
      .then((data) => {
        setMainDishes(() => [...data.data.mainDishes]);
      });
  }, [needRefresh]);

  // for Adding
  const openAddModal = () => {
    setAddModalOpen(true);
  };
  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  // for Editing
  const openEditModal = () => {
    setEditModalOpen(true);
  };

  const onEdit = (e, itm) => {
    openEditModal();
    setSelectedType({
      ...itm,
    });
  };

  const onAdd = () => {
    openAddModal();
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  const onDelete = async (itm) => {
    const data = { menuItemId: itm._id };

    await axios.delete("http://localhost:4000/api/account/menuItem", {
      data,
      headers: { "x-access-token": token },
    });

    setNeedRefresh(!needRefresh);
  };

  return (
    <div className="AdminPanelMainDishes">
      {" "}
      <span className="menu__types__item__title">Main Dishes</span>
      <div className="menuItems__box">
        {mainDishes.map((item, idx) => (
          <div className="menuTypes__item" key={idx}>
            <div className="menuType" key={idx} style={{ marginTop: "40px" }}>
              <img className="menuType__img" src={item.img} alt="img" />
              <span style={{ marginTop: "-12px" }}>{item.name}</span>
              <span style={{ marginTop: "12px" }}>{item.price} ADM</span>
            </div>
            <div className="btn__box" style={{ justifyContent: "center" }}>
              <button className="btn edit" onClick={(e) => onEdit(e, item)}>
                Edit
              </button>
              <button
                className="btn delete"
                style={{ marginLeft: "20px" }}
                onClick={() => onDelete(item)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {editModalOpen ? (
        <ModalWrapper
          modalIsOpen={true}
          destiny={"edit"}
          closeModal={closeEditModal}
          token={token}
          selectedType={selectedType}
          setNeedRefresh={setNeedRefresh}
          needRefresh={needRefresh}
        />
      ) : null}
    </div>
  );
};

export default AdminPanelMainDishes;
