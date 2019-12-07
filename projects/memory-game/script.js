class MemCard extends HTMLElement {
    constructor() {
        super();
    }
}

class ScoreCard extends HTMLElement {
    constructor() {
        super();
    }
}

customElements.define('mem-card',MemCard);
customElements.define('score-card',ScoreCard);

let start = document.querySelector('#start');
let stop = document.querySelector('#stop');
let board = document.querySelector('#game_container');

start.addEventListener('click',() => {
    let isOpen = board.classList.contains('slide_in');
    console.log(isOpen);
    let currClass = isOpen ? 'slide_out' : 'slide_in';

    board.setAttribute('class', currClass);
})


let closureTest = () => {
	let gameReady = true;

	const getGameState = () => gameReady;
	
	const freezeGame = () => {
		gameReady = false;
	}

	return {freezeGame, getGameState};
}

let closureTest2 = (game) => {
	const checkGameState = () => game.getGameState();

	return {checkGameState};
}

let letsTest = closureTest();
let letsTest2 = closureTest2(letsTest);
console.log(letsTest2.checkGameState());
letsTest.freezeGame();
console.log(letsTest.getGameState());
console.log(letsTest2.checkGameState());