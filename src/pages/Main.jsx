import CardList from "../components/CardList";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import SubHeader from "../components/SubHeader";
import { useContext } from "react";
import { GlobalContext } from "../App";

function Main({ cardSelect }) {
  const {
    pagination,
    items,
    IncreasePage,
    DecreasePage,
    searchBar,
    activeNav,
  } = useContext(GlobalContext);

  return (
    <>
      <div className="content-container">
        <Header />
        {searchBar ? <SubHeader /> : null}
        {items.length !== 0 ? (
          <>
            <main className="container">
              <Navbar />
              {activeNav === true ? <div className="block-cards"></div> : ""}
              <CardList items={items} cardSelect={cardSelect} />
            </main>
            <div className="buttons-page">
              <button onClick={() => DecreasePage(pagination)}>
                {pagination - 1}
              </button>
              <p>Page {pagination} </p>
              <button onClick={() => IncreasePage(pagination)}>
                {pagination + 1}
              </button>
            </div>
          </>
        ) : (
          <main className="loading-container">
            <h2 className="loading-data">Fetching data, Please wait...</h2>
          </main>
        )}
      </div>
    </>
  );
}

export default Main;
