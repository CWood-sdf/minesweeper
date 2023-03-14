var board = undefined;
var userViewBoard = undefined;
var revealedSquares = {};

var getStr = function (v) {
    return v.x + ", " + v.y;
};
function generateBoard(baseIndex) {
    board = [];
    userViewBoard = [];
    for(var x = 0; x < BOARD_SIZE; x++){
        board.push([]);
        userViewBoard.push([]);
        for(var y = 0; y < BOARD_SIZE; y++){
            board[x].push(-2);
            userViewBoard[x].push(-2);
        }
    }
    // console.log(board);
    //The probablilty that the square won't be a flag
    var chance = 1.3;
    var position = getPositionFromIndex(baseIndex);
    board[position.x][position.y] = 0;
    var positionsFilled = {};
    positionsFilled[getStr(position)] = true;
    var currentPositions = [position];
    // console.log(currentPositions);
    // console.log(board);
    while(Math.random() < chance){
        chance *= 0.7;
        var l = currentPositions.length;
        var currentPositionsCopy = [];
        for(var i of currentPositions){
            currentPositionsCopy.push(i.copy());
        }
        for(let pos of currentPositionsCopy){
            var adjacents = getAllAdjacentPositions(pos);
            for(var adj of adjacents){
                if(!positionsFilled[getStr(adj)]){
                    positionsFilled[getStr(adj)] = true;
                    currentPositions.push(adj);
                }
            }
        }
        var inc = currentPositions.length - l;
        // console.log(l, currentPositions.length, inc);
    }
    
    for(var pos of currentPositions){
        board[pos.x][pos.y] = 0;
    }
    // console.log(currentPositions);
    // console.log(board);
    for(var flags = 350; flags >= 0; flags--){
        var pos;
        var allFilled = false;
        do {
            pos = p.createVector(Math.floor(Math.random() * BOARD_SIZE), Math.floor(Math.random() * BOARD_SIZE));
            var adj = getAllAdjacentPositions(pos);
            allFilled = 0;
            for(var pos of adj){
                allFilled += board[pos.x][pos.y] === -1;
            }
            allFilled = allFilled === adj.length;
        } while(positionsFilled[getStr(pos)] || allFilled);
        board[pos.x][pos.y] = -1;
        positionsFilled[getStr(pos)] = true;
    }
    for(var x = 0; x < BOARD_SIZE; x++){
        for(var y = 0; y < BOARD_SIZE; y++){
            var pos = p.createVector(x, y);
            if(board[x][y] === -1){
                continue;
            }
            var adjs = getAllAdjacentPositions(pos);
            var c = 0;
            for(var adj of adjs){
                if(board[adj.x][adj.y] === -1){
                    c++;
                }
            }
            board[pos.x][pos.y] = c;
        }
    }
}
function getAllAdjacentPositions(position){
    var arr = [];
    for(var x = -1; x <= 1; x++){
        for(var y = -1; y <= 1; y++){
            if(x === 0 && y === 0){
                continue;
            }
            if(position.x + x < 0 || position.y + y < 0 || position.x + x >= BOARD_SIZE || position.y + y >= BOARD_SIZE){
                continue;
            }
            arr.push(p.createVector(position.x + x, position.y + y));
        }
    }
    return arr;
}
function getAdjacentUserFlagCount(index) {
    var adjacents = getAllAdjacentPositions(getPositionFromIndex(index));
    var ret = 0;
    for (var adj of adjacents) {
        ret += userViewBoard[adj.x][adj.y] === -1;
    }
    return ret;
}
function getPositionFromIndex(index) {
    return p.createVector(index % BOARD_SIZE, (index - index % BOARD_SIZE) / BOARD_SIZE);
}
function getIndexFromPosition(position) {
    return position.x + position.y * BOARD_SIZE;
}
function setButtonAndUserView(el) {
    userViewBoard[el.x][el.y] = board[el.x][el.y];
    if (board[el.x][el.y] === -1) {
        debugger;
        throw "eggleflebb";
    }
    if(board[el.x][el.y] === 0){
        buttons[getIndexFromPosition(p.createVector(el.x, el.y))].msg = "";
        buttons[getIndexFromPosition(p.createVector(el.x, el.y))].inner = p.color(150);
    } else {
        buttons[getIndexFromPosition(p.createVector(el.x, el.y))].msg = board[el.x][el.y];
    }
}
function flagSquare(index) {
    var position = getPositionFromIndex(index);
    revealedSquares[getStr(position)] = true;
    userViewBoard[position.x][position.y] = -1;
    buttons[index].msg = "F";
}
function revealSurroundings(index, exceptions) {
    if (IS_SOLVING) {
        unfilledPositions.splice(unfilledPositions.findIndex(e => getIndexFromPosition(e) === index), 1);
    }
    var pos = getPositionFromIndex(index);
    var adjs = getAllAdjacentPositions(pos);
    var count = userViewBoard[pos.x][pos.y] - getAdjacentUserFlagCount(index);
    if (count === 0 || exceptions !== undefined) {
        // exceptions = exceptions ?? [];
        if (exceptions === undefined) {
            exceptions = [];
        }
        for (const adj of adjs) {
            if (!revealedSquares[getStr(adj)] && exceptions.findIndex(e => getIndexFromPosition(e) === getIndexFromPosition(adj)) === -1) {
                revealSquare(getIndexFromPosition(adj));
            }
        }
    }
}
function revealSquare(index) {
    if (board === undefined) {
        generateBoard(index);
    }
    var position = getPositionFromIndex(index);
    revealedSquares[getStr(position)] = true;
    var queue = [position];
    while (queue.length !== 0) {
        var el = queue.shift();
        setButtonAndUserView(el);
        unfilledPositions.push(el);
        if (board[el.x][el.y] === 0) {
            var adjs = getAllAdjacentPositions(el);
            for (const adj of adjs) {
                if (!revealedSquares[getStr(adj)]) {
                    queue.push(adj);
                    revealedSquares[getStr(adj)] = true;
                    if (IS_SOLVING) {
                    }
                }
            }
        }
    }
    // for(var i = 0; i < board.length; i++){
    //     for(var y = 0; y < board[i].length; y++){
    //         if(board[i][y] === 0){
    //             buttons[getIndexFromPosition(p.createVector(i, y))].msg = "";
    //         } else {
    //             buttons[getIndexFromPosition(p.createVector(i, y))].msg = board[i][y];
    //         }
    //     }
    // }
}