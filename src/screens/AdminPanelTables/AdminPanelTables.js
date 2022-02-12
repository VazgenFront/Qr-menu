import axios from "axios";
import React, { useEffect, useState } from "react";
import "./AdminPanelTables.css";
import { Button } from "./Button";
import { SERVER_ROUTE } from "../../config";

const AdminPanelTables = () => {
  const token = localStorage.getItem("adminTkn");
  const [tables, setTables] = useState([]);
  const [needRefresh, setNeedRefresh] = useState(false);

  useEffect(async () => {
    await axios
      .get(`${SERVER_ROUTE}/api/account/tables`, {
        headers: { "x-access-token": token },
      })
      .then((data) => {
        setTables(() => [...data.data.accountTables]);
      })
      .catch((e) => {
        window.location = "/admin-panel/auth";
      });
  }, [needRefresh]);

  return (
    <div className="AdminPanelTables">
      <span className="menu__types__item__title">Tables</span>
      <div className="menuTypes">
        {tables.map((item, idx) => (
          <div className="menuTypes__item" key={idx}>
            <div
              className="table"
              key={idx}
              style={{
                background: item.reserved ? "red" : "#13aa52",
                marginTop: "40px",
              }}
            >
              <span> {item.name}</span>
            </div>
            <div className="btn__box" style={{ justifyContent: "center" }}>
              <Button
                setNeedRefresh={setNeedRefresh}
                needRefresh={needRefresh}
                item={item}
                token={token}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanelTables;
