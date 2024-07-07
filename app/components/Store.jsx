import React from 'react'
import {Appbar} from "./Appbar.jsx";

export const Store = () => {
    const [search, setSearch] = React.useState("");

    return (
        <div>
            <Appbar search={search} performSearch={setSearch} />
            <div>Hello world!</div>
        </div>
    )
}