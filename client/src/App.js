import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { useEffect } from "react";
import { BrowserRouter, Switch, useHistory } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard/Dashboard";
import Navbar from "./components/Navbar/Navbar";
import ThemeContextProvider from "./context/ThemeContext";
import { useRoutes } from "./routes";

const client = new ApolloClient({
  uri: "/graphql",
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
    !history.location.pathname.includes("auth");

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
          <Wrapper history={history}>
            <Switch>{routes}</Switch>
          </Wrapper>
        </ThemeContextProvider>
      </ApolloProvider>
    </BrowserRouter>
  );
}

function Wrapper(props) {
  const token = localStorage.getItem("adminTkn");

  if (
    !token &&
    window.location.pathname.includes("admin-panel") &&
    !window.location.pathname.includes("auth")
  ) {
    window.location.pathname = "/admin-panel/auth";
  }

  return <div className="wrapper">{props.children}</div>;
}

export default App;
