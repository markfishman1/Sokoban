var WALL = 'WALL';
var FLOOR = 'FLOOR';
var TARGET = 'TARGET';
var GAMER = 'GAMER';
var BOX = 'BOX';
//Bonuses
var GOLD = 'GOLD';
var CLOCK = 'CLOCK';
var MAGNET = 'MAGNET';
//Obstacles
var GLUE = 'GLUE';
var WATER = 'WATER';


var GAMER_IMG = '<img src="img/player.png" />';
var BOX_IMG = '<img src="img/box.png" />';
var TARGET_IMG = '<img src="img/mark.png" />';
var GOLD_IMG = '<img src="img/gold.png" />';
var CLOCK_IMG = '<img src="img/clock.png" />';
var MAGNET_IMG = '<img src="img/magnet.png" />';
var WATER_IMG = '<img src="img/water.png" />';
var GLUE_IMG = '<img src="img/glue.png" />';


var gGameIsOn;
var gDeliveredBoxes;
var freeClockMoves = 10;
var gSteps;
var gBoard;
var gGamerPos;
var addBonuses;
var addObstacles;
var gFeatures = { isGlue: false, isWater: false, isMagnet: false, isClock: false };
var gMoves = [];
// var gWaterPos = { i: 2, j: 4 }

function initGame() {
    gGamerPos = { i: 2, j: 2 };
    gBoard = createBoard()
    console.table(gBoard);
    renderBoard(gBoard);
    addBonuses = setInterval(addBonus, 10000);
    addObstacles = setInterval(addObstacle, 6000);
    gGameIsOn = true;
    gSteps = 100;
    gDeliveredBoxes = 0;
}

function createBoard() {
    // Create the Matrix
    var board = createMat(9, 8);
    // Put FLOOR everywhere and WALL at edges
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            // Put FLOOR in a regular cell
            var cell = { type: FLOOR, gameElement: null };

            // Place Walls at edges
            if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1 || j === board[0].length - 2 && i !== board.length - 2) {
                cell.type = WALL;
            }
            else {
                cell.type = FLOOR;
            }

            board[i][j] = cell;
            // Add created cell to The game board
        }
    }
    //Place Walls in middle of the board
    board[1][1].type = WALL;
    board[1][2].type = WALL;
    board[3][1].type = WALL;
    board[3][2].type = WALL;
    board[4][2].type = WALL;
    board[4][3].type = WALL;
    board[5][2].type = WALL;
    //Place Targets:
    board[2][1].type = TARGET;
    board[4][1].type = TARGET;
    board[6][6].type = TARGET;
    // Place the gamer at selected position
    board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
    // Place the Box's 
    board[2][3].gameElement = BOX;
    board[6][1].gameElement = BOX;
    board[3][4].gameElement = BOX;

    // console.table(board);
    return board;

}
function addBonus() {

    var emptyCells = getEmptyCells(gBoard);
    var emptyCell = drawCell(emptyCells);
    var num = Math.random();
    console.log(num);
    if (num < 0.33) {
        gBoard[emptyCell.i][emptyCell.j].gameElement = GOLD;
        renderCell(emptyCell, GOLD_IMG);
        removeBonusOrObstacle(emptyCell.i, emptyCell.j)
    } else if (num > 0.33 && num < 0.66) {
        gBoard[emptyCell.i][emptyCell.j].gameElement = MAGNET;
        renderCell(emptyCell, MAGNET_IMG);
        removeBonusOrObstacle(emptyCell.i, emptyCell.j)

    } else if (num > 0.66) {
        gBoard[emptyCell.i][emptyCell.j].gameElement = CLOCK;
        renderCell(emptyCell, CLOCK_IMG);
        removeBonusOrObstacle(emptyCell.i, emptyCell.j)
    }
}
function removeBonusOrObstacle(i, j) {
    setTimeout(function () {
        if (gBoard[i][j].gameElement !== GAMER) {
            gBoard[i][j].gameElement === null;
            cell = { i, j }
            renderCell(cell, '');
        }
    }, 5000)
}

