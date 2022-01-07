import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter, Switch, useHistory } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { useRoutes } from "./routes";
import ThemeContextProvider from "./context/ThemeContext";

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
          <Switch>{routes}</Switch>
        </ThemeContextProvider>
      </ApolloProvider>
    </BrowserRouter>
  );
}

export default App;
