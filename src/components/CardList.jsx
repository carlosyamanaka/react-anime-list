import Card from "./Card";
import { useGlobalContext } from "../contexts";

function CardList({ items, cardSelect }) {
  const { activeNav } = useGlobalContext();

  return (
    <>
      <div className={activeNav ? "mainContainer stopScroll" : "mainContainer"}>
        {items.map((item) => (
          <Card key={item.mal_id} item={item} cardSelect={cardSelect} />
        ))}
      </div>
    </>
  );
}

export default CardList;
