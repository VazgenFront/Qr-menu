import axios from "axios";
import { useHistory } from "react-router-dom";
import { useToggleModalOpen } from "../../utils";
import "./AdminPanelMenuTypes.css";
import EditModal from "../../components/EditModal/EditModal";
import del from "./delete.png";
import edit from "./edit.svg";
import more from "./more.svg";

export const MenuTypeItem = ({ item, token, setNeedRefresh, needRefresh }) => {
  const history = useHistory();
  const { name, img } = item;

  const handleDetailedMenuType = () => {
    history.push(`/admin-panel/:cafeId/:cafeName/dashboard/menuTypes/${name}`);
  };

  const { editModalOpen, closeEditModal, onEdit } = useToggleModalOpen();

  const onDelete = async () => {
    axios
      .delete("http://localhost:4000/api/account/menuType", {
        headers: {
          "x-access-token": token,
        },
        data: {
          typeName: name,
        },
      })
      .finally(() => {
        setNeedRefresh(!needRefresh);
      });
  };

  return (
    <div className="menuTypes__item">
      <div className="menuType">
        <div
          className="menuType__img"
          style={{ backgroundImage: `url(${img})` }}
        >
          <div className="detailed">
            <div className="circle__btn" onClick={handleDetailedMenuType}>
              <img src={more} alt="img" />
            </div>
            <div className="circle__btn" onClick={onEdit}>
              <img src={edit} alt="img" />
            </div>
            <div className="circle__btn">
              <img src={del} alt="img" onClick={onDelete} />
            </div>
          </div>
        </div>
        <span className="tpe">{name}</span>
      </div>
      {editModalOpen && (
        <EditModal
          name={name}
          img={img}
          isOpen={editModalOpen}
          onRequestClose={closeEditModal}
          ariaHideApp={false}
          token={token}
          setNeedRefresh={setNeedRefresh}
          needRefresh={needRefresh}
        />
      )}
    </div>
  );
};
