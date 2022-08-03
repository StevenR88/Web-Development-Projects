'use strict';
const express = require('express');
const crypto = require('crypto');
const fs = require("fs");
const mysql = require('mysql');
const bcrypt = require('bcrypt');
//const cors = require('cors');

const server = express();
server.use(express.urlencoded({ extended: false }));
server.use(express.json());
//server.use(cors());

let connection = mysql.createPool({
    host     : 'localhost',
    user     : "project4537",
    password : "CGbJCAKHXDWGKiEr",
    database : 'project4537',
    multipleStatements: true
});

// server stats for the current run time of the server
class Server_stats {
    constructor() {
        this.server_stats = {}
    }
    addStats = function(method, endpoint) {
        if(this.server_stats[method] === undefined) {
            this.server_stats[method] = {}
        }
        let tempAmount = this.server_stats[method][endpoint]
        this.server_stats[method][endpoint] = 1
        if(tempAmount > 0) {
            this.server_stats[method][endpoint] += tempAmount
        }
    }
}
let stats = new Server_stats()

server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://isaacnje.dev");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header(
        "Access-Control-Allow-Credentials",
        "true"
      );
    if (req.method === 'OPTIONS') {
        console.log('options request');
        stats.addStats('OPTIONS', req.path);
        res.status(200);
        res.end();
        return;
    } 

    // paths that dont require an api key
    if(req.path == "/generateApiKeyAnon" || req.path == "/admin") {
        next();
        return;
    }
    
    let apiKey = req.headers.authorization;
    let valid_key = validateApiKey(apiKey);
    if(valid_key.valid === false) {
        res.status(400);
        res.send({msg: valid_key.msg});
        return;
    }
    let valid_user = authenticate_api_key(apiKey);

    if (!valid_user) {
        res.status(403);
        res.send({msg: "api key is invalid."});
        return;
    }

    next();
});


let SECONDS_BETWEEN_MOVES = 5;



let default_map = [
    ["r", "r", "r", "r", "r", "b", "b", "b", "b", "b"],
    ["r", "r", "r", "r", "r", "b", "b", "b", "b", "b"],
    ["r", "r", "r", "r", "r", "b", "b", "b", "b", "b"],
    ["r", "r", "r", "r", "r", "b", "b", "b", "b", "b"],
    ["r", "r", "r", "r", "r", "b", "b", "b", "b", "b"],

    ["g", "g", "g", "g", "g", "y", "y", "y", "y", "y"],
    ["g", "g", "g", "g", "g", "y", "y", "y", "y", "y"],
    ["g", "g", "g", "g", "g", "y", "y", "y", "y", "y"],
    ["g", "g", "g", "g", "g", "y", "y", "y", "y", "y"],
    ["g", "g", "g", "g", "g", "y", "y", "y", "y", "y"]
]

console.log(JSON.stringify(default_map))

server.get('/getUserTimeLastMove', async function (req, res) {
    let apiKey = req.headers.authorization;
    let api_key_name = getApiKeyName(apiKey);

    stats.addStats("GET", "/getUserTimeLastMove")
    let results = await sqlAsyncQueryWrapper("SELECT server_time FROM color_changes WHERE api_key_name = ?", [api_key_name])
    if (results[0]) {

    }
    res.send({msg: results});
});

server.get('/getTime', function (req, res) {
    stats.addStats("GET", "/getTime")
    let s = new Date().toLocaleString();
    res.send({msg: s});
});

server.get('/map', async function (req, res) {
    stats.addStats("GET", "/map")
   
    let results = await sqlAsyncQueryWrapper("SELECT map FROM map WHERE ID = ?", [0])
    if (results.length > 0) {
        res.send({
            msg: "here is the map",
            map: JSON.parse(results[0].map)
        });
        return;
    }
    res.status(400)
    res.send({msg: "map not found"});
});

