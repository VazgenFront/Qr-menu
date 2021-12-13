import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { Switch } from "react-router-dom";
import { useRoutes } from "./routes";

function App() {
  const routes = useRoutes();
  return (
    <div>
      <Navbar />
      <Switch>{routes}</Switch>
    </div>
  );
}

export default App;
