/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useEffect } from "react";
import "./styles.css";
import { CSSTransition } from "react-transition-group";
import { Link } from "react-router-dom";

const Header = () => {
  const [isNavVisible, setNavVisibility] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 700px)");
    mediaQuery.addListener(handleMediaQueryChange);
    handleMediaQueryChange(mediaQuery);

    return () => {
      mediaQuery.removeListener(handleMediaQueryChange);
    };
  }, []);

  const handleMediaQueryChange = mediaQuery => {
    if (mediaQuery.matches) {
      setIsSmallScreen(true);
    } else {
      setIsSmallScreen(false);
    }
  };

  const toggleNav = () => {
    setNavVisibility(!isNavVisible);
  };

  return (
    <header className="Header">
       <Link to="/">
      <div className="logoView">
        <img src={require("./logo.png")} className="Logo" alt="doctor" />
        <h2 className="logoText">Appoinment</h2>
      </div>
      </Link>
      <CSSTransition
        in={!isSmallScreen || isNavVisible}
        timeout={350}
        classNames="NavAnimation"
        unmountOnExit
      >
        <nav className="Nav">
          <a href="/"> </a>
          <Link to="/">Home</Link>
        </nav>
      </CSSTransition>
      <button onClick={toggleNav} className="Burger">
      <span style={{color:"white"}}>≡</span>
      </button>
    </header>
  );
}

export default Header