server.get('/score', async function (req, res) {
    stats.addStats("GET", "/score")
    
    let results = await sqlAsyncQueryWrapper("SELECT * FROM score WHERE ID = 0", [0])
    if (results.length > 0) {
        res.send({
            msg: "here is the score",
            score: results[0]
        });
        return;
    }
    res.status(400)
    res.send({msg: "score not found"});
});




server.post('/pickColor', async (req, res) => {
    stats.addStats("POST", "/pickColor");

    let apiKey = req.headers.authorization;
    let color = req.body.color;
    let validInputs = validateColorChoice(color);

    if(validInputs.valid === false) {
        res.status(400);
        res.send({msg: validInputs.msg});
        return;
    }

    let api_key_name = getApiKeyName(apiKey);

    let results;
    try {
        results = await sqlAsyncQueryWrapper("INSERT INTO color_choice (api_key_name, color_choice) VALUES (?, ?)" , [api_key_name, color]);
    } catch (error) {
        res.status(400);
        res.send({msg: `color already picked`});
        return;
    }
    res.send({msg: `success`});

    

    
});



server.post('/admin', async function (req, res) {
    stats.addStats("POST", "/admin");

    let validInputs = validateUserPassInput(req.body.user, req.body.pass);

    if(validInputs.valid === false) {
        res.status(400);
        res.send(validInputs.msg);
    }

    console.log(`connection with user: ${req.body.user} pass: ${req.body.pass}`);
    let validUser = await authenticate(req.body.user, req.body.pass, true);

    if(!validUser) {
        res.status(400);
        res.send({msg: "invalid user."});
    } else {
        res.send(stats.server_stats);
    }
});


server.delete('/resetMap', async function (req, res) {
    stats.addStats("DELETE", "/resetMap");

    await sqlAsyncQueryWrapper("REPLACE INTO map (ID, map) VALUES (?, ?)" , [0, JSON.stringify(default_map)]);
    let map = await sqlAsyncQueryWrapper("SELECT map FROM map WHERE ID = ?", [0]);
    if (map.length > 0) {
        map = JSON.parse(map[0].map)
    } else {
        return {valid: false, msg: "map does not exist"};
    }
    res.send({
        msg: "map deleted and re-created",
        map: map
    });
});



server.post('/generateApiKeyAnon', async function (req, res) {
    stats.addStats("POST", "/generateApiKeyAnon");
    let apiKey = await generateApiKeyAnon();
    if(!apiKey) {
        res.status(400);
        res.send({msg: "api key could not be generated."});
    } else {
        console.log(`Generated api key ${apiKey.apiKey}`);
        res.send(apiKey);
    }
});


