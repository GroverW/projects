class CardContainer extends HTMLElement { constructor() { super(); } }
class CardELement extends HTMLElement { constructor() { super(); } }
class CardFront extends HTMLElement { constructor() { super(); } }
class CardBack extends HTMLElement { constructor() { super(); } }
class ScoreCard extends HTMLElement { constructor() { super(); } }

customElements.define('card-container',CardContainer);
customElements.define('card-element',CardELement);
customElements.define('card-front',CardFront);
customElements.define('card-back',CardBack);
customElements.define('score-card',ScoreCard);

const NUM_CARDS = 24;

let start = document.querySelectorAll('.new_game_button');
let gameContainer = document.querySelector('#game_container');
let gameBoard = document.querySelector('#game_board');

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

        let newCardContainer = document.createElement('card-container');

        let newCard = document.createElement('card-element');
        newCard.id = `c-${i}`;

        let newCardFront = document.createElement('card-front');
        let newCardBack = document.createElement('card-back');

        newCard.appendChild(newCardFront);
        newCard.appendChild(newCardBack);
        newCardContainer.appendChild(newCard);
        gameBoard.appendChild(newCardContainer);
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
		cardSelector.toggleClass('flip');

		flipped = flipped ? false : true;
	}

	const createCardElement = () => {
		cardSelector.classList.add(`card_type${cardType}`);
    }
    
    const resetCard = () => {
        cardSelector.classList.remove(`card_type${cardType}`);

        if(flipped) flip();
    }

	return { getCardType, flip, createCardElement, resetCard }
}

const MemoryGame = (numCards, cardsPerType, gameType) => {
	let gameStatus = true;
	let matchedCards = [];
	let cardsRemaining = numCards;

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
	}

	const checkMatch = () => {
		if(matchedCards.length === cardsPerType) {
            gameType.updateScore();

			let matched = matchedCards.every(card => card.getCardType() === matchedCards[0].getCardType());		

			matched ? successfulMatch() : failedMatch();
		}

		return false;
	}

	const clearMatchedCards = () => {
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
		freezeGame();
	}

	const successfulMatch = () => {
		clearMatchedCards();

		cardsRemaining -= cardsPerType;

		if(gameType.getGameResult(cardsRemaining)) gameOver(gameType.getGameResult(cardsRemaining));
	}

	const failedMatch = () => {
		clearMatchedCards();
        
		gameType.getGameResult(cardsRemaining) ? gameOver(gameType.getGameResult(cardsRemaining)) : resetFailedMatch();
	}

	return { gameReady, addCard, checkMatch };
}


const MemoryGameEasy = (scoreCard) => {
	let currScore = 0;

	const setScore = () => {
		scoreCard.innerText = ('0' + currScore).slice(-2);
	}

	const updateScore = () => {
		currScore++;
		
		setScore();
	}

	const getGameResult = (cardsRemaining) => {
		return cardsRemaining === 0 ? 'win' : false;
	}

	return { setScore, updateScore, getGameResult };
}

const MemoryGameMedium = (scoreCard, numCards) => {
	let currScore = Math.ceil((numCards / 2) * 1.25);

	const setScore = () => {
		scoreCard.innerText = ('0' + currScore).slice(-2);
	}

	const updateScore = () => {
		currScore--;

		setScore();
	}

	const getGameResult = (cardsRemaining) => {
		if(cardsRemaining === 0) {
			return 'win';
		} else if(currScore === 0) {
			return 'lose';
		}

		return false;
	}

	return { setScore, updateScore, getGameResult };
}

const MemoryGameHard = (scoreCard, numCards, gameBoard) => {
	let currScore = Math.ceil((numCards / 2) * 1.25);
	let nextRotationIncrement = Math.ceil(numCards / 3);
	let nextRotation = numCards - nextRotationIncrement;
	let nextRotation = 90;

	const setScore = () => {
		scoreCard.innerText = ('0' + currScore).slice(-2);
	}

	const updateScore = () => {
		currScore--;
		
		scoreCard.innerText = ('0' + currScore).slice(-2);
		
		if(numCards === nextRotation && nextRotation > 0) {
			rotateBoard();

			nextRotation -= nextRotationIncrement;
		}
	}

	const rotateBoard = () => {
		gameBoard.style.transform(`rotate(${nextRotation}deg`);
		
		scoreCard.style.transform(`rotate(${-nextRotation}deg`);

		nextRotation += 90;
	}

	const getGameResult = (cardsRemaining) => {
		if(cardsRemaining === 0) {
			return 'win';
		} else if(currScore === 0) {
			return 'lose';
		}

		return false;
	}

	return { setScore, updateScore, getGameResult };
}