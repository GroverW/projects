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
const CARDS_PER_TYPE = 2;

let gameContainer = document.querySelector('#game_container');
let gameBoard = document.querySelector('#game_board');

const drawBoard = (() => {
    for(let i = 0; i < NUM_CARDS; i++) {
        if(i === Math.floor(NUM_CARDS / 2)) {
            let scoreCard = document.createElement('score-card');
            let score = document.createElement('div');
            let timerContainer = document.createElement('div');
            let timeCaption = document.createElement('div');
            let timeRemaining = document.createElement('div');
            timerContainer.id = 'timer_container';
            timeCaption.innerHTML = '&#9716;';
            score.id = 'score';
            timeCaption.classList.add('scoreCard_caption');
            timeRemaining.id = 'time';
            
            scoreCard.appendChild(score);
            timerContainer.appendChild(timeCaption);
            timerContainer.appendChild(timeRemaining);
            scoreCard.appendChild(timerContainer);
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

let score = document.querySelector('#score');
let timer = document.querySelector('#time');

const generateCardTypes = (numCards, cardsPerType) => {
	let type = 1;
	let cardTypes = [];

	for(let i = 1; i <= numCards; i++) {
		cardTypes.push(type);
		
		if(i % cardsPerType === 0) type++;
	}

	return cardTypes;
}

const shuffleCardTypes = (cardTypes) => {
    let count = cardTypes.length;

    while(count) {
        cardTypes.push(cardTypes.splice(Math.floor(Math.random() * count),1)[0]);
        count--;
    }

    return cardTypes;
}

const CardFactory = (cardID, cardType, game) => {
    let flipped = false;

    const cardSelector = document.querySelector(`#c-${cardID}`);
    
    const getCardType = () => cardType;
	
	cardSelector.addEventListener('click',function(event) {
		event.stopPropagation();

		if(game.gameReady() && !flipped) {
			flip();
			game.addCard(cardID);
		}
	});

	const flip = () => {
		cardSelector.classList.toggle('flip');

		flipped = flipped ? false : true;
    }
    
    const rotate = (degree) => {
        cardSelector.style.transform = `rotate(${degree}deg)`;
    }

	const createCardElement = () => {
		cardSelector.classList.add(`card_type${cardType}`);
    }
    
    const resetCard = (newCardType) => {
        cardSelector.classList.remove(`card_type${cardType}`);

        if(flipped) flip();

        cardType = newCardType;

        cardSelector.classList.add(`card_type${cardType}`);
    }

	return { getCardType, flip, rotate, createCardElement, resetCard }
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

	const addCard = (cardID) => {
        matchedCards.push(cardID);
        
        checkMatch();
	}

	const checkMatch = () => {
		if(matchedCards.length === cardsPerType) {
            freezeGame();

            gameType.updateScore();

			let matched = matchedCards.every(cardID => cardArray[cardID].getCardType() === cardArray[matchedCards[0]].getCardType());

			matched ? successfulMatch() : failedMatch();
		}
	}

	const clearMatchedCards = () => {
		matchedCards.length = 0;
	}

	const resetFailedMatch = () => {
		freezeGame();

		setTimeout(() => {
			matchedCards.forEach(cardID => cardArray[cardID].flip());
            continueGame();
            clearMatchedCards();
		},1000);
	}

	const gameOver = (result) => {
		freezeGame();
	}

	const successfulMatch = () => {
		cardsRemaining -= cardsPerType;

        if(gameType.getGameResult(cardsRemaining)) gameOver(gameType.getGameResult(cardsRemaining));
        
        clearMatchedCards();

        continueGame();
	}

	const failedMatch = () => {        
        gameType.getGameResult(cardsRemaining) ? gameOver(gameType.getGameResult(cardsRemaining)) : resetFailedMatch();
    }
    
    const resetGame = (newGameType) => {
        clearMatchedCards();
        
        cardsRemaining = numCards;
        gameType = newGameType;

        gameType.setScore();

        continueGame();
    }

	return { gameReady, addCard, checkMatch, resetGame };
}


const MemoryGameEasy = (score,timer) => {
	let currScore = 0;

	const setScoreCard = () => {
        score.innerText = ('0' + currScore).slice(-2);
        timer.innerText = '00';
	}

	const updateScore = () => {
		currScore++;
		
		setScoreCard();
	}

	const getGameResult = (cardsRemaining) => {
		return cardsRemaining === 0 ? 'win' : false;
	}

	return { setScore: setScoreCard, updateScore, getGameResult };
}

const MemoryGameMedium = (score, timer, numCards) => {
    let currScore = Math.ceil((numCards / 2) * 1.25);
    let timeRemaining = 60;

	const setScoreCard = () => {
        score.innerText = ('0' + currScore).slice(-2);
        timer.innerText = ('0' + timeRemaining).slice(-2);
    }
    
    const setTimer = () => {

    }

	const updateScore = () => {
		currScore--;

		setScoreCard();
	}

	const getGameResult = (cardsRemaining) => {
		if(cardsRemaining === 0) {
			return 'win';
		} else if(currScore === 0) {
			return 'lose';
		}

		return false;
	}

	return { setScore: setScoreCard, updateScore, getGameResult };
}

const MemoryGameHard = (scoreCard, numCards, gameBoard) => {
	let currScore = Math.ceil((numCards / 2) * 1.25);

	const setScore = () => {
		scoreCard.innerText = ('0' + currScore).slice(-2);
	}

	const updateScore = () => {
		currScore--;
		
		scoreCard.innerText = ('0' + currScore).slice(-2);
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

let newGameButtons = document.querySelectorAll('.new_game_button');
let cardArray = new Array(NUM_CARDS).fill(null);
let gameType = MemoryGameEasy(score, timer);
let game = MemoryGame(NUM_CARDS,CARDS_PER_TYPE,gameType);

gameType.setScore();

const initializeGame = (() => {
    let cardTypes = shuffleCardTypes(generateCardTypes(NUM_CARDS,CARDS_PER_TYPE));

    for(let i = 0; i < NUM_CARDS; i++) {
        let currCard = CardFactory(i,cardTypes[i],game);
        currCard.createCardElement();
        cardArray[i] = currCard;
    }
})();


newGameButtons.forEach(obj => obj.addEventListener('click',() => {
    let isOpen = gameContainer.classList.contains('slide_in');
    gameContainer.setAttribute('class', isOpen ? 'slide_out' : 'slide_in');

    let newGameType = false;

    if(obj.name === 'hard') {
        newGameType = MemoryGameHard(score,NUM_CARDS,gameBoard);
    } else if(obj.name === 'medium') {
        newGameType = MemoryGameMedium(score,timer,NUM_CARDS);
    } else if(obj.name === 'easy') {
        newGameType = MemoryGameEasy(score,timer);
    }

    if(newGameType) {
        game.resetGame(newGameType);
    
        let cardTypes = shuffleCardTypes(generateCardTypes(NUM_CARDS,CARDS_PER_TYPE));

        for(let i = 0; i < NUM_CARDS; i++) {
            cardArray[i].resetCard(cardTypes[i]);
        }
    }
}));