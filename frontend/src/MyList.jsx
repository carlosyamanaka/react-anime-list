import Header from "./components/Header";
import Navbar from "./components/Navbar";
import SubHeader from "./components/SubHeader";
import MyListCard from "./components/MyListCard";
import MyListDetails from "./components/MyListDetails";
import { useGlobalContext } from "./contexts";
import { useEffect, useState } from "react";
import axios from 'axios';

function MyList() {
  const { searchBar, activeNav } = useGlobalContext();
  const [myList, setMyList] = useState([]);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyList = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Você precisa estar logado para ver sua lista.");
          setIsLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:3000/animes", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setMyList(response.data.animes);
      } catch (error) {
        console.error("Erro ao buscar animes:", error);
        if (error.response?.status === 401) {
          alert("Sessão expirada ou não autenticado. Faça login novamente.");
        } else {
          alert("Erro ao buscar sua lista.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyList();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setHasSearched(true);
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Você precisa estar logado para pesquisar.");
        setIsLoading(false);
        return;
      }
      const response = await axios.get(
        `http://localhost:3000/animes/search?q=${encodeURIComponent(searchTerm)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setMyList(response.data.animes);
    } catch (error) {
      alert("Erro ao pesquisar na sua lista.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = (id, note, rating) => {
    const updated = myList.map((item) =>
      item.mal_id === id ? { ...item, note, rating } : item
    );
    setMyList(updated);
    localStorage.setItem("myList", JSON.stringify(updated));
  };

  return (
    <div className="content-container">
      <Header />
      {searchBar && <SubHeader />}

      <main className="container">
        <Navbar />
        {activeNav && <div className="block-cards"></div>}

        <div className="mainContainer myList-page">
          <div className="myList-search">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search in my list..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit">Search</button>
            </form>
          </div>

          {isLoading ? (
            <div className="loading-container">
              <h2 className="loading-data">Loading...</h2>
            </div>
          ) : myList.length === 0 ? (
            <div className="loading-container">
              <h2 className="loading-data">
                {hasSearched ? "Anime not found." : "Your list is empty."}
              </h2>
            </div>
          ) : (
            <div className="myList-cards-wrapper">
              {myList.map((item) => (
                <MyListCard
                  key={item.mal_id}
                  item={item}
                  onClick={() => setSelectedAnime(item)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedAnime && (
        <MyListDetails
          item={selectedAnime}
          onSave={handleSave}
          onClose={() => setSelectedAnime(null)}
        />
      )}
    </div>
  );
}

export default MyList;