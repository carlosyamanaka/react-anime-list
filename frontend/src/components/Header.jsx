import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faListUl } from "@fortawesome/free-solid-svg-icons";
import { useGlobalContext } from "../contexts";
import UserMenu from "./UserMenu";

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
        to={"/home"}
      >
        <h1 className="app-name">ReactAnimeList</h1>
      </Link>
      <div className="header-right">
        <a className="buttonHeader" onClick={displaySearchBar}>
          <FontAwesomeIcon icon={faSearch} />{" "}
        </a>
        <a href="myList">
          <div className="my-list">
            <FontAwesomeIcon icon={faListUl} />
            <span>MyList</span>
          </div>
        </a>
        <UserMenu />
      </div>
    </header>
  );
}

export default Header;
