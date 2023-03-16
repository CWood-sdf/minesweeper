let p;
let height;
const BOARD_SIZE = 48;
let buttons;
const s = pi => {
    p = pi;

    pi.setup = function () {
        pi.createCanvas(p.windowWidth, p.windowHeight);
        $("canvas").contextmenu(e => {
            e.preventDefault();

        });
    };
    height = p.windowHeight / 100;
    buttons = [];
    for (var x = 0; x < BOARD_SIZE; x++) {
        for (var y = 0; y < BOARD_SIZE; y++) {
            buttons.push(new Button(x * 100 / BOARD_SIZE + 2, y * 100 / BOARD_SIZE, 100 / BOARD_SIZE, 100 / BOARD_SIZE, p.color(0), p.color(100), p.color(80), p.color(60), "", 0.5, 1.5));
        }
    }
    var i = 0;
    pi.draw = function () {
        p.background(0);
        // debugger;
        for (var i = 0; i < buttons.length; i++) {
            const btn = buttons[i];
            btn.draw();
            btn.handlePress();
            var isDone = btn.isDone();
            if (isDone && p.keyIsPressed && p.key === 'k') {
                checks.push(i);
            }
            else if (isDone && p.keyIsPressed && p.key === 'a') {
                console.log(i, unfilledPositions.findIndex(e => getIndexFromPosition(e) === i));
            }
            else if(isDone && p.mouseButton === p.LEFT){
                revealSquare(i);
            } else if (isDone && p.mouseButton === p.RIGHT) {
                flagSquare(i);
            } else if (isDone && p.mouseButton === p.CENTER) {
                revealSurroundings(i);
            }
            if (i > 5) {
                solveBoard();
            }
        }
        i++;
        for (var i = 0; i < BOARD_SIZE; i++) {
            p.fill(p.color(255));
            p.text(i, 2.5 * height, (i * 100 / BOARD_SIZE + 1.5) * height);
            if (i !== 0) {
                p.text(i, (i * 100 / BOARD_SIZE + 2.5) * height, 1.5 * height);
            }
        }
    };
};