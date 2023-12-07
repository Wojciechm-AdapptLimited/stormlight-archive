import React from "react";


const Star = ({ editable, rating, tempRating, setRating, setTempRating, index }) => {
    const [hover, setHover] = React.useState(false);
    const hoverColor = hover || tempRating >= index + 1 ? "#ffc107" : "black";
    const color = rating >= index + 1 ? "#ffc107" : "black";

    function hoverStar() {
        setHover(true);
        setTempRating(index + 1);
    }

    function leaveStar() {
        setHover(false);
        setTempRating(rating);
    }

    return (
        editable
            ? (
                <span
                    className="material-symbols-outlined"
                    onMouseEnter={() => hoverStar()}
                    onMouseLeave={() => leaveStar()}
                    onClick={() => setRating(index + 1)}
                    style={{ color: hoverColor, cursor: "pointer" }}
                >
                   star
                </span>
            )
            : (
                <span className="material-symbols-outlined" style={{color}}>
                   star
                </span>
            )
    );
}

const Rating = ({ editable, rating, setRating }) => {
    const [tempRating, setTempRating] = React.useState(rating);

    return (
        <div className="rating">
            {[...Array(5)].map((_, i) => {
                return (
                    <Star
                        key={i}
                        editable={editable}
                        rating={rating}
                        tempRating={tempRating}
                        setRating={setRating}
                        setTempRating={setTempRating}
                        index={i}
                    />
                );
            })}
        </div>
    );
}

export { Rating };