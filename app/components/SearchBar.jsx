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
        </div>
    );
}

export { SearchBar };