import React from "react";
import {SearchBar} from "./SearchBar.jsx";

const Appbar = ({search, performSearch}) => {
    return (
        <div className={"appbar"}>
            <h4 className={"appbar-title"}>Books from Stormlight Archive</h4>
            <SearchBar search={search} performSearch={performSearch} />
            <div className={"appbar-actions"}>
                <span>Hello world!</span>
            </div>
        </div>
    );
}

export { Appbar };