import CardList from "./components/CardList";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import SubHeader from "./components/SubHeader";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGlobalContext } from "./contexts";

function AnimeGenre({ cardSelect }) {
  const { pagination, IncreasePage, DecreasePage, searchBar, navReset, items } =
    useGlobalContext();
  const [contents, setContents] = useState([]);
  const param = useParams();

  useEffect(() => {
    const searchedContent = async () => {
      const newContent = await fetch(
        `https://api.jikan.moe/v4/anime?genres=${param.genre}&page=${pagination}&sfw`
      ).then((res) => res.json());
      setContents(newContent.data);
    };
    searchedContent(param.genre);
    navReset();
  }, [param.genre, pagination]);

  return (
    <>
      <div className="content-container">
        <Header />
        {searchBar ? <SubHeader /> : null}
        {
          // Need to look into more rendering not showing loading when items === 0
        }
        {items.length !== 0 ? (
          <>
            <main className="container">
              <Navbar />
              <CardList items={contents} cardSelect={cardSelect} />
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

export default AnimeGenre;
