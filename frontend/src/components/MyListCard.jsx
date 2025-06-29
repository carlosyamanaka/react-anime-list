import { useState } from "react";


function MyListCard({ item, onClick}) {
    const [note, setNote] = useState(item.note || "");
    const [rating, setRating] = useState(item.rating || "");
    return (
        <div className="card" onClick={onClick}>
            <div className="image-section">
                <img src={item.image_url} alt={item.title} />
            </div>
            <div className="name-section">
                <p>{item.title}</p>
            </div>
        </div>
    );
}

export default MyListCard;