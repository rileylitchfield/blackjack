// Initialize variables
var suits = ["spades", "diamonds", "clubs", "hearts"];
var values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
let deck = [];
var details = {
    dealer: { idTracker: 0, userType: "dealer", cardGroup: "", deck: [], score: 0 },
    player: { idTracker: 0, userType: "player", cardGroup: "", deck: [], score: 0, betMoney: 100 }
};
var cardElement = ``;
var userType;
const gameResID = document.getElementById("game-result");
var initStart = 0;
var playerBet = 20;
var playerBank = 80;
var inGame = 0;

// Initialize variables in the DOM
writeHTML("player-score", 0);
writeHTML("dealer-score", 0);
writeHTML("player-bet", playerBet);
writeHTML("player-bank", playerBank);

function createDeck() {
    let newDeck = [];
    for (let i = 0; i < suits.length; i++) {
        for (let x = 0; x < values.length; x++) {
            let card = { value: values[x], suit: suits[i], int: null };
            if (values[x] === "J" || values[x] === "Q" || values[x] === "K") {
                card = { value: values[x], suit: suits[i], int: 10 };
            } else if (values[x] === "A") {
                card = { value: values[x], suit: suits[i], int: 11 };
            } else {
                card = { value: values[x], suit: suits[i], int: parseInt(values[x]) };
            }
            newDeck.push(card);
        }
    }
    return newDeck;
}

// switch the values of two random cards 52 times
function shuffle(deck) {
    for (let i = 0; i < deck.length; i++) {
        let index1 = Math.floor((Math.random() * deck.length));
        let index2 = Math.floor((Math.random() * deck.length));
        let tmp = deck[index1];

        deck[index1] = deck[index2];
        deck[index2] = tmp;
    }
}

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

// If players busts, check for aces to reduce the value from 11 to 1
// If there is more than one ace, it prioritizes 11 over 1 unless it is a bust
function checkAces(user) {
    if (user.score > 21) {
        for (let i = 0; i < user.deck.length; i++) {
            if (user.deck[i].value == "A" && user.score > 21 && user.deck[i].int === 11) {
                user.deck[i].int = 1;
                updateTotal(user);
            }
        }
    }
}

// Increase bet
function increaseBet(bet) {
    if (inGame == 0) {
        if (playerBank > 0 && bet <= playerBank) {
            playerBank -= bet;
            playerBet += bet;
            writeHTML("player-bank", `${playerBank}`);
            writeHTML("player-bet", `${playerBet}`);
        }
    }
}

// Update Bank and reset Bet
function updateBank(gameStatus) {
    if (gameStatus == "WIN") {
        playerBank += ((2 * playerBet) - 20);
        playerBet = 20;
        writeHTML("player-bank", `${playerBank}`);
        writeHTML("player-bet", `${playerBet}`);
    } else if (gameStatus == "LOSE") {
        playerBet = 20;
        playerBank -= 20;
        if (playerBank >= 0) {
            playerBet = 20;
            writeHTML("player-bank", `${playerBank}`);
            writeHTML("player-bet", `${playerBet}`);
        } else {
            document.getElementById("overlay").classList.remove("inactive");
        }
    }
}

// If score = 21, player wins
// If score is still greater than 21 (after initial check) then player loses
function checkScore() {
    gameResID.classList.remove("inactive");
    inGame = 0;
    if (details.player.score <= 21 && details.dealer.score == details.player.score) {
        writeHTML("game-result", "PUSH");
    } else if (details.player.score == 21 && details.dealer.score != 21) {
        writeHTML("game-result", "YOU WIN");
        updateBank("WIN");
    } else if (details.player.score > 21) {
        writeHTML("game-result", "BUST");
        updateBank("LOSE");
    } else if (details.dealer.score > details.player.score && details.dealer.score <= 21) {
        writeHTML("game-result", "YOU LOSE");
        updateBank("LOSE");
    } else if (details.player.score > details.dealer.score && details.player.score <= 21) {
        writeHTML("game-result", "YOU WIN");
        updateBank("WIN");
    } else if (details.dealer.score > 21) {
        writeHTML("game-result", "YOU WIN");
        updateBank("WIN");
    } else {
        console.log("Missing case");
    }
}

// Reset and re-add score from playerDeck, check for face cards, check for 21 or bust
function updateTotal(user) {
    user.score = 0;
    for (let i = 0; i < user.deck.length; i++) {
        user.score += user.deck[i].int;
    }
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
    if (initStart == 0) {
        initStart += 1;
        inGame = 1;
        deck = createDeck();
        shuffle(deck);
        deal();
    } else {
        // Remove cards and reset stats
        if (inGame == 0) {
            inGame = 1;

            clearTable();

            details.player.deck = [];
            details.dealer.deck = [];
            details.player.score = 0;
            details.dealer.score = 0;

            deal();
        }
    }
}

// remove cards from table (in the DOM)
function clearTable() {
    for (var key in details) {
        for (let i = 1; i <= details[key].idTracker; i++) {
            if (document.getElementById(`${details[key].userType}-card-${i}`)) {
                document.getElementById(`${details[key].userType}-card-${i}`).remove();
            }
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

// Take a card off the top of the deck 
// and add it to the user's deck
function dealCard(user) {
    let cardDealt = deck.pop();
    user.deck.push(cardDealt);
    return cardDealt.value;
}

// i.e. user = details.player.variable
function hit(user) {
    let card = dealCard(user);
    if (inGame == 1) {
        user.idTracker += 1;
        cardElement = `<div class="card" id="${user.userType}-card-${user.idTracker}">
                <div class="${user.userType}-card-number-area number-area">
                    <div class="${user.userType}-card-number number" id="${user.userType}-${user.idTracker}"></div>
                </div>
            </div>`;
        document.querySelector(`.${user.userType}-card-group`).insertAdjacentHTML('beforeend', cardElement);
        writeHTML(`${user.userType}-${user.idTracker}`, card);
        updateTotal(user);
    }
}

// Restart game when player runs out of money
function restart() {
    window.location.reload(true);
}