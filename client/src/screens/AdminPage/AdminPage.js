import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const AdminPage = () => {
  const history = useHistory();

  const checkAuthAdmin = () => {
    const isAuthAdmin = localStorage.getItem("adminTkn");

    return isAuthAdmin ? null : history.push("/admin-panel");
  };

  useEffect(() => {
    checkAuthAdmin();
  }, []);

  return <div>Example</div>;
};

export default AdminPage;
