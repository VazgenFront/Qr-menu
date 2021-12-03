import { useMemo } from "react";
import { Route } from "react-router-dom";
import { MainPage, AdminAuth } from "./screens/index";

export const appRoutes = [
  {
    path: "/",
    name: "main_page",
    component: MainPage,
  },
  {
    path: "/admin-panel/:cafeName",
    name: "admin_panel_cafe",
    exact: true,
    component: AdminAuth,
  },
  {
    path: "/",
    name: "mainPage",
    exact: true,
    component: MainPage,
  },
  {
    path: "/",
    name: "mainPage",
    exact: true,
    component: MainPage,
  },
  {
    path: "/",
    name: "mainPage",
    exact: true,
    component: MainPage,
  },
];

export const renderRoutes = (routeProps = {}) => {
  return appRoutes.map((route) => {
    return (
      <Route
        key={`structure-route-${route.name}`}
        path={route.path}
        exact={route.exact}
        render={(props) => {
          if (route.component) {
            return (
              <route.component
                {...routeProps}
                {...props}
                routes={route.routes}
              />
            );
          }

          return null;
        }}
      />
    );
  });
};

export const useRoutes = () => useMemo(() => renderRoutes(), []);
