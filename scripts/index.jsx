import React from "react";
import { createRoot } from "react-dom/client";
import { CollectionsTable } from "../components/CollectionsTable.jsx";
import collections from "../inital_collection.json";
import {v4} from "uuid";

console.log(collections);

const collectionsWithIds = collections.map(collection => ({
    ...collection,
    id: v4(),
    startInEditMode: false
}));


const root = document.getElementById("collections-table-react-js");

createRoot(root).render(
    <CollectionsTable collections={collectionsWithIds} />
);

root.style.display = "none";

