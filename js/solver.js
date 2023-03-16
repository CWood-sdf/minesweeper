var fiftyFifties = [];
var unfilledPositions = [];
var checks = [];
var flagPlacers = [];
const IS_SOLVING = true;
var fiftiesPlacedBy = [];
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
    if (userViewBoard === undefined) {
        return [];
    }
    var ret = [];
    for (var i = 0; i < adjs.length; i++) {
        try {
            if (userViewBoard[adjs[i].x][adjs[i].y] === -2) {
                for (var y = i + 1; y < adjs.length; y++) {
                    if (userViewBoard[adjs[y].x][adjs[y].y] === -2) {
                        var arr = [getIndexFromPosition(adjs[i]), getIndexFromPosition(adjs[y])];
                        arr.sort((a, b) => a - b);
                        ret.push(arr);
                    }
                }
            }
        } catch (e) {
            debugger;
        }
    }
    return ret;
}
//Returns the number of known flags in the surrounding squares (marked and 50-50s)
function getSolvedFlagCount(index) {
    var possibleFifties = getAllPotentialFiftyFifties(index);
    var DEBUG_fifties = possibleFifties.map(e => e.map(v => getPositionFromIndex(v)));
    if (fiftyFifties.length !== 0 && possibleFifties.length !== 0) {
        // debugger;
        // console.log('x');
    }
    var flags = 0;
    var usedFiftySquares = [];
    for (var a of possibleFifties) {
        if (fiftyFifties.findIndex(e => e[0] === a[0] && e[1] === a[1]) !== -1 && usedFiftySquares.indexOf(a[0]) === -1 && usedFiftySquares.indexOf(a[1]) === -1) {
            usedFiftySquares.push(a[0], a[1]);
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
function getActualFlagCount(index) {
    var flags = 0;
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
    // var fiftyFiftySquares = getFiftyFiftySquareObject();
    var potentials = getFiftiesAroundSquare(getPositionFromIndex(index));
    var fiftyFiftySquares = potentials.flat(1);
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
function removeFiftiesOnSquare(position) {
    var index = getIndexFromPosition(position);
    fiftyFifties = fiftyFifties.filter(v => v[0] !== index && v[1] !== index);
}
function getFiftiesAroundSquare(position) {
    var potentials = getAllPotentialFiftyFifties(getIndexFromPosition(position));
    //Reduce all the potential 50-50s to only ones that are in the 50-50s list
    var ret = potentials.filter(v => fiftyFifties.findIndex(e => e[0] === v[0] && e[1] === v[1]) !== -1);
    return ret;
}
function getRevealExceptions(index) {
    // debugger;
    var fifties = getFiftiesAroundSquare(getPositionFromIndex(index));
    fifties = fifties.flat(1);
    //Remove duplicates
    fifties = fifties.filter((v, i) => fifties.findIndex(e => e === v) === i);
    fifties = fifties.map(v => getPositionFromIndex(v));
    return fifties;
}
function countAdjacentUnsolvedSquares(position) {
    var adjs = getAllAdjacentPositions(position);
    var ret = 0;
    for (var adj of adjs) {
        ret += userViewBoard[adj.x][adj.y] === -2;
    }
    return ret;
}
var msgDone = false;
var add = Math.floor(Math.random() * 100 - 50);
var oopsie = false;
var sinceOopsie = 0;
var oopsieIndex = 0;
var DEBUG_index = 0;
var flagsLeftMsg = false;
function solveBoard() {
    // debugger;
    if (board === undefined || userViewBoard === undefined) {
        //Generate at mid position
        revealSquare(BOARD_SIZE * BOARD_SIZE / 2 + BOARD_SIZE / 2);
    }
    // debugger;
    // for (var i = unfilledPositions.length - 1; i >= 0; i--) {
    if (userViewBoard === undefined) {
        return;
    }
    if (oopsie) {
        sinceOopsie--;
    }
    if (sinceOopsie < 0) {
        debugger;
        getSolvedFlagCount(oopsieIndex);
        getRevealExceptions();
    }
    if (flagsLeft < 10 && !flagsLeftMsg) {
        console.log("yeet");
        flagsLeftMsg = true;
    }
    if (unfilledPositions.length !== 0 && n++ % (200 + add) === 0 && !oopsie) {
        add = -199;  //Math.floor(Math.random() * 300 - 50);
        i++;
        i %= unfilledPositions.length;
        var c = unfilledPositions[i];
        var index = getIndexFromPosition(c);
        DEBUG_index = index;
        if (userViewBoard[c.x][c.y] === 0) {
            unfilledPositions.splice(unfilledPositions.findIndex(e => getIndexFromPosition(e) === index), 1);
            return;
        }
        if (checks.indexOf(index) !== -1) {
            debugger;
        }
        // debugger;
        var DEBUG_adjs = getAdjacentSquareNumbers(getIndexFromPosition(c));
        if (countAdjacentUnsolvedSquares(c) === 0) {
            unfilledPositions.splice(unfilledPositions.findIndex(e => getIndexFromPosition(e) === index), 1);
        }
        else if (getSolvedFlagCount(index) === userViewBoard[c.x][c.y]) {
            // debugger;
            //Put 50-50s in exception list
            var fiftyFiftyCopy = fiftyFifties.map(v => v);
            var userViewCopy = userViewBoard.map(v => v.map(e => e));
            var exceptions = getRevealExceptions(index);
            try {
                revealSurroundings(index, exceptions);
            } catch (e) {
                userViewBoard = userViewCopy;
                fiftyFifties = fiftyFiftyCopy;
                oopsieIndex = index;
                sinceOopsie = 4800;
                oopsie = true;
                console.log("Surroudings");
                console.log(userViewBoard[c.x][c.y], board[c.x][c.y], exceptions, getAllAdjacentPositions(c), getAdjacentSquareNumbers(index));
                debugger;
                // for (var j = 0; j < buttons.length; j++) {
                //     var pp = getPositionFromIndex(j);
                //     if (userViewBoard[pp.x][pp.y] === -2 && buttons[j].msg !== "-1") {
                //         buttons[j].msg = "";
                //     }
                // }
                // // getRevealExceptions(index);
                // // getFreeAdjacentSquares(index);
                // // removeFiftiesOnSquare(adj);
                // getSolvedFlagCount(index);
            };
        }
        //If the number of untouched squares is the number of flags needed, flag remaining
        else if (countAdjacentUnsolvedSquares(getPositionFromIndex(index)) === userViewBoard[c.x][c.y] - getActualFlagCount(index)) {
            var adjacents = getFreeAdjacentSquares(index);
            var fiftyFiftyCopy = fiftyFifties.map(v => v);
            var userViewCopy = userViewBoard.map(v => v.map(e => e));
            for (var adj of adjacents) {
                //Need to remove 50-50 smh
                flagSquare(getIndexFromPosition(adj));
                removeFiftiesOnSquare(adj);
            }
            var exceptions = getRevealExceptions(index);
            try {
                revealSurroundings(index, exceptions);
            } catch (e) {
                oopsie = true;
                debugger;
                // userViewBoard = userViewCopy;
                // fiftyFifties = fiftyFiftyCopy;
                // var adjacents = getFreeAdjacentSquares(index);
                // for (var adj of adjacents) {
                //     //Need to remove 50-50 smh
                //     flagSquare(getIndexFromPosition(adj));
                //     removeFiftiesOnSquare(adj);
                // }
                // getRevealExceptions(index);
                // getFreeAdjacentSquares(index);
                // getSolvedFlagCount(index)
            };
        }
        else if (countFreeAdjacentSquares(index) === 2 && userViewBoard[c.x][c.y] - getActualFlagCount(index) === 1) {
            //Generate 50-50
            var fifty = getFreeAdjacentSquares(index).map(v => getIndexFromPosition(v)).sort((a, b) => a - b);
            if (fiftyFifties.findIndex(v => v[0] === fifty[0] && v[1] === fifty[1]) === -1) {
                fiftyFifties.push(fifty);
                fiftiesPlacedBy.push([fifty, index]);
            }
        }
    }
    if (unfilledPositions.length === 0 && !msgDone) {
        console.log("Done");
        msgDone = true;
    }
}