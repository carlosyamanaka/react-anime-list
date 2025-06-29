import Main from "./Main";
import { Route, Routes } from "react-router-dom";
import AnimeInfo from "./AnimeInfo";
import { useNavigate } from "react-router-dom";
import AnimeSearch from "./AnimeSearch";
import AnimeGenre from "./AnimeGenre";
import Login from "./Login";
import Register from "./Register";
import MyList from "./MyList";

function Pages() {
  const navigate = useNavigate();
  const cardSelect = (id) => navigate("/" + id);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/myList" element={<MyList/>}/>
        <Route path="/home" element={<Main cardSelect={cardSelect} />} />
        <Route path="/:id" element={<AnimeInfo />} />
        <Route
          path="/search/:name"
          element={<AnimeSearch cardSelect={cardSelect} />}
        />
        <Route
          path="/genres/:genre"
          element={<AnimeGenre cardSelect={cardSelect} />}
        />
      </Routes>
    </>
  );
}

export default Pages;
