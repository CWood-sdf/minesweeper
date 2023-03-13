var fiftyFifties = [];
var unfilledPositions = [];
const IS_SOLVING = true;
//Compiles all the 50-50s into an object that has each position as an indexx
function getFiftyFiftySquareObject() {
    var ret = [];
    for (var i of fiftyFifties) {
        for (var index of i) {
            ret.push(index);
        }
    }
    return ret;
}
//Returns a list of all the free squares combined together in all the possible ways
function getAllPotentialFiftyFifties(index) {
    var adjs = getAllAdjacentPositions(getPositionFromIndex(index));
    var ret = [];
    for (var i = 0; i < adjs.length; i++) {
        if (userViewBoard[adjs[i].x][adjs[i].y] === -2) {
            for (var y = i + 1; y < adjs.length; y++) {
                if (userViewBoard[adjs[y].x][adjs[y].y] === -2) {
                    var arr = [getIndexFromPosition(adjs[i]), getIndexFromPosition(adjs[y])];
                    arr.sort((a, b) => a - b);
                    ret.push(arr);
                }
            }
        }
    }
    return ret;
}
//Returns the number of known flags in the surrounding squares (marked and 50-50s)
function getSolvedFlagCount(index) {
    var possibleFifties = getAllPotentialFiftyFifties(index);
    var flags = 0;
    for (var a of possibleFifties) {
        if (fiftyFifties.findIndex(e => e === a) !== -1) {
            flags++;
        }
    }
    var adjs = getAllAdjacentPositions(getPositionFromIndex(index));
    for (var adj of adjs) {
        if (userViewBoard[adj.x][adj.y] === -1) {
            flags++;
        }
    }
    return flags;
}
//Returns the number of actually unknown adjacent squares (excluding 50s)
function getFreeAdjacentSquares(index) {
    var adjs = getAllAdjacentPositions(getPositionFromIndex(index));
    var fiftyFiftySquares = getFiftyFiftySquareObject();
    var ret = [];
    for (var c of adjs) {
        if (userViewBoard[c.x][c.y] === -2 && fiftyFiftySquares.findIndex(e => getIndexFromPosition(c) === e) === -1) {
            ret.push(c);
        }
    }
    return ret;
}
function countFreeAdjacentSquares(index) {
    return getFreeAdjacentSquares(index).length;
}
var i = 0;
var n = 0;
function getAdjacentSquareNumbers(index) {
    var adjs = getAllAdjacentPositions(getPositionFromIndex(index));
    var ret = adjs.map(e => userViewBoard[e.x][e.y]);
    return ret;
}
function solveBoard() {
    if (board === undefined) {
        //Generate at mid position
        revealSquare(BOARD_SIZE * BOARD_SIZE / 2 + BOARD_SIZE / 2);
    }
    // debugger;
    // for (var i = unfilledPositions.length - 1; i >= 0; i--) {
    if (unfilledPositions.length !== 0 && n++ % 40 === 0) {
        i++;
        i %= unfilledPositions.length;
        var c = unfilledPositions[i];
        var index = getIndexFromPosition(c);
        if (userViewBoard[c.x][c.y] === 0) {
            unfilledPositions.splice(unfilledPositions.findIndex(e => getIndexFromPosition(e) === index), 1);
            return;
        }
        // debugger;
        var DEBUG_adjs = getAdjacentSquareNumbers(getIndexFromPosition(c));
        if (getSolvedFlagCount(index) === userViewBoard[c.x][c.y]) {
            // debugger;
            //Put 50-50s in exception list
            revealSurroundings(index);
        }
        //If the number of untouched squares is the number of flags needed, flag remaining 
        else if (countFreeAdjacentSquares(index) === userViewBoard[c.x][c.y] - getSolvedFlagCount(index)) {
            var adjacents = getFreeAdjacentSquares(index);
            for (var adj of adjacents) {
                //Need to remove 50-50 smh
                flagSquare(getIndexFromPosition(adj));
            }
            revealSurroundings(index);
        }
        else if (countFreeAdjacentSquares(index) === 2 && userViewBoard[c.x][c.y] - getSolvedFlagCount(index) === 1) {
            //Generate 50-50
        }
    }
}