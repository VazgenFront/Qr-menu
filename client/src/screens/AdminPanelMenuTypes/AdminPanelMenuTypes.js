import axios from "axios";
import { useEffect, useState } from "react";
import AddModal from "../../components/AddModal/AddModal";
import { useToggleModalOpen } from "../../utils";
import "./AdminPanelMenuTypes.css";
import { MenuTypeItem } from "./MenuTypeItem";

const AdminPanelMenuTypes = () => {
  const [menuTypes, setMenuTypes] = useState([]);
  const [needRefresh, setNeedRefresh] = useState(false);
  const token = localStorage.getItem("adminTkn");

  const { addModalOpen, onAdd, closeAddModal } = useToggleModalOpen();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/account/getAccountData", {
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
      <div className="line"></div>
      <div className="menuTypes_info__box">
        <div className="menuTypes__text__box">
          <span className="admin__title">Menu Types</span>
          <span className="admin__text">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </span>
        </div>
        <div className="addMenuType" onClick={onAdd}>
          +
        </div>
      </div>
      <div className="menuTypes">
        {menuTypes.map((item, idx) => (
          <MenuTypeItem
            item={item}
            key={idx}
            needRefresh={needRefresh}
            setNeedRefresh={setNeedRefresh}
            token={token}
          />
        ))}
      </div>

      {addModalOpen && (
        <AddModal
          isOpen={addModalOpen}
          onRequestClose={closeAddModal}
          ariaHideApp={false}
          token={token}
          setNeedRefresh={setNeedRefresh}
          needRefresh={needRefresh}
        />
      )}
    </div>
  );
};

export default AdminPanelMenuTypes;
