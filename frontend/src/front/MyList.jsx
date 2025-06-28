import Header from "../components/Header";
import Navbar from "../components/Navbar";
import SubHeader from "../components/SubHeader";
import MyListCard from "../components/MyListCard";
import MyListDetails from "../components/MyListDetails";
import { useGlobalContext } from "../contexts";
import { useEffect, useState } from "react";
import axios from 'axios'

function MyList() {
  const { searchBar, activeNav } = useGlobalContext();
  const [myList, setMyList] = useState([]);
  const [selectedAnime, setSelectedAnime] = useState(null);

  useEffect(() => {
    const fetchMyList = async () => {
      try {
        const response = await axios.get("http://localhost:3000/animes");
        setMyList(response.data);
      } catch (error) {
        console.error("Erro ao buscar animes:", error);
      }
    };

    fetchMyList();
  }, []);

  const handleSave = (id, note, rating) => {
    const updated = myList.map((item) =>
      item.mal_id === id ? { ...item, note, rating } : item
    );
    setMyList(updated);
    localStorage.setItem("myList", JSON.stringify(updated));
  };

  const removeFromList = (id) => {
    const updated = myList.filter((item) => item.mal_id !== id);
    setMyList(updated);
    localStorage.setItem("myList", JSON.stringify(updated));
  };

  return (
    <div className="content-container">
      <Header />
      {searchBar && <SubHeader />}

      {myList.length !== 0 ? (
        <main className="container">
          <Navbar />
          {activeNav && <div className="block-cards"></div>}
          <div className="mainContainer">
            {myList.map((item) => (
              <MyListCard
                key={item.mal_id}
                item={item}
                onClick={() => setSelectedAnime(item)}
              />
            ))}
            {selectedAnime && (
              <MyListDetails
                item={selectedAnime}
                onSave={handleSave}
                onClose={() => setSelectedAnime(null)}
              />
            )}
          </div>
        </main>
      ) : (
        <main className="loading-container">
          <h2 className="loading-data">Your list is empty.</h2>
        </main>
      )}
    </div>
  );
}

export default MyList;