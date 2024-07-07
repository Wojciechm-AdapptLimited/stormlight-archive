import React from "react";

const SearchBar = ({ search, performSearch }) => {
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => performSearch(e.target.value)}
            />
            <span className="material-symbols-outlined">search</span>
        </div>
    );
}

export { SearchBar };