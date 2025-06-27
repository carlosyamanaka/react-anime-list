import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useGlobalContext } from "../contexts";

function Header() {
  const { openNav, displaySearchBar, navReset, paginationReset } =
    useGlobalContext();

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
