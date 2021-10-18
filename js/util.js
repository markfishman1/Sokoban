function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];

            var cellClass = getClassName({ i: i, j: j })

            // TODO - change to short if statement
            if (currCell.type === FLOOR) cellClass += ' floor';
            else if (currCell.type === WALL) cellClass += ' wall';

            //TODO - Change To template string
            strHTML += '\t<td class="cell ' + cellClass +
                '"  onclick="moveTo(' + i + ',' + j + ')" >\n';

            // TODO - change to switch case statement
            if (currCell.gameElement === GAMER) {
                strHTML += GAMER_IMG;
            } else if (currCell.gameElement === BOX) {
                strHTML += BOX_IMG;
            } else if (currCell.type === TARGET) {
                strHTML += TARGET_IMG;
            }

            strHTML += '\t</td>\n';
        }
        strHTML += '</tr>\n';
    }

    // console.log('strHTML is:');
    // console.log(strHTML);
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

document.querySelector('.restart').addEventListener('click', function () {
    initGame();
    closeModal();
});
//Undo button
document.querySelector('.undo').addEventListener('click', function () {
    console.log(gMoves);
    console.log('Hey');
    var lastPos = gMoves.splice(gMoves.length - 2, 1);
    console.log(lastPos);
    console.log(lastPos[0].i, lastPos[0].j);
    gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
    renderCell(gGamerPos, '');
    //Add Player to new location

    gGamerPos.i = lastPos[0].i;
    gGamerPos.j = lastPos[0].j;
    gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
    renderCell(gGamerPos, GAMER_IMG);

});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is inclusive and the minimum is inclusive 
}