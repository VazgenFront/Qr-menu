import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import {
  BrowserRouter,
  Switch,
  useHistory,
  Route,
  Redirect,
} from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import ThemeContextProvider from "./context/ThemeContext";
import { useRoutes } from "./routes";
import { AdminAuh, AdminPage } from "./screens/index";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});
function App() {
  const routes = useRoutes();

  const history = useHistory();

  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        <ThemeContextProvider>
          {history.location.pathname.includes("admin-panel") ||
          history.location.pathname === "/" ? null : (
            <Navbar />
          )}
          <Switch>
            <Route
              path="/:id/:cafeName/admin-panel/dashboard"
              exact
              render={() =>
                localStorage.getItem("adminToken") ? (
                  <AdminPage />
                ) : (
                  <Redirect to="/admin-panel/login" />
                )
              }
            />
          </Switch>
          <Switch>{routes}</Switch>
        </ThemeContextProvider>
      </ApolloProvider>
    </BrowserRouter>
  );
}

export default App;
