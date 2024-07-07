import React from "react";
import { createRoot } from "react-dom/client";
import { Store } from "../components/Store.jsx";


const root = document.getElementById("root");

createRoot(root).render(
    <Store />
);

