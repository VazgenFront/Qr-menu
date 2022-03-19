import axios from "axios";
import { useEffect, useState } from "react";
import "./AdminPanelTables.css";
import TableItem from "./TableItem.js";

const AdminPanelTables = () => {
  const [tables, setTables] = useState([]);
  const token = localStorage.getItem("adminTkn");

  useEffect(async () => {
    await axios
      .get("http://localhost:4000/api/account/tables", {
        headers: { "x-access-token": token },
      })
      .then((data) => {
        setTables(() => [...data.data.accountTables]);
      });
    // .catch((e) => {
    //   window.location = "/admin-panel/auth";
    // });
  }, []);

  console.log("tables", tables);

  return (
    <div className="AdminPanelTables">
      <div className="line"></div>
      <div className="menuTypes_info__box">
        <div className="menuTypes__text__box">
          <span className="admin__title">Tables</span>
          <span className="admin__text">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </span>
        </div>
        <div className="addMenuType">+</div>
      </div>
      <div className="tables">
        {tables.map((item, index) => (
          <TableItem item={item} index={index} />
        ))}
      </div>
    </div>
  );
};

export default AdminPanelTables;
