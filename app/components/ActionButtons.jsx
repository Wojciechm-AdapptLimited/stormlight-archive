import React from "react";

const SaveButton = ({ saveCollection }) => {
    return (
        <button type={"button"} title={"Save"} className={"icon"} onClick={saveCollection}>
            <span className="material-symbols-outlined">
                save
            </span>
        </button>
    );
}

const EditButton = ({ setEditMode }) => {
    return (
       <button type={"button"} title={"Edit"} className={"icon"} onClick={setEditMode}>
            <span className="material-symbols-outlined">
                edit
            </span>
       </button>
    );
}

const DeleteButton = ({ deleteCollection }) => {
    return (
       <button type={"button"} title={"Delete"} className={"icon"} onClick={deleteCollection}>
            <span className="material-symbols-outlined">
                delete
            </span>
       </button>
    );
}


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

const AddButton = ({ addCollection }) => {
    return (
        <button type={"button"} title={"Add"} className={"table-fab"} onClick={addCollection}>
            <span className="material-symbols-outlined">
                add
            </span>
            <span>Add</span>
        </button>
    );
}

export { SaveButton, EditButton, DeleteButton, SortButton, AddButton };