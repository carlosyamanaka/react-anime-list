import { useState, useEffect } from "react";
import axios from "axios";
import { faDedent } from "@fortawesome/free-solid-svg-icons";

function MyListDetails({ item, onSave, onClose }) {
    const [note, setNote] = useState(item.note || "");
    const [rating, setRating] = useState(item.rating || "");
    const token = localStorage.getItem("token");

    const feedback = item.feedbacks?.[0];
    const feedbakId = feedback?.id

    useEffect(() => {
        if (feedback) {
            setNote(feedback.feedback_text || "");
            setRating(feedback.score?.toString() || "");
        } else {
            setNote("");
            setRating("");
        }
    }, [feedback]);

    const handleSave = async () => {
        try {
            const data = {
                feedback_text: note.trim(),
                score: Number(rating),
            };

            let response;
            if (feedbakId) {
                response = await axios.put(
                    `http://localhost:3000/feedbacks/${feedback.id}`,
                    data,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                response = await axios.post(
                    `http://localhost:3000/animes/${item.id}/feedbacks`,
                    data,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            onSave(item.mal_id, note, rating, response.data.id);
            alert("Review salvo com sucesso!");
            onClose();
        } catch (error) {
            console.error("Erro ao salvar feedback:", error.response?.data || error);
            alert("Erro ao salvar seu review: " + (error.response?.data?.error || "Erro desconhecido"));
        }
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
