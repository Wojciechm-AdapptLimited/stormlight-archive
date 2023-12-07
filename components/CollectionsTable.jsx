import React from "react";

import { SearchBar } from "./SearchBar";
import { SaveButton, EditButton, DeleteButton, SortButton, AddButton } from "./ActionButtons.jsx";
import { Select } from "./Select.jsx";
import { Rating } from "./Rating.jsx";
import {v4} from "uuid";

const books = ["The Way of Kings", "Words of Radiance", "Oathbringer", "Rhythm of War"];
const versions = ["Hardcover", "Paperback", "Ebook", "Audiobook"];

const CollectionRow = ({collection, collections, setCollections, startInEditMode }) => {
    const [editMode, setEditMode] = React.useState(startInEditMode);
    const [title, setTitle] = React.useState(collection.title);
    const [version, setVersion] = React.useState(collection.version);
    const [image, setImage] = React.useState(collection.image);
    const [rating, setRating] = React.useState(collection.rating);

    function saveCollection() {
        const newCollections = collections.map((c) => {
            if (c.id === collection.id) {
                return {
                    ...c,
                    title,
                    version,
                    image,
                    rating,
                };
            }
            return c;
        });
        setCollections(newCollections);
        setEditMode(false);
    }

    function deleteCollection() {
        const newCollections = collections.filter((c) => c.id !== collection.id);
        setCollections(newCollections);
    }

    return (
        <tr>
            <td>
                {editMode ? <Select options={books} value={title} setValue={setTitle} /> : title}
            </td>
            <td>
                {editMode ? <Select options={versions} value={version} setValue={setVersion} /> : version}
            </td>
            <td>
                {editMode
                    ? <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
                    : <img height={100} src={image} alt={title} />
                }
            </td>
            <td>
                <Rating editable={editMode} rating={rating} setRating={setRating} />
            </td>
            <td>
                {editMode ? <SaveButton saveCollection={saveCollection} /> : <EditButton setEditMode={() => setEditMode(true)} />}
                <DeleteButton deleteCollection={deleteCollection} />
            </td>
        </tr>
    )
}

const CollectionsTable = ({ collections }) => {
    const [collectionsState, setCollections] = React.useState(collections);
    const [search, setSearch] = React.useState("");
    const [sortKey, setSortKey] = React.useState("");
    const [sortDirection, setSortDirection] = React.useState("ascending");

    function searchCollection(search) {
        const searchResults = collections.filter((collection) => {
            return collection.title.toLowerCase().includes(search.toLowerCase());
        });

        setCollections(searchResults);
        setSearch(search);
    }

    function sortCollections(key, direction) {
        const sortedCollections = collectionsState.sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === "ascending" ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === "ascending" ? 1 : -1;
            }
            return 0;
        });

        setCollections(sortedCollections);
        setSortKey(key);
        setSortDirection(direction);
    }

    function addCollection() {
        const newCollection = {
            id: v4(),
            title: books[0],
            version: versions[0],
            image: "",
            rating: 0,
            startInEditMode: true,
        };
        const newCollections = [...collectionsState, newCollection];
        setCollections(newCollections);
    }

    return (
        <div className="collections-table">
            <div className={"collections-table-header"}>
                <SearchBar search={search} performSearch={searchCollection} />
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Name <SortButton colKey={"title"} sortKey={sortKey} sortDirection={sortDirection} performSort={sortCollections} /></th>
                        <th>Version</th>
                        <th>Image</th>
                        <th>Rating <SortButton colKey={"rating"} sortKey={sortKey} sortDirection={sortDirection} performSort={sortCollections} /></th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {collectionsState.map((collection) => {
                        return (
                            <CollectionRow key={collection.id} collection={collection} collections={collectionsState} setCollections={setCollections} startInEditMode={collection.startInEditMode}  />
                        );
                    })}
                </tbody>
            </table>
            <AddButton addCollection={addCollection} />
        </div>
    );
}

export { CollectionsTable };