import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Dashboard from "../../components/Dashboard/Dashboard";

const AdminPage = () => {
  const history = useHistory();

  const checkAuthAdmin = () => {
    const isAuthAdmin = localStorage.getItem("adminTkn");

    return isAuthAdmin ? null : history.push("/admin-panel");
  };

  useEffect(() => {
    checkAuthAdmin();
  }, []);

  return <Dashboard />;
};

export default AdminPage;
