const books = ["The Way of Kings", "Words of Radiance", "Oathbringer", "Rhythm of War"];
const versions = ["Hardcover", "Paperback", "Ebook", "Audiobook"];

const vanillaTable = document.getElementById("collections-table-vanilla-js");
const reactTable = document.getElementById("collections-table-react-js");
const tableBody = vanillaTable.tBodies[0];

function setVanillaTable() {
    reactTable.style.display = "none";
    vanillaTable.style.display = "table";
}

function setReactTable() {
    vanillaTable.style.display = "none";
    reactTable.style.display = "block";
}

const saveButton = (rowId) => `\
<button type="button" title="Save" class="icon" onclick="saveRow(${rowId})" >
    <span class="material-symbols-outlined">
        save
    </span>
</button>
`;

const editButton = (rowId) => `\
<button type="button" title="Edit" class="icon" onclick="editRow(${rowId})" >
    <span class="material-symbols-outlined">
        edit
    </span>
</button>
`;

const deleteButton = (rowId) => `\
<button type="button" title="Delete" class="icon" onclick="deleteRow(${rowId})" >
    <span class="material-symbols-outlined">
        delete
    </span>
</button>
`;


function addRow() {
    const row = tableBody.insertRow(-1);
    const rowId = row.rowIndex;

    const titleCell = row.insertCell(0);
    titleCell.innerHTML = '<select name="title"></select>';
    titleCell.setAttribute("data-label", "Title");
    const titleSelect = titleCell.querySelector("select");
    populateSelect(titleSelect, books);
    titleSelect.value = books[0];

    const versionCell = row.insertCell(1);
    versionCell.innerHTML = '<select name="version"></select>';
    versionCell.setAttribute("data-label", "Version");
    const versionSelect = versionCell.querySelector("select");
    populateSelect(versionSelect, versions);
    versionSelect.value = versions[0];

    const finishedCell = row.insertCell(2);
    finishedCell.setAttribute("data-label", "Finished");
    finishedCell.innerHTML = '<input type="checkbox" name="finished">';

    const actionsCell = row.insertCell(3);
    actionsCell.setAttribute("data-label", "Actions");
    actionsCell.innerHTML = saveButton(rowId) + deleteButton(rowId);
}

function editRow(rowId) {
    const row = tableBody.rows[rowId - 1];
    const titleCell = row.cells[0];
    const versionCell = row.cells[1];
    const actionsCell = row.cells[3];

    const title = titleCell.innerText;
    const version = versionCell.innerText;

    titleCell.innerHTML = '<select name="title"></select>';
    const titleSelect = titleCell.querySelector("select");
    populateSelect(titleSelect, books);
    titleSelect.value = title;

    versionCell.innerHTML = '<select name="version"></select>';
    const versionSelect = versionCell.querySelector("select");
    populateSelect(versionSelect, versions);
    versionSelect.value = version;

    actionsCell.innerHTML = saveButton(rowId) + deleteButton(rowId);
}

function saveRow(rowId) {
    const row = tableBody.rows[rowId - 1];
    const titleCell = row.cells[0];
    const versionCell = row.cells[1];
    const actionsCell = row.cells[3];

    const title = titleCell.querySelector("select").value;
    const version = versionCell.querySelector("select").value;

    titleCell.innerHTML = title;
    versionCell.innerHTML = version;
    actionsCell.innerHTML = editButton(rowId) + deleteButton(rowId);
}

function deleteRow(rowId) {
    tableBody.deleteRow(rowId - 1);

    for (let i = rowId - 1; i < tableBody.rows.length; i++) {
        const row = tableBody.rows[i];
        const actionsCell = row.cells[3];
        const rowId = i + 1;

        if (actionsCell.innerHTML.includes("save")) {
           actionsCell.innerHTML = saveButton(rowId) + deleteButton(rowId);
        } else {
            actionsCell.innerHTML = editButton(rowId) + deleteButton(rowId);
        }

    }
}

function populateSelect(select, options) {
    for (let option of options) {
        const optionElement = document.createElement("option");
        optionElement.value = option;
        optionElement.innerText = option;
        select.appendChild(optionElement);
    }
}