function addObstacle() {
    // var emptyCell = { i: 4, j: 4 };

    var emptyCells = getEmptyCells(gBoard);
    var emptyCell = drawCell(emptyCells);
    console.log(emptyCell);
    var num = Math.random();
    if (num > 0.5) {
        gBoard[emptyCell.i][emptyCell.j].gameElement = WATER;
        renderCell(emptyCell, WATER_IMG);
        removeBonusOrObstacle(emptyCell.i, emptyCell.j)
        console.log(gBoard);

    } else {
        gBoard[emptyCell.i][emptyCell.j].gameElement = GLUE;
        renderCell(emptyCell, GLUE_IMG);
        removeBonusOrObstacle(emptyCell.i, emptyCell.j)

    }
    // var obstacle = (Math.random() > 0.5) ? WATER : GLUE;
    // gBoard[emptyCell.i][emptyCell.j].gameElement === obstacle;
    // renderCell(emptyCell, img);

}
function clearIntervals() {
    clearInterval(addBonuses);
    clearInterval(addObstacles);
}
function checkGameOver() {
    if (gDeliveredBoxes === 3) {
        openGameOverModal('You Have Won😁');
        clearIntervals();
    } else if (gSteps === 0) {
        openGameOverModal('You Have Lost😓');
        clearIntervals();
    }

}
function openGameOverModal(str) {
    gGameIsOn = false;
    var elModal = document.querySelector('.modal');
    elModal.innerHTML = str;
    elModal.style.display = "block";
}
function closeModal() {
    var elModal = document.querySelector('.modal');
    elModal.style.display = "none";

}

function drawCell(arr) {
    var idx = getRandomInt(0, arr.length);
    var cell = arr[idx];
    arr.splice(idx, 1);
    return cell;
}

function getEmptyCells(board) {
    var arr = [];
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            if (cell.type === FLOOR && cell.gameElement === null) {
                arr.push({ i, j });
            }
        }
    }
    return arr
}

