class Game {
    constructor(numRounds,rules) {
        this.numRounds = numRounds;
        this.rules = rules;
        this.lastPlayerResult = '';
        this.lastComputerResult = '';
        this.playerScore = 0;
        this.computerScore = 0;
        this.gameState = true;
    }

    gameOver() {
        return Math.max(this.playerScore,this.computerScore) >= Math.ceil(this.numRounds / 2);
    }

    updatePlayerScores(playerResult,computerResult) {
        this.playerScore += this.rules.resultScores[playerResult];
        this.computerScore += this.rules.resultScores[computerResult];
    }

    playRound(playerSelection,computerSelection) {
        this.lastPlayerResult = this.rules[playerSelection][computerSelection];
        this.lastComputerResult = this.rules[computerSelection][playerSelection];

        this.updatePlayerScores(this.lastPlayerResult,this.lastComputerResult);

        return this.lastPlayerResult;
    }

    getPlayerScore() {
        return this.playerScore;
    }

    getComputerScore() {
        return this.computerScore;
    }

    getLastResult() {
        return this.lastPlayerResult;
    }

    getGameResult(win,lose,tie) {
        if(this.playerScore > this.computerScore) return {player: win,computer: lose};
        if(this.playerScore < this.computerScore) return {player: lose,computer: win};
        if(this.playerScore === this.computerScore) return {player: tie,computer: tie};
    }

    changeGameState() {
        this.gameState = this.gameState === true ? false : true;
    }

    gameReady() {
        return this.gameState;
    }

    reset() {
        this.playerScore = 0;
        this.computerScore = 0;
    }
}



class PlayerDecision {
    constructor(...options) {
        this.options = options;
        this.saveDecision = false;
        this.lastDecision = false;
        this.computerDecision = false;
    }

    closestSelection(selection = '') {
        let closest = false, bestScore = Infinity;
    
        this.saveLastDecision();

        for(let option of this.options) {
            let minTransform = option.length - 1;
            let score = this.transformCost(selection,option);

            if(score < minTransform && score < bestScore) {
                closest = option;
                bestScore = score;
            }
        }
        
        if(closest) this.saveDecision = closest;

        return closest;
    }

    transformCost(from,to) {
        from = from.toLowerCase();
        let costTable = this.buildCostTable(from,to);
        let sum = this.sumTransformCost(costTable,from,to);

        return sum;
    }

    buildCostTable(from,to) {
        let costTable = new Array(to.length + 1)
                            .fill(null)
                            .map(() => new Array(from.length + 1)
                                            .fill(null));
    
        for(let i = 0; i <= from.length; i++) costTable[0][i] = i;
        for(let j = 0; j <= to.length; j++) costTable[j][0] = j;

        return costTable;
    }

    sumTransformCost(costTable,from,to) {
        for(let r = 1; r <= to.length; r++) {
            for(let c = 1; c <= from.length; c++) {
                let sameVal = to[r-1] === from[c-1] ? 0 : 1;

                costTable[r][c] = Math.min(
                    costTable[r][c-1] + 1,
                    costTable[r-1][c] + 1,
                    costTable[r-1][c-1] + sameVal
                );
            }
        }

        return costTable[to.length][from.length];
    }

    saveLastDecision() {
        this.lastDecision = this.saveDecision;
    }

    getLastDecision() {
        return this.lastDecision;
    }

    getDecision() {
        return this.saveDecision;
    }

    decisionChange() {
        return this.saveDecision && this.saveDecision !== this.lastDecision;
    }

    computerPlay() {
        //this.computerDecision = this.options[Math.floor(Math.random() * this.options.length)];
        this.computerDecision = 'paper';
    }

    getComputerDecision() {
        return this.computerDecision;
    }

    getOptions() {
        return this.options;
    }

    reset() {
        this.saveDecision = false;
        this.lastDecision = false;
    }
}

class GameDisplay {
    constructor(playerID,computerID) {
        this.selectors = {};
        this.lastPlaybutton = false;
        this.playerID = playerID;
        this.computerID = computerID;
    }

    toggleSelected(id,...selectedClass) {
        this.updateSelectors(id);
            
        for(let c of selectedClass) {
            this.selectors[id].classList.toggle(c);
        }
    }

