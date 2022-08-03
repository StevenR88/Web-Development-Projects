let numRows = 10;
let numColumns = 10;

const defaultMap = [
    ['r', 'r', 'r', 'r', 'r', 'b', 'b', 'b', 'b', 'b'],
    ['r', 'r', 'r', 'r', 'r', 'b', 'b', 'b', 'b', 'b'],
    ['r', 'r', 'r', 'r', 'r', 'b', 'b', 'b', 'b', 'b'],
    ['r', 'r', 'r', 'r', 'r', 'b', 'b', 'b', 'b', 'b'],
    ['r', 'r', 'r', 'r', 'r', 'b', 'b', 'b', 'b', 'b'],

    ['g', 'g', 'g', 'g', 'g', 'y', 'y', 'y', 'y', 'y'],
    ['g', 'g', 'g', 'g', 'g', 'y', 'y', 'y', 'y', 'y'],
    ['g', 'g', 'g', 'g', 'g', 'y', 'y', 'y', 'y', 'y'],
    ['g', 'g', 'g', 'g', 'g', 'y', 'y', 'y', 'y', 'y'],
    ['g', 'g', 'g', 'g', 'g', 'y', 'y', 'y', 'y', 'y']
]

let map = []

// User's Current Color
let currentColor = 'r';

//Scoreboard
let yScore = 0;
let bScore = 0;
let rScore = 0;
let gScore = 0;

let numOfMovesMade = 0;

function setScoreBoard() {
    let scoreboardDiv = document.getElementById("scoreboard");
    scoreboardDiv.innerHTML = '';
    scoreboardDiv.innerHTML = "RED: " + rScore + "\tBLUE: " + bScore + "\tYELLOW: " + yScore
        + "\tGREEN: " + gScore;
}

function setCurrentColor() {
    let localStorageColor = localStorage.getItem("color");
    if (localStorageColor === 'r' || localStorageColor === 'b' ||
        localStorageColor === 'y' || localStorageColor === 'g') {
        currentColor = localStorageColor;
    } else {
        window.alert("Unable to get user's color choice");
    }
}

function fillMap() {
    let pixelMapDiv = document.getElementById('pixelMap');
    pixelMapDiv.innerHTML = '';
    for (let c = 0; c < numColumns; c++) {
        for (let r = 0; r < numRows; r++) {
            let divToAdd = document.createElement('div');
            let className = "pos" + c + "-" + r + " pixel";
            divToAdd.setAttribute("id", map[r][c]);
            divToAdd.setAttribute("class", className);
            divToAdd.setAttribute("data_c", c);
            divToAdd.setAttribute("data_r", r);
            divToAdd.setAttribute("onclick", "changeColor(this)");

            pixelMapDiv.appendChild(divToAdd);
        }
    }
}

async function changeColor(currentPixel) {
    console.log("Col:" + currentPixel.getAttribute('data_c')  + "Row" + currentPixel.getAttribute('data_r'));
    let status = false;
    let user_api_key = localStorage.getItem("apiKey");
    let c = parseInt(currentPixel.getAttribute('data_c'));
    let r = parseInt(currentPixel.getAttribute('data_r'));

    let parameters = `apiKey=${user_api_key}&row=${r}&col=${c}`;
    let returnJson = await putRequest("playerMoveRequest", parameters);

    if (returnJson.status === 200) {
        document.getElementById('serverResponse').innerHTML = `${returnJson.data.msg}`;
        map = returnJson.data.map;
        fillMap();
        numOfMovesMade++;
        localStorage.setItem("num_moves_made", numOfMovesMade);
    } else if (returnJson.status === 400 || returnJson.status === 404) {
        document.getElementById('serverResponse').innerHTML = `Request Failed. error: ${returnJson.data.msg}`;
    } else {
        document.getElementById('serverResponse').innerHTML = `error: ${returnJson.status}`;
    }
}

async function getMapFromServer() {
    let newMap = await getRequest("map", null);
    map = newMap.data.map;
}

async function getScoreFromServer() {
    let newScore = await getRequest("score", null);
    yScore = newScore.data.score.yellow_score;
    bScore = newScore.data.score.blue_score;
    rScore = newScore.data.score.red_score;
    gScore = newScore.data.score.green_score;
    console.log("Score Retrieved");
    setScoreBoard();
}

async function doMapReset() {
    let newMap = await deleteRequest("resetMap", null);
    map = newMap.data.map;
}

async function resetMap() {
    await doMapReset();
    fillMap();
    console.log("Map Reset to Default");
}

async function checkForValidMove() {
    let user_api_key = localStorage.getItem("apiKey");
    let time_of_last_move = await putRequest("playerMoveRequest", "apiKey=" + user_api_key);
    return time_of_last_move;
}

async function postUserTimeOfMove() {
    console.log("postUserTimeOfMove() successfully called");

    let user_api_key = localStorage.getItem("apiKey");
    console.log("api_key to send in postUserTimeOfMove(): " + user_api_key);
    await postRequest("postUserTimeOfMove", "apiKey=" + user_api_key);
}

async function refreshMap() {
    await getMapFromServer();
    fillMap();
    console.log("Map Refreshed");
}

async function driver() {
    await getMapFromServer();
    setCurrentColor();
    setScoreBoard();
    fillMap();
    setInterval(refreshMap, 1000);
    setInterval(getScoreFromServer, 1000);
}

document.addEventListener('DOMContentLoaded', function (event) {
    driver();

    document.getElementById('reset').addEventListener('click', async function (e) {
        await resetMap();
        await getScoreFromServer();
        fillMap();
    })
})
