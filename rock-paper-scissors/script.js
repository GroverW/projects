function game() {
    let numGames = 5;
    let playerScore = 0, compScore = 0;
    
    while(playerScore + compScore < numGames) {
        let computerSelection = computerPlay();
        let closest = false;

        while(!closest) {
            let playerSelection = prompt('Select Rock, Paper or Scissors');
            
            closest = closestSelection(playerSelection);
        
            if(!closest) alert('Sorry, could not match that to anything, please try again.');
        }
        
        let result = playRound(closest,computerSelection);
        playerScore += result.p;
        compScore += result.c;
        console.log(result.msg);
        console.log('You: '+playerScore,' ','Computer: '+compScore);
    }

    if(playerScore > compScore) {
        console.log("Woohoo! You Beat the Machine!");
    } else {
        console.log("Rats! Looks Like You're Worse Than Random Chance!")
    }
    
}

function computerPlay() {
    let options = ['rock','paper','scissors'];
    return options[Math.floor(Math.random() * options.length)];    
}

function playRound(playerSelection, computerSelection) {
    let tie = "It's a Tie!";
    let lose = "You Lose!";
    let win = "You Win!";
    let compare = {
        'rock': {'rock': tie, 'paper': lose, 'scissors': win},
        'paper': {'rock': win, 'paper': tie, 'scissors': lose},
        'scissors': {'rock': lose, 'paper': win, 'scissors': tie}
    }

    let p = playerSelection[0].toUpperCase() + playerSelection.slice(1);
    let c = computerSelection[0].toUpperCase() + computerSelection.slice(1);

    if(compare[playerSelection][computerSelection] === tie) {
        return {'p': 0, 'c': 0, 'msg': tie + ' You Both Picked ' + p + '!'};
    } else if (compare[playerSelection][computerSelection] === win) {
        return {'p': 1, 'c': 0, 'msg': win + ' ' + p + ' Beats ' + c + '!'};
    } else if (compare[playerSelection][computerSelection] === lose) {
        return {'p': 0, 'c': 1, 'msg': lose + ' ' + c + ' Beats ' + p + '!'};
    }
}

function closestSelection(playerSelection) {
    if(playerSelection.length === 0) return false;
    
    playerSelection = playerSelection.toLowerCase();

    let options = ['rock','paper','scissors'];
    let closest = '', bestScore = Infinity;

    for(let k of options) {
        let minTransform = k.length;
        let score = transformCost(playerSelection,k);

        if(score < minTransform && score < bestScore) {
            closest = k;
            bestScore = score;
        }
    }

    return closest !== '' ? closest : false;
}

function transformCost(str1,str2) {
    let costTable = new Array(str2.length + 1)
                                .fill(null)
                                .map(() => new Array(str1.length + 1)
                                                .fill(null));
    
    for(let i = 0; i <= str1.length; i++) costTable[0][i] = i;
    for(let j = 0; j <= str2.length; j++) costTable[j][0] = j;

    for(let r = 1; r <= str2.length; r++) {
        for(let c = 1; c <= str1.length; c++) {
            let sameVal = str2[r-1] === str1[c-1] ? 0 : 1;
            
            costTable[r][c] = Math.min(
                costTable[r][c-1] + 1,
                costTable[r-1][c] + 1,
                costTable[r-1][c-1] + sameVal
            );
        }
    }

    return costTable[str2.length][str1.length];
}

game();