server.put('/playerMoveRequest', async (req, res) => {

    stats.addStats("PUT", "/playerMoveRequest");

    let apiKey = req.headers.authorization;


    let api_key_name = getApiKeyName(apiKey)
   
    let last_move_time = await sqlAsyncQueryWrapper("SELECT server_time FROM color_changes WHERE api_key_name = ?", [api_key_name]);

    if(last_move_time.length > 0) {
        let server_time = new Date();
        console.log(`server time: ${server_time}`)
        console.log(`last move time: ${last_move_time[0].server_time}`)
        let last_move = new Date(last_move_time[0].server_time);
        console.log(`last move2 time: ${last_move}`)
        let seconds_diff = diff_seconds(server_time, last_move);
        console.log(seconds_diff);
        if (seconds_diff < SECONDS_BETWEEN_MOVES) {
            res.status(400);
            res.send({msg: `moving too quick! ${SECONDS_BETWEEN_MOVES - seconds_diff} seconds remaining`});
            return;
        }
    } 

    let row = req.body.row;
    let col = req.body.col;

    let validInputs = await validateInputPosition(row, col);
    row = parseInt(row)
    col = parseInt(col)

    if(validInputs.valid === false) {
        res.status(400);
        res.send({msg: validInputs.msg});
        return;
    }

    console.log(`player move inputs are valid`);

    let color_choice =  await sqlAsyncQueryWrapper("SELECT color_choice FROM color_choice WHERE api_key_name = ?", [api_key_name])
    if(color_choice.length <= 0) {
        // user has not picked color yet
        res.status(400);
        res.send({msg: `please pick a color on the previous page`});
        return;
    } 


    let map = await sqlAsyncQueryWrapper("SELECT map FROM map WHERE ID = ?", [0]);
    if (map.length > 0) {
        map = JSON.parse(map[0].map)
    } else {
        res.status(400);
        res.send({msg: `map is gone`});
        return
    }
    console.log(`${color_choice[0].color_choice} ${map[row][col]}`)
    console.log(`${typeof(color_choice[0].color_choice)} ${typeof(map[row][col])}`)

    if (map[row][col] == color_choice[0].color_choice) {
        res.status(400);
        res.send({msg: `Clicking your own tile has no effect`});
        return;
    }
    let status = false;
    //Check Top Square
    if (row !== 0) {
        if (map[row - 1][col] == color_choice[0].color_choice) {
            status = true;
        }
    }

    //Check Bottom Square
    if (row !== map.length - 1 && status === false) {
        if (map[row + 1][col] == color_choice[0].color_choice) {
            status = true;
        }
    }

    //Check Right Square
    if (col !== map[0].length - 1 && status === false) {
        if (map[row][col + 1] == color_choice[0].color_choice) {
            status = true;
        }
    }

    //Check Left Square
    if (col !== 0 && status === false) {
        if (map[row][col - 1] == color_choice[0].color_choice) {
            status = true;
        }
    }

    

    if (status) {
        map[row][col] = color_choice[0].color_choice;
        
        if (checkIfGameOver(map)) {
            switch (color_choice[0].color_choice) {
                case 'r':
                    await sqlAsyncQueryWrapper("UPDATE score SET red_score = red_score + 1 WHERE ID = ?" , [0]);
                    break;
                case 'b':
                    await sqlAsyncQueryWrapper("UPDATE score SET blue_score = blue_score + 1 WHERE ID = ?" , [0]);
                    break;
                case 'y':
                    await sqlAsyncQueryWrapper("UPDATE score SET yellow_score = yellow_score + 1 WHERE ID = ?" , [0]);
                    break;
                case 'g':
                    await sqlAsyncQueryWrapper("UPDATE score SET green_score = green_score + 1 WHERE ID = ?" , [0]);
                    break;
            }
            await sqlAsyncQueryWrapper("REPLACE INTO map (ID, map) VALUES (?, ?)" , [0, JSON.stringify(default_map)]);

        } else {
            let server_time = new Date();
            console.log("date")
            await sqlAsyncQueryWrapper("REPLACE INTO color_changes (api_key_name, server_time) VALUES (?, ?)" , [api_key_name, server_time]);
            await sqlAsyncQueryWrapper("REPLACE INTO map (ID, map) VALUES (?, ?)" , [0, JSON.stringify(map)]);
        }
        
        res.send({
            msg: `You've Captured Square(${row},${col})`,
            map: map
        });
        
        
        
    } else {
        res.status(400);
        res.send({msg: `invalid move Square(${row},${col})`});
    }
    
})




// ############## INPUT VALIDATION FUNCTIONS ##############
function validateUserPassInput(username, password) {
    if (username === undefined || !isValidName(username)) {
        return {valid: false, msg: "name is not valid. a-z & A-Z & 0-9 & _ between 4-20 chars"};
    }

    if(password === undefined || !isValidPassword(password)) {
        return {valid: false, msg: "password is not valid."};
    }
    return {valid: true, msg: "valid user"}
}

async function validateInputPosition(row, col) {
    let map = await sqlAsyncQueryWrapper("SELECT map FROM map WHERE ID = ?", [0]);
    if (map.length > 0) {
        map = JSON.parse(map[0].map)
    } else {
        return {valid: false, msg: "map does not exist"};
    }
    if (row === undefined) {
        return {valid: false, msg: "row is not defined"};
    }
    row = parseInt(row);
    if (row < 0 || row > map.length) {
        return {valid: false, msg: `row must be within 0 - ${map.length}`};
    }
    col = parseInt(col);
    if (col === undefined) {
        return {valid: false, msg: "col is not defined"};
    }
    if (col < 0 || col > map[0].length) {
        return {valid: false, msg: `col must be within 0 - ${map[0].length}`};
    }

    return {valid: true, msg: "valid inputs"}
}