    toggleAttribute(id,attribute,value = '') {
        this.updateSelectors(id);

        if(this.selectors[id][attribute] === value) {
            this.selectors[id][attribute] = this.selectors[id]['old'+attribute];
        } else {
            this.selectors[id][attribute] = value;
        }
    }

    updateSelectors(id) {
        if(!(id in this.selectors)) {
            if(id[0] === '#' || id[0] === '.') {
                this.selectors[id] = document.querySelector(id);
            } else {
                this.selectors[id] = document.getElementById(id);
            }

            this.selectors[id]['oldinnerText'] = this.selectors[id].innerText;
        }
    }

    showComputerSelection(selection) {
        this.toggleSelected(this.computerID,'player_turn');
        this.toggleAttribute(this.computerID,'innerText');
        this.toggleSelected(this.computerID,selection);
        this.toggleSelected(this.computerID,'selected');
    }

    toggleWinner(result,resultsText) {
        this.toggleSelected(this.playerID,resultsText[result].player);
        this.toggleResultText(this.selectors[this.playerID],resultsText[result].player);
        this.toggleSelected(this.computerID,resultsText[result].computer);
        this.toggleResultText(this.selectors[this.computerID],resultsText[result].computer);
    }

    toggleResultText(selector,result) {
        if(selector.hasChildNodes()) {
            selector.removeChild(selector.firstChild);
        } else {
            let element = document.createElement('div');
            element.id = result+'_text';
            element.innerText = result[0].toUpperCase() + result.slice(1)+'!';
            selector.appendChild(element);
        }
    }

    updatePlayerScores(playerScore,computerScore) {
        this.toggleAttribute('#player_score','innerText',playerScore);
        this.toggleAttribute('#computer_score','innerText',computerScore);
    }

    togglePlayButton(playButton,toggleText,toggleClass) {
        this.updateSelectors(playButton);
        this.toggleAttribute(playButton,'innerText',toggleText);
        
        if(this.lastPlayButton && this.lastPlayButton !== toggleClass) {
            this.selectors[playButton].classList.toggle(this.lastPlayButton);
        }

        this.selectors[playButton].classList.toggle(toggleClass);
        this.lastPlayButton = toggleClass;
    }

    toggleRandomResultMessage(selector,result,messages) {
        this.updateSelectors(selector);
        
        let message = Math.floor(Math.random() * messages[result].length);

        this.toggleAttribute(selector,'innerText',messages[result][message]);
    }
}

let win = 'win', lose = 'lose', tie = 'tie';
let rules = {
    resultScores: {[win]: 1, [lose]: 0, [tie]: 0},
    rock: {rock: [tie], paper: [lose], scissors: [win]},
    paper: {rock: [win], paper: [tie], scissors: [lose]},
    scissors: {rock: [lose], paper: [win], scissors: [tie]}
};
let resultsText = {
    [win]: { player: 'winner', computer: 'loser' },
    [lose]: { player: 'loser', computer: 'winner' },
    [tie]: { player: 'tie', computer: 'tie' }
};
let resultsMessages = {
    [win]: ["Woohoo! You Beat the Machine!",
            "*sniff* You did it, and I'm proud of you",
            "Allll skill baby!",
            "Psh! So easy",
            "I knew you could do it.",
            "I think I'll take credit for this one",],
    [lose]: ["Rats! Looks Like You're Worse Than Random Chance!",
            "U mad bro?",
            "Ouch... embarrassing",
            "You're not my child!",
            "Wow, pathetic!!"],
    [tie]: []
};

let playerDecision = new PlayerDecision('rock','paper','scissors');
let gameUI = new GameDisplay('#player_selection','#computer_selection');
let RPSGame = new Game(5,rules);

let weaponSelect = document.querySelector('#player_input');

