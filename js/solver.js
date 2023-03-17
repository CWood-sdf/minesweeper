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
function countAdjacentPartialUnsolvedSquares(position) {
    var possibleFifties = getAllPotentialFiftyFifties(index);
    var usedFiftySquares = [];
    for (var a of possibleFifties) {
        if (fiftyFifties.findIndex(e => e[0] === a[0] && e[1] === a[1]) !== -1 && usedFiftySquares.indexOf(a[0]) === -1 && usedFiftySquares.indexOf(a[1]) === -1) {
            usedFiftySquares.push(a[0], a[1]);
        }
    }
    var adjs = getAllAdjacentPositions(position);
    var ret = 0;
    for (var adj of adjs) {
        if (userViewBoard[adj.x][adj.y] === -2 && usedFiftySquares.indexOf(getIndexFromPosition(adj)) === -1) {
            ret++;
        }
    }
    return ret;
}
//only returns false when a square is overloaded
function boardIsGood(final) {
    for (var x = 0; x < userViewBoard.length; x++){
        for (var y = 0; y < userViewBoard[x].length; y++) {
            var position = p.createVector(x, y);
            if (userViewBoard[x][y] <= 0) {
                continue;
            }
            var adjs = getAllAdjacentPositions(position);
            var flags = 0;
            for (let adj of adjs) {
                flags += userViewBoard[adj.x][adj.y] === -1;
            }
            if (flags > userViewBoard[x][y]) {
                return false;
            }
            if (final && flags != userViewBoard[x][y]) {
                return false;
            }
        }
    }
    return true;
}
function bruteForcePossible(flags, millis) {
    if (flags === 0) {
        return boardIsGood(true);
    }
    var empties = [];
    for (var x = 0; x < userViewBoard.length; x++) {
        for (var y = 0; y < userViewBoard[x].length; y++) {
            if (userViewBoard[x][y] === -2) {
                empties.push(p.createVector(x, y));
            }
        }
    }
    var indices = empties.map((v, i) => i);
    var j = indices.length - 1;
    while (j > 0) {
        var other = Math.floor(Math.random() * (j + 1));
        var temp = indices[j];
        indices[j] = indices[other];
        indices[other] = temp;
        j--;
    }
    for (var i of indices){
        //timeout
        if (Date.now() - millis > 1000) {
            return true;
        }
        var old = userViewBoard[empties[i].x][empties[i].y];
        userViewBoard[empties[i].x][empties[i].y] = -1;
        if (bruteForcePossible(flags - 1, millis)) {
            userViewBoard[empties[i].x][empties[i].y] = old;
            return true;
        }
        userViewBoard[empties[i].x][empties[i].y] = old;
    }
    return false;
}
function bruteForceSolve() {
    var empties = [];
    for (var x = 0; x < userViewBoard.length; x++) {
        for (var y = 0; y < userViewBoard[x].length; y++) {
            if (userViewBoard[x][y] === -2) {
                empties.push(p.createVector(x, y));
            }
        }
    }
    var millis = Date.now();
    console.log(`Brute forcing on ${empties.length} elements with depth ${flagsLeft}...`);
    // debugger;
    var indices = empties.map((v, i) => i);
    var j = indices.length - 1;
    while (j > 0) {
        var other = Math.floor(Math.random() * (j + 1));
        var temp = indices[j];
        indices[j] = indices[other];
        indices[other] = temp;
        j--;
    }
    var time = 0;
    for (var i of indices) {
        if (Date.now() - millis > 1000) {
            return;
        }
        var old = userViewBoard[empties[i].x][empties[i].y];
        userViewBoard[empties[i].x][empties[i].y] = -1;
        if (!boardIsGood() || !bruteForcePossible(flagsLeft - 1, millis)) {
            userViewBoard[empties[i].x][empties[i].y] = old;
            revealSquare(getIndexFromPosition(empties[i]));
            console.log("Brute force find square " + empties[i]);
            return;
        } else {
            userViewBoard[empties[i].x][empties[i].y] = old;
        }
        console.log((time + 1) / empties.length * 100 + "%");
        time++;
    }
}
var msgDone = false;
var add = Math.floor(Math.random() * 100 - 50);
var oopsie = false;
var sinceOopsie = 0;
var oopsieIndex = 0;
var DEBUG_index = 0;
var flagsLeftMsg = false;
var flagsLeftTime = 0.5;
var msg50 = false;
var lastBruteForce = 10000;
var changed = true;
var changedTime = 0;
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
    if (fiftyFifties.length > flagsLeft) {
        //Remove all the overlapping fiftyFifties
        if (!msg50) {
            console.log("removing 50-50s");
            console.log(fiftyFifties);
        }
        for (var k = fiftyFifties.length - 1; k >= 0; k--){
            var f = fiftyFifties[k];
            var remIndex = fiftyFifties.findIndex((v, j) => j !== k && (v.indexOf(f[0]) !== -1 || v.indexOf(f[1]) !== -1));
            while (remIndex !== -1) {
                fiftyFifties.splice(remIndex, 1);
                remIndex = fiftyFifties.findIndex((v, j) => j !== k && (v.indexOf(f[0]) !== -1 || v.indexOf(f[1]) !== -1));
            }
            k = fiftyFifties.findIndex(v => v[0] === f[0] && v[1] === f[1]);
            fiftyFifties.splice(k, 1);
        }
        if (!msg50) {
            console.log(fiftyFifties);
        }
        msg50 = true;
    }
    if (flagsLeft < 10 && !flagsLeftMsg) {
        console.log("yeet");
        flagsLeftMsg = true;
    }
    if (flagsLeft < 10) {
        lastBruteForce--;
    }
    if (flagsLeft < 10 && flagsLeft > 1 && (lastBruteForce < 0 && changed || (changedTime++ > BOARD_SIZE*BOARD_SIZE*40))) {
        bruteForceSolve();
        lastBruteForce = BOARD_SIZE * BOARD_SIZE * 4 + 100;
        changed = false;
        changedTime = 0;
    }
    if (flagsLeft === 1 && flagsLeftTime === 0.5 && flagsLeftTime !== 0.3) {
        console.log("Yeeting soon");
        flagsLeftTime = BOARD_SIZE * BOARD_SIZE * 10;
    }
    if (flagsLeftTime !== 0.5 && flagsLeftTime !== 0.3) {
        flagsLeftTime--;
    }
    if (flagsLeftTime < 0 && flagsLeft === 1) {
        console.log("yeet force check");
        // debugger;
        var xStart = BOARD_SIZE;
        var yStart = BOARD_SIZE;
        var xEnd = 0;
        var yEnd = 0;
        for (var x = 0; x < BOARD_SIZE; x++){
            for (var y = 0; y < BOARD_SIZE; y++){
                if (userViewBoard[x][y] === -2) {
                    //4's a bit much, but whatevs
                    xStart = x - 4 < xStart ? x - 4 : xStart;
                    yStart = y - 4 < yStart ? y - 4 : yStart;
                    xEnd = x + 4 > xEnd ? x + 4 : xEnd;
                    yEnd = y + 4 > yEnd ? y + 4 : yEnd;
                }
            }
        }
        var arr = [];
        if (xStart < 0) {
            xStart = 0;
        }
        if (yStart < 0) {
            yStart = 0;
        }
        if (xEnd >= BOARD_SIZE) {
            xEnd = BOARD_SIZE;
        }
        if (yEnd >= BOARD_SIZE) {
            yEnd = BOARD_SIZE;
        }
        var newBoard = [];
        for (var x = xStart; x < xEnd; x++){
            newBoard.push([]);
            for (var y = yStart; y < yEnd; y++){
                var val = -3;
                if (countAdjacentUnsolvedSquares(p.createVector(x, y)) > 0) {
                    val = userViewBoard[x][y];
                }
                else if (userViewBoard[x][y] < 0) {
                    val = userViewBoard[x][y];
                } 
                newBoard[x - xStart].push(val);
            }
        }
        var solved = false;
        var solvedOn = null;
        for (var x = 0; x < newBoard.length; x++){
            for (var y = 0; y < newBoard[x].length; y++){
                if (newBoard[x][y] === -2) {
                    newBoard[x][y] = -1;
                    var exit = false;
                    for (var x2 = 0; x2 < newBoard.length; x2++) {
                        for (var y2 = 0; y2 < newBoard[x].length; y2++) {
                            if (newBoard[x2][y2] > 0) {
                                var f = 0;
                                for (var xp = -1; xp <= 1; xp++){
                                    for (var yp = -1; yp <= 1; yp++){
                                        var newX = x2 + xp;
                                        var newY = y2 + yp;
                                        if (newX >= 0 && newX < newBoard.length && newY >= 0 && newY < newBoard[x].length) {
                                            f += newBoard[newX][newY] === -1;
                                        }
                                    }
                                }
                                //Failed
                                if (f !== newBoard[x2][y2]) {
                                    exit = true;
                                    break;
                                }
                            }
                        }
                        if (exit) {
                            break;
                        }
                    }
                    if (!exit) {
                        if (solved) {
                            console.log("yeet force multiple solutions");
                            solvedOn = null;
                        } else {
                            solvedOn = p.createVector(x, y);
                            solvedOn.add(p.createVector(xStart, yStart));
                        }
                        solved = true;
                        // break;
                    }
                    newBoard[x][y] = -2;
                }
               
            }
            if (solved) {
                // break;
            }
        }
        if (solvedOn !== null) {
            flagSquare(getIndexFromPosition(solvedOn));
        } else {
            console.log("It didn't solve smh");
        }
        flagsLeftTime = 0.3;
    }
    if (unfilledPositions.length !== 0 && n++ % (200 + add) === 0 && !oopsie) {
        add = Math.floor(Math.random() * 300 - 50);
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
                // if (!changed) {
                //     changed = exceptions.length !== countAdjacentUnsolvedSquares().length;
                // }
                revealSurroundings(index, exceptions);
            } catch (e) {
                userViewBoard = userViewCopy;
                fiftyFifties = fiftyFiftyCopy;
                oopsieIndex = index;
                sinceOopsie = 4800;
                oopsie = true;
                console.log("Surroudings");
                console.log(userViewBoard[c.x][c.y], board[c.x][c.y], exceptions, getAllAdjacentPositions(c), getAdjacentSquareNumbers(index));
                // debugger;
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
        else if (countAdjacentUnsolvedSquares(getPositionFromIndex(index)) === userViewBoard[c.x][c.y] - getSolvedFlagCount(index)) {
            var adjacents = getFreeAdjacentSquares(index);
            var fiftyFiftyCopy = fiftyFifties.map(v => v);
            var userViewCopy = userViewBoard.map(v => v.map(e => e));
            for (var adj of adjacents) {
                //Need to remove 50-50 smh
                flagSquare(getIndexFromPosition(adj));
                changed = true;
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