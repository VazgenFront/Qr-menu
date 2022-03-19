import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToggleModalOpen } from "../../utils";
import "./AdminPanelMenuTypesItem.css";
import MenuTypeItem from "./MenuTypeItem";
import search from "./search.png";

const AdminPanelMenuTypesItem = () => {
  const { menuType } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const token = localStorage.getItem("adminTkn");

  const { addModalOpen, onAdd, closeAddModal } = useToggleModalOpen();

  useEffect(async () => {
    await axios
      .get("http://localhost:4000/api/account/menuItemsOfType", {
        headers: { "x-access-token": token },
        params: { type: menuType },
      })
      .then((data) => {
        setMenuItems(() => [...data.data.menuItems]);
      })
      .catch((e) => {
        window.location = "/admin-panel/auth";
      });
  }, []);

  return (
    <div className="AdminPanelMenuTypesItem">
      <div className="line"></div>
      <div className="menuTypes_info__box">
        <div className="menuTypes__text__box">
          <span
            className="admin__title"
            style={{ textTransform: "capitalize" }}
          >
            All "{menuType}" Items
          </span>
          <span className="admin__text">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </span>

          <div className="searchInput">
            <input type="text" className="search__item" />
            <img src={search} alt="img" className="search__img" />
          </div>
        </div>
        <div className="addMenuType" onClick={onAdd}>
          +
        </div>
      </div>

      <div className="menuItems">
        {menuItems.map((item, idx) => (
          <MenuTypeItem item={item} idx={idx} />
        ))}
      </div>
    </div>
  );
};

export default AdminPanelMenuTypesItem;
