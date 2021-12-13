import { useMemo } from "react";
import { Route } from "react-router-dom";
import { MainPage, AdminAuth } from "./screens/index";

export const appRoutes = [
  {
    path: "/:cafeName",
    name: "main_page",
    exact: true,
    component: MainPage,
  },
  {
    path: "/:cafeName/admin-panel",
    name: "admin_panel_cafe",
    exact: true,
    component: AdminAuth,
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