function validateColorChoice(color) {
    if (color === undefined) {
        return {valid: false, msg: "color is not defined"};
    }
    if (color != 'r' && color != 'g' && color != 'b' && color != 'y') {
        return {valid: false, msg: `color must equal one of [r, g, b, y]`};
    }

    return {valid: true, msg: "valid color choice"}
}

function validateApiKey(apiKey) {
    if (apiKey === undefined) {
        return {valid: false, msg: "apiKey is not defined"};
    }
    if (apiKey.length != 61) {
        return {valid: false, msg: `api key length is invalid`};
    }

    return {valid: true, msg: "valid api key"}
}

function isValidName(str) {
    return /^[A-Za-z0-9_]{4,20}$/.test(str);
}

function isValidPassword(str) {
    return /^.{4,60}$/.test(str);
}


// ############## API KEY MANAGEMENT FUNCTIONS ##############
async function generateApiKey(username){
    let apiKeyHeader = crypto.randomBytes(20).toString('base64').slice(0, 20)
    let apiKey = crypto.randomBytes(40).toString('base64').slice(0, 40)

    const salt = bcrypt.genSaltSync(10);
    // hash password with salt
    const hash = bcrypt.hashSync(apiKey, salt);
    let results = await sqlAsyncQueryWrapper('UPDATE userlist SET api_key_name = ?, api_key_hash = ? WHERE username = ?', [apiKeyHeader, hash, username]);
    console.log(results)

    let full_api_key = apiKeyHeader + ":" + apiKey;
    console.log(full_api_key)
    console.log(await authenticate_api_key(full_api_key))
    let returnJson = {
        apiKey: apiKeyHeader + ":" + apiKey
    }
    return returnJson;

}

async function generateApiKeyAnon(){
    let apiKeyHeader = crypto.randomBytes(20).toString('base64').slice(0, 20).replace("+","A");
    let apiKey = crypto.randomBytes(40).toString('base64').slice(0, 40).replace("+","A");

    const salt = bcrypt.genSaltSync(10);
    // hash password with salt
    const hash = bcrypt.hashSync(apiKey, salt);
    let results = await sqlAsyncQueryWrapper('INSERT INTO apiKeys (api_key_name, api_key_hash) values (?, ?)', [apiKeyHeader, hash]);
    console.log(results)

    let full_api_key = apiKeyHeader + ":" + apiKey;
    console.log(full_api_key)
    console.log(await authenticate_api_key(full_api_key))
    let returnJson = {
        apiKey: full_api_key
    }
    return returnJson;

}

function getApiKeyName(apiKey) {
    return apiKey.slice(0, 20);
}

async function authenticate_api_key(apiKey) {
    let apiKeyName = apiKey.slice(0, 20)
    let apiKeyValue = apiKey.slice(21, 61)

    let results = await sqlAsyncQueryWrapper("SELECT * FROM apiKeys WHERE api_key_name = ?", [apiKeyName])
    if(results.length > 0) {
        // user found
        //console.log("api key found")
        let hash = results[0].api_key_hash
        let validKey = bcrypt.compareSync(apiKeyValue, hash)
        //console.log(`is valid api key? ${validKey}`)
        if(validKey) {
            return true;
        }
    } else {
        // user not found
        //console.log("user not found")
        return false;
    };
}



