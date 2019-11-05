class EtchBoard {
    constructor(maxSize = 128) {
        this.penColor = {red: 0, green: 0, blue: 0,alpha: 1};
        this.board = {};
        this.boardSize = 0;
        this.maxSize = maxSize;
    }

    drawBoard(id,size,cellClass) {
        this.boardSize = Math.min(this.maxSize,size);

        let board = document.querySelector(id);
    
        board.innerText = "";
    
        board.style.gridTemplate = `repeat(${this.boardSize},1fr) / repeat(${this.boardSize},1fr)`;
    
        for(let r = 0; r < this.boardSize; r++) {
            for(let c = 0; c < this.boardSize; c++) {
                let boardCell = document.createElement('div');
                let cellID = `${r}_${c}`;

                boardCell.id = cellID;
                boardCell.classList.toggle(cellClass);

                this.setCellEvents(boardCell,cellID);

                board.appendChild(boardCell);
                
                this.board[cellID] = boardCell;
            }
            
        }
    }

    setCellEvents(cell,id) {
        cell.addEventListener('mouseover',(event) => {
            if(event.buttons === 1 || event.buttons === 3)
                this.setCellColor(id);
        });
        
        cell.addEventListener('mousedown',(event) => {
            this.setCellColor(id);
        });
    }

    setPenColor(red,green,blue,alpha) {
        this.penColor.red = red;
        this.penColor.green = green;
        this.penColor.blue = blue;
        this.penColor.alpha = alpha/100;
    }

    getPenColor(alpha = this.penColor.alpha) {
        return `rgba(${this.penColor.red},${this.penColor.green},${this.penColor.blue},${alpha})`;
    }

    setCellColor(id) {
        let coords = id.split('_');
        coords[0] = +coords[0];
        coords[1] = +coords[1];

        for(let row = Math.max(0,coords[0] - 1); row <= Math.min(coords[0] + 1,this.boardSize - 1); row++) {
            for(let col = Math.max(0,+coords[1] - 1); col <= Math.min(+coords[1] + 1, this.boardSize - 1); col++) {
                this.board[row+'_'+col].style.background = this.getPenColor(
                    Math.max(0,this.penColor.alpha * .75 ** (Math.abs(coords[0] - row) + Math.abs(coords[1] - col))) 
                );
            }
        }
    }
}


let board = new EtchBoard();
let boardID = '#board', defaultSize = 128, cellClass = 'board_cell';
let boardSettings = document.querySelector('#settings_form');
let boardSize = document.querySelector('#board_size');
let redVal = document.querySelector('#red_value');
let greenVal = document.querySelector('#green_value');
let blueVal = document.querySelector('#blue_value');
let alphaVal = document.querySelector('#alpha_value');
let colorPreview = document.querySelector('#color_preview');
let updateBoard = document.getElementById('update_board');
let resetSettings = document.getElementById('reset_settings');

board.drawBoard(boardID,defaultSize,cellClass);

boardSettings.addEventListener('input',() => {
    board.setPenColor(redVal.value,greenVal.value,blueVal.value,alphaVal.value);
    colorPreview.style.background = board.getPenColor();
});

boardSettings.addEventListener('submit',(event) => {
    event.preventDefault();
});

updateBoard.addEventListener('click',() => {
    board.drawBoard(boardID,boardSize.value,cellClass);
});

resetSettings.addEventListener('click',() => {
    redVal.value = 0;
    greenVal.value = 0;
    blueVal.value = 0;
    alphaVal.value = 100;
    board.setPenColor(redVal.value,greenVal.value,blueVal.value,alphaVal.value);
    colorPreview.style.background = board.getPenColor();
    board.drawBoard(boardID,boardSize.value,cellClass);
});


