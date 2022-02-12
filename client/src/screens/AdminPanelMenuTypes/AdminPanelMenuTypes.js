import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import AdminMenuItemsButtons from "../../components/AdminMenuItemsButtons/AdminMenuItemsButtons";
import ModalWrapper from "../../components/Modal/Modal";
import { useToggleModalOpen } from "../../utils";
import "./AdminPanelMenuTypes.css";

const AdminPanelMenuTypes = () => {
  const { cafeId, cafeName } = useParams();
  const [menuTypes, setMenuTypes] = useState([]);
  const history = useHistory();
  const [needRefresh, setNeedRefresh] = useState(false);
  const [selectedType, setSelectedType] = useState({});

  const token = localStorage.getItem("adminTkn");

  const {
    addModalOpen,
    openAddModal,
    closeAddModal,
    editModalOpen,
    openEditModal,
    closeEditModal,
  } = useToggleModalOpen();

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

    await axios.delete("/api/account/menuType", {
      data,
      headers: { "x-access-token": token },
    });
    setNeedRefresh(!needRefresh);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    await axios
      .get("/api/account/getAccountData", {
        headers: { "x-access-token": token },
      })
      .then((data) => {
        setMenuTypes(() => [...data.data.menuTypes]);
      })
      .catch((e) => {
        window.location = "/admin-panel/auth";
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
