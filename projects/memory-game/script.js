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

let start = document.querySelectorAll('.new_game_button');
let board = document.querySelector('#game_container');

start.forEach(obj => obj.addEventListener('click',() => {
    let isOpen = board.classList.contains('slide_in');

    board.setAttribute('class', isOpen ? 'slide_out' : 'slide_in');
}));


cardArray = new Array(24).fill(null)

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
	
	cardSelector.addEventListener(‘click’,function(event) {
		event.stopPropagation();

		if(game.gameReady() && !flipped) {
			flip();
			game.addCard(this);
		}
	});

	const flip = () => {
		cardSelector.toggleClass(‘flipped’);

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