function moveTo(i, j) {
    var targetCell = gBoard[i][j];
    var playerPosition = { i: i, j: j };

    if (!gFeatures.isClock) {
        updateScore(targetCell);
    }
    if (targetCell.type === WALL) {
        return;
    }
    if (targetCell.gameElement === BOX) {
        var boxCell = gBoard[playerPosition.i][playerPosition.j];
        if (boxCell.type === TARGET) {
            gDeliveredBoxes++;
            console.log(gDeliveredBoxes);
        }
        if (j === gGamerPos.j + 1) {
            if (gBoard[playerPosition.i][playerPosition.j + 1].type === WALL || gBoard[playerPosition.i][playerPosition.j + 1].gameElement === BOX) {
                console.log('Cant do');
                gSteps++;
                return;
            }
            // if (gBoard[playerPosition.i][playerPosition.j + 1].gameElement === WATER) {
            //     while (gBoard[playerPosition.i][playerPosition.j + 1].type !== WALL) {
            //         console.log('Hi');
            //         gBoard[playerPosition.i][playerPosition.j + 1].gameElement = null;
            //         renderCell(playerPosition, '');
            //         gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
            //         renderCell(gGamerPos, '');
            //         playerPosition.j += 1;
            //         gGamerPos.j += 1;
            //         gBoard[playerPosition.i][playerPosition.j].gameElement = BOX;
            //         renderCell(playerPosition, BOX_IMG);
            //     }


            // }
            playerPosition.j += 1;
            gBoard[playerPosition.i][playerPosition.j].gameElement = BOX;
            renderCell(playerPosition, BOX_IMG);


            // console.log(boxPosition);


        } else if (j === gGamerPos.j - 1) {
            if (gBoard[playerPosition.i][playerPosition.j - 1].type === WALL || gBoard[playerPosition.i][playerPosition.j - 1].gameElement === BOX) {
                gSteps++;
                return;
            }
            playerPosition.j -= 1;
            gBoard[playerPosition.i][playerPosition.j].gameElement = BOX;
            renderCell(playerPosition, BOX_IMG);
        } else if (i === gGamerPos.i - 1) {
            if (gBoard[playerPosition.i - 1][playerPosition.j].type === WALL || gBoard[playerPosition.i - 1][playerPosition.j].gameElement === BOX) {
                gSteps++;
                return;
            }
            // if (gBoard[playerPosition.i - 1][playerPosition.j].gameElement === WATER) {
            //     while (gBoard[playerPosition.i - 1][playerPosition].type !== WALL) {
            //         console.log('Hi');
            //         gBoard[playerPosition.i][playerPosition.j].gameElement = null;
            //         renderCell(playerPosition, '');
            //         gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
            //         renderCell(gGamerPos, '');
            //         playerPosition.i -= 1;
            //         gGamerPos.i -= 1;
            //         gBoard[playerPosition.i][playerPosition.j].gameElement = BOX;
            //         renderCell(playerPosition, BOX_IMG);
            //     }
            // }
            playerPosition.i -= 1;
            gBoard[playerPosition.i][playerPosition.j].gameElement = BOX;
            renderCell(playerPosition, BOX_IMG);
        } else if (i === gGamerPos.i + 1) {
            if (gBoard[playerPosition.i + 1][playerPosition.j].type === WALL || gBoard[playerPosition.i + 1][playerPosition.j].gameElement === BOX) {
                gSteps++;
                return;
            }
            // } if (gBoard[playerPosition.i + 1][playerPosition.j].gameElement === WATER) {
            //     console.log('Box On water');
            //     while (gBoard[playerPosition.i + 1][playerPosition.j].gameElement !== WALL) {
            //         console.log('hi');
            //         gBoard[playerPosition.i][playerPosition.j].gameElement = null;
            //         renderCell(playerPosition, '');
            //         gGamerPos.i = i;
            //         playerPosition.i = i;
            //         gBoard[playerPosition.i][playerPosition.j].gameElement = BOX;
            //         renderCell(playerPosition, BOX_IMG);

            //     }

            // }

            playerPosition.i += 1;
            gBoard[playerPosition.i][playerPosition.j].gameElement = BOX;
            renderCell(playerPosition, BOX_IMG);
        }
        var boxCell = gBoard[playerPosition.i][playerPosition.j];
        if (boxCell.type === TARGET) {
            gDeliveredBoxes++;
            console.log(gDeliveredBoxes);
        }

    }

    //Glue Condition
    if (targetCell.gameElement === GLUE) {
        gFeatures.isGlue = true;
        gSteps -= 5;
        setTimeout(function () { gFeatures.isGlue = false }, 5000);
    }
    //Gold Condition
    if (targetCell.gameElement === GOLD) {
        console.log('Player on gold');
        gSteps += 100;
    }
    //Clock Condition
    if (gFeatures.isClock) {
        freeClockMoves--;
        console.log(freeClockMoves);
    }
    if (targetCell.gameElement === CLOCK) {
        console.log('player on clock');
        gFeatures.isClock = true;
    }

    if (freeClockMoves <= 1) {
        gFeatures.isClock = false;
        freeClockMoves = 10;
    }
    //Magnet Condition
    if (targetCell.gameElement === MAGNET) {
        gFeatures.isMagnet = true;
        console.log('player on magnet', gFeatures)
    }
    if (targetCell.gameElement === BOX && gFeatures.isMagnet) {
        console.log('BOX ON WALL AND MAGNET ON');
        if (j === playerPosition.j - 1) {
            console.log('cant do');

        }
    }
    // if (gFeatures.isMagnet) {
    //     var boxes = showBoxesAround(gBoard, i, j);
    //     for (var z = 0; z < boxes.length; z++) {
    //         if (boxes[z].i !== i) {
    //             boxes.splice(z, 1);
    //             console.log(boxes);
    //             if (j === boxPosition.j - 1) {
    //                 boxPosition.j = boxes[0].j - 1;
    //                 gBoard[boxPosition.i][boxPosition.j].gameElement = BOX;
    //                 renderCell(boxPosition, BOX_IMG);

    //             }
    //         }
    //     }
    // }
    //Water Condition
    // if (gBoard[boxPosition.i][boxPosition.j + 1].gameElement === WATER) {
    //     console.log('BOX ON WATER');
    //     while (gBoard[boxPosition.i][boxPosition.j].type === WALL || gBoard[boxPosition.i][boxPosition.j].gameElement === BOX) {
    //         boxPosition.j += 1;
    //         gGamerPos.j = gGamerPos.j + 1;

    //     }
    // }
    // var boxPositionRight = gBoard[boxPosition.i][boxPosition.j];
    // // console.log(gBoard[boxPosition.i][boxPosition.j + 1].gameElement);
    // if (boxPositionRight.gameElement === WATER) {
    //     console.log('Box on WATER');
    //     while (gBoard[boxPosition.i][boxPosition.j + 1].gameElement !== WALL) {
    //         boxPosition.j += 1;
    //         targetCell.j += 1;
    //     }

    // }


    var elScore = document.querySelector('span');
    elScore.innerHTML = gSteps;
    // console.log('Score count:', gSteps);


    //Removes Player from previous location
    //Model;
    gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
    // Dom:
    renderCell(gGamerPos, '');
    //Add Player to new location
    //Model
    gGamerPos.i = i;
    gGamerPos.j = j;
    gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
    renderCell(gGamerPos, GAMER_IMG);
    checkGameOver();
    gMoves.push({ i: gGamerPos.i, j: gGamerPos.j });
    // var elCell = document.querySelector(`.cell-${gGamerPos.i}-${gGamerPos.j}`);
    // elCell.style

}