weaponSelect.addEventListener('input',() => {
    if(RPSGame.gameReady()) {
        playerDecision.closestSelection(weaponSelect.value);
    
        if(playerDecision.decisionChange()) {
            if(playerDecision.getLastDecision()) {
                gameUI.toggleSelected('.'+playerDecision.getLastDecision(),'selected');
                gameUI.toggleSelected('#'+playerDecision.getLastDecision()+'_caption',
                                        'character_caption',
                                        playerDecision.getLastDecision()+'_caption_selected');    
                gameUI.toggleSelected('#player_selection',playerDecision.getLastDecision());
            } else {
                gameUI.toggleAttribute('#player_selection','innerText');
            }

            gameUI.toggleSelected('.'+playerDecision.getDecision(),'selected');
            gameUI.toggleSelected('#'+playerDecision.getDecision()+'_caption',
                                    'character_caption',
                                    playerDecision.getDecision()+'_caption_selected');
            gameUI.toggleSelected('#player_selection',playerDecision.getDecision());
        }
    }
});

let playForm = document.querySelector('#play_form');

playForm.addEventListener('submit',(event) => {
    event.preventDefault();
    playForm.reset();

    if(RPSGame.gameReady() && playerDecision.getDecision()) {
        playerDecision.computerPlay();
        
        gameUI.toggleSelected('#player_selection','selected','player_turn');
        gameUI.toggleSelected('#computer_selection','player_turn');

        setTimeout(() => {
            gameUI.showComputerSelection(playerDecision.getComputerDecision());
            RPSGame.playRound(playerDecision.getDecision(),playerDecision.getComputerDecision());
            gameUI.toggleWinner(RPSGame.getLastResult(),resultsText);
            gameUI.updatePlayerScores(RPSGame.getPlayerScore(),RPSGame.getComputerScore());

            RPSGame.changeGameState();
            

            if(RPSGame.gameOver()) {
                gameUI.togglePlayButton('play_round','Again!','newgameBtn');

                gameUI.toggleSelected('#win_lose',RPSGame.getGameResult(win,lose,tie).player);
                let winLoseMsg = RPSGame.getGameResult(win,lose,tie).player;
                winLoseMsg = 'You '+winLoseMsg[0].toUpperCase()+winLoseMsg.slice(1)+'!';
                gameUI.toggleSelected('#win_lose_message',RPSGame.getGameResult(win,lose,tie).player);
                gameUI.toggleAttribute('#win_lose_message','innerText',winLoseMsg);
                gameUI.toggleRandomResultMessage('#win_lose_sub_message',
                                                RPSGame.getGameResult(win,lose,tie).player,
                                                resultsMessages);
                gameUI.toggleSelected('#win_lose_sub_message',RPSGame.getGameResult(win,lose,tie).player+'_message');
            } else {
                gameUI.togglePlayButton('play_round','Reset','resetBtn');
            }
        },750);
    } else if(playerDecision.getDecision()) {
        gameUI.togglePlayButton('play_round','Reset','resetBtn');
        gameUI.toggleWinner(RPSGame.getLastResult(),resultsText);
        gameUI.toggleSelected('#player_selection',playerDecision.getDecision(),
                                                    'selected',
                                                    'player_turn');
        gameUI.toggleAttribute('#player_selection','innerText');
        gameUI.toggleSelected('#computer_selection',playerDecision.getComputerDecision(),
                                                    'selected');
        gameUI.toggleAttribute('#computer_selection','innerText');
        gameUI.toggleSelected('.'+playerDecision.getDecision(),'selected');
        gameUI.toggleSelected('#'+playerDecision.getDecision()+'_caption',
                                'character_caption',
                                playerDecision.getDecision()+'_caption_selected');
        if(RPSGame.gameOver()) {
            gameUI.toggleSelected('#win_lose',RPSGame.getGameResult(win,lose,tie).player);
            gameUI.toggleAttribute('#win_lose_message','innerText','');
            gameUI.toggleSelected('#win_lose_message',RPSGame.getGameResult(win,lose,tie).player);
            gameUI.toggleAttribute('#win_lose_sub_message','innerText');
            gameUI.toggleSelected('#win_lose_sub_message',RPSGame.getGameResult(win,lose,tie).player+'_message');
            
            RPSGame.reset();
            gameUI.updatePlayerScores(RPSGame.getPlayerScore(),RPSGame.getComputerScore());
        }
        
        playerDecision.reset();
        RPSGame.changeGameState();
    }
});