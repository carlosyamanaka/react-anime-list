import axios from "axios";

function InfoCard({ item }) {
  const handleAddToList = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Você precisa estar logado para adicionar animes.");
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/animes",
        {
          mal_id: item.mal_id,
          title: item.title,
          title_japanese: item.title_japanese,
          image_url: item.images?.jpg?.large_image_url,
          score: item.score,
          rank: item.rank,
          popularity: item.popularity,
          type: item.type,
          episodes: item.episodes,
          year: item.year,
          rating: item.rating,
          studios: item.studios.map(s => s.name),
          genres: item.genres.map(g => g.name),
          synopsis: item.synopsis,
          url: item.url
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("Adicionado com sucesso:", response.data);
      alert("Adicionado à sua lista!");
    } catch (error) {
      console.error("Erro ao adicionar à lista:", error);
      if (error.response && error.response.status === 409) {
        alert("Este anime já está na sua lista.");
      } else if (error.response && error.response.status === 401) {
        alert("Você não está autenticado. Faça login.");
      } else {
        alert("Erro ao adicionar à lista.");
      }
    }
  }

  return (
    <>
      {item.length === 0 && (
        <div className="loading">
          <h2 className="loading-data">Loading...</h2>
        </div>
      )}
      {item.length !== 0 && (
        <div className="card-information">
          <div className="main-information">
            <div className="image-info-container">
              <img
                className="info-img"
                src={item.images.jpg.large_image_url}
                alt={item.title}
                width="400"
                height="495"
              />
            </div>
            <h1 className="card-info-headings">{item.title}</h1>
            <h2 className="card-info-headings japanese-name">
              {item.title_japanese}
            </h2>

            <div className="card-info-grid">
              <p className="card-info-score card-info-text-style-one card-grid-heading">
                Score
              </p>
              <p className="card-info-rank card-info-text-style-one card-grid-heading">
                Ranked
              </p>
              <p className="card-info-pop card-info-text-style-one card-grid-heading">
                Popularity
              </p>

              <p className="card-info-score-num card-info-text-style-two">
                {item.score}
              </p>
              <p className="card-info-rank-num card-info-text-style-two">
                {item.rank}
              </p>
              <p className="card-info-pop-num card-info-text-style-two">
                {item.popularity}
              </p>
            </div>

            <div className="card-info-grid">
              <p className="card-info-score card-info-text-style-one card-grid-heading">
                Type
              </p>
              <p className="card-info-score-num card-info-text-style-two">
                {item.type}
              </p>
              <p className="card-info-rank card-info-text-style-one card-grid-heading">
                Episodes
              </p>
              <p className="card-info-rank-num card-info-text-style-two">
                {item.episodes}
              </p>
              <p className="card-info-pop card-info-text-style-one card-grid-heading">
                Year
              </p>
              <p className="card-info-pop-num card-info-text-style-two">
                {item.year}
              </p>
            </div>

            <div className="card-info-grid-two">
              <p>
                {" "}
                <span className="card-info-text-style-one">Rating:</span>{" "}
                {item.rating}
              </p>
              <p className="card-info-studio card-info-text-style-one">
                Studios{" "}
              </p>
              <div className="card-info-studio-names">
                {item.length !== 0 &&
                  item.studios.map((studio) => (
                    <p className="card-info-text-style-three">{studio.name}</p>
                  ))}
              </div>

              <p className="card-info-genres card-info-text-style-one">
                Genres{" "}
              </p>
              <div className="card-info-genres-names">
                {item.length !== 0 &&
                  item.genres.map((genre) => (
                    <p className="card-info-text-style-three">{genre.name}</p>
                  ))}
              </div>
            </div>

            <h3>Synopsis</h3>
            <p className="card-info-syn">{item.synopsis}</p>
            <div className="button-box">
              <a
                className="card-info-button"
                href={item.url}
                rel="noreferrer"
                target="_blank"
              >
                More Information
              </a>
              <button
                className="card-info-button-list"
                onClick={handleAddToList}
              >
                Add to My List
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default InfoCard;
