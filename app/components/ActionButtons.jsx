import React from "react";


const SortButton = ({colKey, sortKey, sortDirection, performSort }) => {
    const [arrow, setArrow] = React.useState("swap_vert");

    function setSort() {
        if (sortKey === colKey) {
            performSort(colKey, sortDirection === "ascending" ? "descending" : "ascending");
            setArrow(arrow === "arrow_upward" ? "arrow_downward" : "arrow_upward")
        } else {
            performSort(colKey, "ascending");
            setArrow("arrow_upward");
        }
    }

    return (
        <button type={"button"} title={"Sort"} className={"icon"} onClick={() => setSort()}>
            <span className="material-symbols-outlined">
                {arrow}
            </span>
        </button>
    );
}

const FabButton = ({ onClick, icon, title }) => {
    return (
        <button type={"button"} title={title} className={"table-fab"} onClick={onClick}>
            <span className="material-symbols-outlined">
                {icon}
            </span>
            <span>{title}</span>
        </button>
    );
}

const IconButton = ({onClick, icon, title}) => {
    return (
        <button type={"button"} title={title} className={"icon"} onClick={onClick}>
            <span className="material-symbols-outlined">
                {icon}
            </span>
        </button>
    );

}

export { SortButton, FabButton, IconButton };