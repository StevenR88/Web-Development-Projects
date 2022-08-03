'use strict';

function isValidName(str) {
    return /^[A-Za-z0-9_]{4,20}$/.test(str);
}

function isValidPassword(str) {
    return /^.{4,60}$/.test(str);
}

function parseJSONToTable(jsonObject) {
    document.getElementById("adminResponse").innerHTML = "";

    let endpointTable = document.createElement('table');
    endpointTable.setAttribute("id", "endPointTable");
    let thead = document.createElement('thead');

    let headerRow = document.createElement('tr');
    let header1 = document.createElement('th');
    header1.innerHTML = "Method";
    let header2 = document.createElement('th');
    header2.innerHTML = "Endpoint";
    let header3 = document.createElement('th');
    header3.innerHTML = "Request";

    headerRow.appendChild(header1);
    headerRow.appendChild(header2);
    headerRow.appendChild(header3);
    thead.appendChild(headerRow);
    endpointTable.appendChild(thead);

    let tbody = document.createElement('tbody');

    for (const key in jsonObject) {
        for (const key2 in jsonObject[key]) {
            let count = jsonObject[key][key2];

            let tableRow = document.createElement('tr');
            let cell1 = document.createElement('td');
            cell1.innerHTML = `${key}`;
            let cell2 = document.createElement('td');
            cell2.innerHTML = `${key2}`;
            let cell3 = document.createElement('td');
            cell3.innerHTML = `${count}`;

            tableRow.appendChild(cell1);
            tableRow.appendChild(cell2);
            tableRow.appendChild(cell3);
            tbody.appendChild(tableRow);
        }
    }

    endpointTable.appendChild(tbody);

    document.getElementById("adminResponse").appendChild(endpointTable);
}

async function sendCredentials() {
    let user = document.getElementById("loginUserNameArea").value;
    let pass = document.getElementById("loginPasswordArea").value;
    const parameters = `user=${user}&pass=${pass}`;
    let responseJSON = await asyncRequestWrapper("POST", "https://game.stirlinganderson.dev/admin", parameters);
    parseJSONToTable(responseJSON.data);
}

function toggleVisibility(elementID) {
    let x = document.getElementById(elementID);
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}

document.addEventListener('DOMContentLoaded', function (event) {
    console.log("Hey");
    document.getElementById('loginShow').addEventListener('click', function (e) {
        toggleVisibility("login");
    });

    document.getElementById('loginBtn').addEventListener('click', function (e) {
        let userData = document.getElementById("loginUserNameArea").value;
        let passwordData = document.getElementById("loginPasswordArea").value;

        if (userData === "" || passwordData === "") {
            document.getElementById("adminResponse").innerHTML = "Cannot send empty strings.";
        } else if (!isValidName(userData)) {
            document.getElementById("adminResponse").innerHTML = "Admin name must be letters or numbers and"
                                                                    + "between 4-20 characters in size.";
        } else if (!isValidPassword(passwordData)) {
            document.getElementById("adminResponse").innerHTML = "Admin password must be between 4-60 characters.";
        } else {
            document.getElementById("adminResponse").innerHTML = "";
            sendCredentials();
            toggleVisibility("login");
        }
    });

})