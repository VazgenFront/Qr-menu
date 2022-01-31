import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import AdminMenuItemsButtons from "../../components/AdminMenuItemsButtons/AdminMenuItemsButtons";
import ModalWrapper from "../../components/Modal/Modal";
import "./AdminPanelMenuTypes.css";

const AdminPanelMenuTypes = () => {
  const { cafeId, cafeName } = useParams();
  const [menuTypes, setMenuTypes] = useState([]);
  const history = useHistory();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState({});

  const token = localStorage.getItem("adminTkn");

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

  const closeEditModal = () => {
    setEditModalOpen(false);
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

  const onDetail = (e, itm) => {
    e.preventDefault();
    history.push(
      `/admin-panel/${cafeId}/${cafeName}/dashboard/MenuTypes/${itm.name}`
    );
  };

  const onDelete = async (itm) => {
    const data = { typeName: itm.name };

    await axios.delete("http://localhost:4000/api/account/menuType", {
      data,
      headers: { "x-access-token": token },
    });
    setNeedRefresh(!needRefresh);
  };

  useEffect(async () => {
    await axios
      .get("http://localhost:4000/api/account/getAccountData", {
        headers: { "x-access-token": token },
      })
      .then((data) => {
        setMenuTypes(() => [...data.data.menuTypes]);
      });
  }, [needRefresh]);

  return (
    <div className="AdminPanelMenuTypes">
      <div className="menuTypes">
        {menuTypes.map((item, idx) => (
          <div className="menuTypes__item" key={idx}>
            <div className="menuType" style={{ marginTop: "20px" }}>
              <img className="menuType__img" src={item.img} alt="img" />
              <span>{item.name}</span>
            </div>
            <AdminMenuItemsButtons
              item={item}
              onEdit={onEdit}
              onDetail={onDetail}
              onDelete={onDelete}
            />
          </div>
        ))}
        <div
          className="add__menuType__box"
          onClick={onAdd}
          style={{ marginTop: "40px" }}
        >
          +
        </div>

        {editModalOpen ? (
          <ModalWrapper
            modalIsOpen={true}
            destiny={"edit"}
            closeModal={closeEditModal}
            from={"menuTypes"}
            token={token}
            selectedType={selectedType}
            setNeedRefresh={setNeedRefresh}
            needRefresh={needRefresh}
          />
        ) : null}
        {addModalOpen ? (
          <ModalWrapper
            modalIsOpen={true}
            token={token}
            destiny={"add"}
            from={"menuTypes"}
            closeModal={closeAddModal}
            setNeedRefresh={setNeedRefresh}
            needRefresh={needRefresh}
          />
        ) : null}
      </div>
    </div>
  );
};

export default AdminPanelMenuTypes;
