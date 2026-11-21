import React from "react";
import { NavLink} from 'react-router-dom'

function Header() {
  return (
    <>
      <nav className="Navbar">
        <NavLink to="/">
          Home
        </NavLink>
        
        <NavLink to="/about">
          About
        </NavLink>
      </nav>

    </>
  );
}

export default Header;
