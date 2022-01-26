// Initialize variables
const deck = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
var randomVal = deck[Math.floor(Math.random() * deck.length)];
var randomValInt = 0;
var details = {
    dealer: { idTracker: 1, userType: "dealer", cardGroup: "", deck: [], score: 0 },
    player: { idTracker: 2, userType: "player", cardGroup: "", deck: [], score: 0, betMoney: 100 }
};
var newCard = ``;
var userType;
const gameResID = document.getElementById("game-result");
var startTracker = 0;
var playerBet = 20;
var playerBank = 80;
var inGame = 0;

// Initialize variables in the DOM
writeHTML("player-score", 0);
writeHTML("dealer-score", 0);
writeHTML("player-bet", playerBet);
writeHTML("player-bank", playerBank);

// Dealer's turn, recursive function
function stand(user) {
    if (inGame == 1) {
        hit(user);
        if (user.score > 21) {
            document.getElementById("dealer-score").style.color = 'red';
        }
        setTimeout(function () {
            if (user.score < 17) {
                stand(user);
            } else {
                checkScore();
            }
        }, 1000);
    }
}

// Search for face cards and return their value
function filterDeck(user) {
    for (let i = 0; i < user.deck.length; i++) {
        switch (user.deck[i]) {
            case "J":
                randomValInt = 10;
                break;
            case "Q":
                randomValInt = 10;
                break;
            case "K":
                randomValInt = 10;
                break;
            case "A":
                randomValInt = 11;
                break;
            default:
                randomValInt = user.deck[i];
                break;
        }
        user.score += parseInt(randomValInt);
    }
}

// If players busts, check for aces to reduce the value from 11 to 1
// If there is more than one ace, it prioritizes 11 over 1 unless it is a bust
function checkAces(user) {
    if (user.score > 21) {
        for (let i = 0; i < user.deck.length; i++) {
            if (user.deck[i] == "A" && user.score > 21) {
                user.deck[i] = "1";
                updateTotal(user);
            }
        }
    }
}

// Increase bet
function increaseBet(bet) {
    if (playerBank > 0 && bet <= playerBank) {
        playerBank -= bet;
        playerBet += bet;
        writeHTML("player-bank", `${playerBank}`);
        writeHTML("player-bet", `${playerBet}`);
    }
}

// Update Bank and reset Bet
function updateBank(gameStatus) {
    if (gameStatus == "WIN") {
        playerBank += playerBet;
        playerBet = 20;
        writeHTML("player-bank", `${playerBank}`);
    } else if (gameStatus == "LOSE") {
        playerBank -= playerBet;
        if (playerBank > 0) {
            playerBet = 20;
            writeHTML("player-bank", `${playerBank}`);
        } else {
            document.getElementById("overlay").classList.remove("inactive");
        }
    }
}

// If score = 21, player wins
// If score is still greater than 21 (after initial check) then player loses
function checkScore() {
    if (details.player.score <= 21 && details.dealer.score == details.player.score) {
        gameResID.classList.remove("inactive");
        writeHTML("game-result", "PUSH");
        inGame = 0;
    } else if (details.player.score == 21) {
        gameResID.classList.remove("inactive");
        writeHTML("game-result", "YOU WIN");
        updateBank("WIN");
        inGame = 0;
    } else if (details.player.score > 21) {
        gameResID.classList.remove("inactive");
        writeHTML("game-result", "BUST");
        updateBank("LOSE");
        inGame = 0;
    } else if (details.dealer.score > details.player.score && details.dealer.score <= 21) {
        gameResID.classList.remove("inactive");
        writeHTML("game-result", "YOU LOSE");
        updateBank("LOSE");
        inGame = 0;
    } else if (details.player.score > details.dealer.score && details.player.score <= 21) {
        gameResID.classList.remove("inactive");
        writeHTML("game-result", "YOU WIN");
        updateBank("WIN");
        inGame = 0;
    } else if (details.dealer.score > 21) {
        gameResID.classList.remove("inactive");
        writeHTML("game-result", "YOU WIN");
        updateBank("WIN");
        inGame = 0;
    } else {
        console.log("Missing case");
    }
}

// Reset and re-add score from playerDeck, check for face cards, check for 21 or bust
function updateTotal(user) {
    user.score = 0;
    filterDeck(user);
    checkAces(user);
    if (details.player.score > 21) {
        document.getElementById("player-score").style.color = 'red';
        gameResID.classList.remove("inactive");
        writeHTML("game-result", "YOU LOSE");
        updateBank("LOSE");
        inGame = 0;
    }
    if (user == details.player) {
        writeHTML(`${user.userType}-score`, user.score);
    } else if (user == details.dealer) {
        writeHTML(`${user.userType}-score`, user.score);
    }
}

// Writes innerHTML 
function writeHTML(elementID, inputResult) {
    document.getElementById(elementID).innerHTML = inputResult;
}

// Initialize the card table
function startGame() {
    if (startTracker == 0) {
        startTracker += 1;
        inGame = 1;
        deal();
    } else {
        // remove cards from table (in the DOM)
        if (inGame == 0) {
            inGame = 1;

            for (var key in details) {
                for (let i = 0; i <= details[key].idTracker; i++) {
                    if (document.getElementById(`${details[key].userType}-card-${i}`)) {
                        document.getElementById(`${details[key].userType}-card-${i}`).remove();
                    }
                }
            }

            // reset stats
            details.player.deck = [];
            details.dealer.deck = [];
            details.player.score = 0;
            details.dealer.score = 0;

            deal();
        }
    }
}

// Deal cards
function deal() {
    document.getElementById("dealer-score").style.color = 'white';
    document.getElementById("player-score").style.color = 'white';
    gameResID.classList.add("inactive");
    hit(details.player);
    hit(details.player);
    hit(details.dealer);
}

// Returns random card from deck, adds it to playerDeck
function randomCard(user) {
    randomVal = deck[Math.floor(Math.random() * deck.length)];
    user.deck.push(randomVal);
    user.score = 0;
    filterDeck(user);
    return randomVal;
}

// i.e. user = details.player.variable
function hit(user) {
    if (inGame == 1) {
        user.idTracker += 1;
        newCard = `<div class="card" id="${user.userType}-card-${user.idTracker}">
                <div class="${user.userType}-card-number-area number-area">
                    <div class="${user.userType}-card-number number" id="${user.userType}-${user.idTracker}"></div>
                </div>
            </div>`;
        document.querySelector(`.${user.userType}-card-group`).insertAdjacentHTML('beforeend', newCard);
        writeHTML(`${user.userType}-${user.idTracker}`, randomCard(user));
        updateTotal(user);
    }
}

// Restart game when player runs out of money
function restart() {
    var details = {
        dealer: { idTracker: 1, userType: "dealer", cardGroup: "", deck: [], score: 0 },
        player: { idTracker: 2, userType: "player", cardGroup: "", deck: [], score: 0, betMoney: 100 }
    };
    var newCard = ``;
    var startTracker = 0;
    var playerBet = 20;
    var playerBank = 80;
    writeHTML("player-bank", `${playerBank}`);
    startGame();
    document.getElementById("overlay").classList.add("inactive");
}