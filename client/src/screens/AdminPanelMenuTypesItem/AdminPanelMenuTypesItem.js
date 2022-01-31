import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminMenuItemsButtons from "../../components/AdminMenuItemsButtons/AdminMenuItemsButtons";
import ModalWrapper from "../../components/Modal/Modal";
import "./AdminPanelMenuTypesItem.css";

const AdminPanelMenuTypesItem = () => {
  const { menuType } = useParams();

  const [menuItems, setMenuItems] = useState([]);

  const token = localStorage.getItem("adminTkn");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState({});

  // for Adding
  const openAddModal = () => {
    setAddModalOpen(true);
  };
  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  const onAdd = () => {
    openAddModal();
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

  useEffect(async () => {
    await axios
      .get("http://localhost:4000/api/account/menuItemsOfType", {
        headers: { "x-access-token": token },
        params: { type: menuType },
      })
      .then((data) => {
        setMenuItems(() => [...data.data.menuItems]);
      });
  }, [needRefresh]);

  return (
    <div className="AdminPanelMenuTypesItem">
      <span className="menu__types__item__title">{menuType}</span>
      <div className="admin__menuTypes__box">
        {menuItems.map((item, idx) => (
          <div className="menuTypes__item" key={idx}>
            <div className="menuType" key={idx} style={{ marginTop: "40px" }}>
              <img className="menuType__img" src={item.img} alt="img" />
              <span style={{ marginTop: "-12px" }}>{item.name}</span>
              <span style={{ marginTop: "12px" }}>
                {item.price} {item.currency}{" "}
              </span>
            </div>
            <AdminMenuItemsButtons
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        ))}
        <div
          className="add__menuType__box"
          onClick={onAdd}
          style={{ marginTop: "58px" }}
        >
          +
        </div>
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
          menuType={menuType}
        />
      ) : null}

      {addModalOpen ? (
        <ModalWrapper
          modalIsOpen={true}
          token={token}
          destiny={"add"}
          closeModal={closeAddModal}
          setNeedRefresh={setNeedRefresh}
          needRefresh={needRefresh}
          menuType={menuType}
        />
      ) : null}
    </div>
  );
};

export default AdminPanelMenuTypesItem;
