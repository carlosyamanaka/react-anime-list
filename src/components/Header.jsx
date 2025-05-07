import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { GlobalContext } from "../App";

function Header() {
  const { openNav, displaySearchBar, navReset, paginationReset } =
    useContext(GlobalContext);

  return (
    <header className="header">
      <div className="burger-section">
        <a>
          <span className="burger"></span>
          <span onClick={openNav} className="burger"></span>
          <span className="burger"></span>
        </a>
      </div>
      <Link
        onClick={function (event) {
          navReset();
          paginationReset();
        }}
        to={"/"}
      >
        <h1 className="app-name">ReactAnimeList</h1>
      </Link>
      <a className="buttonHeader" onClick={displaySearchBar}>
        <FontAwesomeIcon icon={faSearch} />{" "}
      </a>
    </header>
  );
}

export default Header;
