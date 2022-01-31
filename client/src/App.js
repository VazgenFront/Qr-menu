import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { BrowserRouter, Switch, useHistory } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard/Dashboard";
import Navbar from "./components/Navbar/Navbar";
import ThemeContextProvider from "./context/ThemeContext";
import { useRoutes } from "./routes";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});
function App() {
  const routes = useRoutes();

  const history = useHistory();

  const isClient =
    !history.location.pathname.includes("admin-panel") &&
    history.location.pathname !== "/";

  const isAuthAdmin =
    history.location.pathname.includes("admin-panel") &&
    !history.location.pathname.includes("auth") &&
    localStorage.getItem("adminTkn");

  if (isAuthAdmin) {
    document.getElementById("root").style.display = "flex";
  }

  if (isClient) {
    document.getElementById("root").style.display = "flex";
    document.getElementById("root").style.flexDirection = "column";
  }

  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        <ThemeContextProvider>
          {isClient ? <Navbar /> : null}
          {isAuthAdmin ? <Dashboard /> : null}
          <Switch>{routes}</Switch>
        </ThemeContextProvider>
      </ApolloProvider>
    </BrowserRouter>
  );
}

export default App;