// ############## USER MANAGEMENT FUNCTIONS ##############
async function authenticate(username, password, admin_priv_req) {

    let results = await sqlAsyncQueryWrapper("SELECT * FROM userlist WHERE username = ?", [username])
    if(results.length > 0) {
        // user found
        console.log("user found")
        let hash = results[0].pwd_hash
        let validUser = bcrypt.compareSync(password, hash)
        console.log(`is valid user? ${validUser}`)
        if(validUser) {
            if(admin_priv_req) {
                console.log("admin priv requested")
                let isAdmin = results[0].admin_account
                if (isAdmin) {
                    console.log("admin priv granted")
                    return true;
                } else {
                    console.log("admin priv rejected")
                    return false;
                }
            }
            console.log("user priv granted")
            return true;
        }
        console.log("user priv rejected")
        return false;
    } else {
        // user not found
        console.log("user not found")
        return false;
    };

}

async function addUser(username, password, admin_flag) {

    // this is redundant
    let validInputs = validateUserPassInput(username, password);
    if(validInputs.valid = false) {
        console.log("invalid inputs")
        return false;
    }

    // check if exists in databse for testing
    let results = await sqlAsyncQueryWrapper('SELECT * FROM userlist WHERE username = ?', [username]);
    if(results.length > 1) {
        console.log("user already exists")
        return false;
    }
    // generate salt. 10 gives ~10 hashes/s of speed, so this hash will take >100ms. going to 13 would give ~1hash/s
    const salt = bcrypt.genSaltSync(10);

    // hash password with salt
    const hash = bcrypt.hashSync(password, salt);

    console.log(`adding user ${username} ${password} ${hash}`)
    // store username, password, and salt to database
    // add user to database
    results = await sqlAsyncQueryWrapper('INSERT INTO userlist (username, pwd_hash, admin_account) values (?, ?, ?)', [username, hash, admin_flag]);
    // if results == reject??? { do something }????????
    console.log(results)
    //generateApiKey(username);
    return authenticate(username, password, admin_flag);
}

// ############## WRAPPER FOR MYSQL PROMISE ##############
async function sqlAsyncQueryWrapper(query, values) {
    return await new Promise((resolve, reject) => {
        connection.query(query, values, function (error, results, fields) {
            if (error) {
                reject(error);
            }
            resolve(results)
        });
    })
}


// ############## DEBUG/TESTING FUNCTIONS ##############
// init database each time server runs, this adds the admin account found in admin_credentials.json
async function initDB() {
    let admin_cred_file = fs.readFileSync('admin_credentials.json');
    let admin_credentials = JSON.parse(admin_cred_file);
    const createDBAndTables = fs.readFileSync('init_db.sql', "utf8");
    let results = await sqlAsyncQueryWrapper(createDBAndTables, null);
    //console.log(results);
    await sqlAsyncQueryWrapper("INSERT INTO map (ID, map) VALUES (?, ?)" , [0, JSON.stringify(default_map)]);
    await sqlAsyncQueryWrapper("INSERT INTO score (ID, red_score, blue_score, yellow_score, green_score) VALUES (?, ?, ?, ?, ?)" , [0, 0, 0, 0, 0]);
    let testRes = await sqlAsyncQueryWrapper("SELECT COUNT(*) FROM userlist", null)
    //console.log(testRes);
    let count = testRes[0]['COUNT(*)'];
    if (count == 0) {
        await addUser(admin_credentials.username, admin_credentials.password, true);
    }
}


// test function for parsing the json used for the admin response
function testJson2Parse() {
    for (const key in testJson2) {
        for (const key2 in testJson2[key]) {
            let count = testJson2[key][key2]
            console.log(`count for ${key}, ${key2} is ${count}`);
        }
    }
}

function diff_seconds(time_future, time_past) {
    let seconds_diff = (time_future.getTime() - time_past.getTime()) / 1000;
    return Math.abs(Math.round(seconds_diff));
}

function checkIfGameOver(map) {
    let color = map[0][0];

    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] != color) {
                return false;
            }
        }
        
    }
    return true;
}


// ############## START SERVER ##############
let port = 8999;
server.listen(port, () => {
    console.log("Running on port " + port);
});

// call function to add admin account and init database
initDB()