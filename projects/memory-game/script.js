class MemCard extends HTMLElement {
    constructor() {
        super();
    }
}

class MemCardInner extends HTMLElement {
    constructor() {
        super();
    }
}

class MemCardFront extends HTMLElement {
    constructor() {
        super();
    }
}

class MemCardBack extends HTMLElement {
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
customElements.define('card-inner-container',MemCardInner);
customElements.define('card-front',MemCardFront);
customElements.define('card-back',MemCardBack);
customElements.define('score-card',ScoreCard);

const NUM_CARDS = 24;

let start = document.querySelectorAll('.new_game_button');
let gameContainer = document.querySelector('#game_container');
let gameBoard = document.querySelector('#memory_board');

start.forEach(obj => obj.addEventListener('click',() => {
    let isOpen = gameContainer.classList.contains('slide_in');

    gameContainer.setAttribute('class', isOpen ? 'slide_out' : 'slide_in');
}));

cardArray = new Array(NUM_CARDS).fill(null)

const drawBoard = (() => {
    for(let i = 0; i < NUM_CARDS; i++) {
        if(i === Math.floor(NUM_CARDS / 2)) {
            let scoreCard = document.createElement('score-card');
            scoreCard.id = 'score';
            gameBoard.appendChild(scoreCard);
        }

        let newCard = document.createElement('mem-card');
        newCard.id = `c-${i}`;

        let newCardInner = document.createElement('card-inner-container');
        let newCardFront = document.createElement('card-front');
        let newCardBack = document.createElement('card-back');

        newCardInner.appendChild(newCardFront);
        newCardInner.appendChild(newCardBack);
        newCard.appendChild(newCardInner);
        gameBoard.appendChild(newCard);
    }
})();

const generateCardTypes = (numCards, cardsPerType) => {
	let type = 1;
	let cardTypes = [];

	for(let i = 1; i <= numCards; i++) {
		cardTypes.push(type);
		
		if(i % cardsPerType === 0) type++;
	}

	return cardTypes;
}

const CardFactory = (cardID, cardType, game) => {
	let flipped = false;

	const getCardType = () => cardType;

	const cardSelector = document.querySelector(`#c-${cardID}`);
	
	cardSelector.addEventListener('click',function(event) {
		event.stopPropagation();

		if(game.gameReady() && !flipped) {
			flip();
			game.addCard(this);
		}
	});

	const flip = () => {
		cardSelector.toggleClass('flipped');

		flipped = flipped ? false : true;
	}

	const createCardElement = () => {
		cardSelector.classList.add(`card_type${cardType}`);
	}

	return {getCardType, flip, createCardElement}
}

const MemoryGame = (numCards, cardsPerType, gameType) => {
	let gameStatus = true;
	let matchedCards = [];
	let remainingCards = numCards;

	const gameReady = () => {
		return gameStatus;
	}

	const freezeGame = () => {
		gameStatus = false;
	}

	const continueGame = () => {
		gameStatus = true;
	}

	const addCard = (card) => {
		matchedCards.push(card);

		gameType.updateScore();
	}

	const checkMatch = () => {
		if(matchedCards.length === cardsPerType) {
			let matched = matchedCards.every(card => card.getCardType() === matchedCards[0].getCardType());		

			matched ? successfulMatch() : failedMatch();
		}

		return false;
	}

	const resetMatchedCards = () => {
		matchedCards.length = 0;
	}

	const resetFailedMatch = () => {
		freezeGame();

		setTimeout(() => {
			matchedCards.forEach(card => card.flip());
			continueGame();
		},750);
		
	}

	const gameOver = (result) => {
		
	}

	const successfulMatch = () => {
		resetMatchedCards();

		remainingCards -= cardsPerType;

		let isGameComplete = gameType.checkGameStatus(remainingCards)

		if(isGameComplete) {
			gameOver(gameType.getGameResult());
		}
	}

	const failedMatch = () => {
		resetMatchedCards();

		let isGameComplete = gameType.checkGameStatus(remainingCards);
		
		isGameComplete ? gameOver(gameType.getGameResult()) : resetFailedMatch();
	}

	return {gameReady, addCard, checkMatch};
}
