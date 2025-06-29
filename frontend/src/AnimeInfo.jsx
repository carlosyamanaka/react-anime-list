import Header from "./components/Header";
import InfoCard from "./components/InfoCard";
import { useState, useEffect } from "react";
import { useGlobalContext } from "./contexts";
import { useParams } from "react-router-dom";
import SubHeader from "./components/SubHeader";
import Navbar from "./components/Navbar";

function AnimeInfo({ AnimeSearch }) {
  const { searchBar } = useGlobalContext();

  const [cardInfo, setCardInfo] = useState([]);
  const params = useParams();

  useEffect(() => {
    const test = async () => {
      const details = await fetch(
        `https://api.jikan.moe/v4/anime/${params.id}/full`
      ).then((res) => res.json());
      setCardInfo(details.data);
    };
    test(params.id);
  }, [params.id]);

  return (
    <>
      <div className="content-container">
        <Header />
        {searchBar ? <SubHeader /> : null}
        <main className="container">
          <Navbar />
          <InfoCard item={cardInfo} />
        </main>
      </div>
    </>
  );
}

export default AnimeInfo;
