import { useState } from "react";

function MyListDetails({ item, onSave, onClose }) {
    const [note, setNote] = useState(item.note || "");
    const [rating, setRating] = useState(item.rating || "");

    const handleSave = () => {
        onSave(item.mal_id, note, rating);
        onClose(); // Fecha o modal/detalhe após salvar
    };

    return (
        <div className="mylist-details-overlay">
            <div className="mylist-details">
                <img src={item.image_url} alt={item.title} width="200" />
                <h2>{item.title}</h2>

                <label>Review:</label>
                <textarea
                    rows={3}
                    placeholder="Write your review..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />

                <div className="score-row">
                    <label>Score:</label>
                    <select value={rating} onChange={(e) => setRating(e.target.value)}>
                        <option value="">Select</option>
                        {[...Array(10)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {i + 1}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mylist-details-buttons">
                    <button onClick={handleSave}>Save</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default MyListDetails;