function updateScore(cell) {
    gSteps--;
    if (cell.type === WALL) {
        gSteps++;
    }

}


function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector);
    elCell.innerHTML = value;
}

function handleKey(event) {
    if (gGameIsOn && !gFeatures.isGlue) {
        var i = gGamerPos.i;
        var j = gGamerPos.j;

        switch (event.key) {
            case 'ArrowLeft':
                moveTo(i, j - 1);
                break;
            case 'ArrowRight':
                moveTo(i, j + 1);
                break;
            case 'ArrowUp':
                moveTo(i - 1, j);
                break;
            case 'ArrowDown':
                moveTo(i + 1, j);
                break;

        }
        // if (event.code === 'Space' && gFeatures.isMagnet) {
        //     var boxes = showBoxesAround(gBoard, gGamerPos.i, gGamerPos.j);
        //     console.log(boxes);
        //     for (var i = 0; i < boxes.length; i++) {
        //         if (boxes[i].i !== i) {
        //             boxes.splice(i, 1);
        //             console.log(boxes);
        //         }
        //         if (event.code === 'ArrowLeft') {
        //             moveTo(i, j - 1);
        //             magnets[0].j -= 1;
        //             gBoard[magnets[0].i][magnets[0].j].gameElement = BOX;
        //             renderCell(boxPosition, BOX_IMG);

        //         }
        // magnets[i].j += 1;
        // gBoard[boxPosition.i][boxPosition.j].gameElement = BOX;
        // renderCell(boxPosition, BOX_IMG);

    }
}

function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}

function showBoxesAround(board, rowIdx, colIdx) {
    var arr = [];
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue;
            if (i === rowIdx && j === colIdx) continue;
            var cell = board[i][j];
            if (cell.gameElement === BOX) {
                cell = { i: i, j: j };
                arr.push(cell);
            }
        }
    }
    return arr;
}
