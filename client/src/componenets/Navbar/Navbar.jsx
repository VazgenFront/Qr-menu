import React from "react";
import { Nav, NavLink, Bars, NavMenu } from "./Navbar.styles";
const Navbar = () => {
  const links = [
    {
      ref: "/",
      name: "Home",
    },

    {
      ref: "/events",
      name: "Events",
    },
    {
      ref: "/annual",
      name: "Anual",
    },
    {
      ref: "/team",
      name: "Team",
    },
    {
      ref: "/blogs",
      name: "Blogs",
    },
  ];
  return (
    <Nav>
      <Bars />
      <NavMenu>
        {links.map((link) => (
          <NavLink to={link.ref} activeStyle>
            {link.name}
          </NavLink>
        ))}
      </NavMenu>
    </Nav>
  );
};

export default Navbar;
