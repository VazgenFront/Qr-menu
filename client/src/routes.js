import { useMemo } from "react";
import { Route } from "react-router-dom";
import { AboutUs, AdminAuh, Cafe, MenuType } from "./screens/index";

export const appRoutes = [
  // About Our Company page
  {
    path: "/",
    name: "aboutUs",
    exact: true,
    component: AboutUs,
  },
  // About Our Company page

  // Cafe Admin Page
  {
    path: "/:id/:cafeName/admin-panel",
    name: "AdminAuh",
    component: AdminAuh,
  },
  // Cafe Admin Page

  // Cafe Client Page
  {
    path: "/:cafeName",
    name: "aboutUs",
    exact: true,
    component: Cafe,
  },
  // Cafe Client Page

  {
    path: "/:cafeName/menu/:menuType",
    name: "menuType",
    exact: true,
    component: MenuType,
  },

  // {
  //   path: "/:id/:cafeName/menu/:menuType/:id",
  //   name: "menu_item",
  //   exact: true,
  //   page: MenuItem,
  // },

  // {
  //   path: "/:id/:cafeName/:tableId/card",
  //   name: "main_page",
  //   exact: true,
  //   page: Card,
  // },
  // Client Side
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
