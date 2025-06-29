function MyListCard({ item, onClick}) {
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