// Initialize variables
const deck = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
const deckObj = { "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10, "J": 10, "Q": 10, "K": 10, "A": 11 };
var playerDeck = [];
var dealerDeck = [];
var randomVal = deck[Math.floor(Math.random() * deck.length)];
var randomValInt = 0;
var idTracker = 2;
var score = 0;
var dealerScore = 0;
const containerElement = document.body;
const winningText = `<h1 class="game-result">YOU WIN</h1>`;
const losingText = `<h1 class="game-result">BUST</h1>`;
var details = {
    dealer: { idTracker: 1, userType: "dealer", cardGroup: "", deck: [], score: 0 },
    player: { idTracker: 2, userType: "player", cardGroup: "", deck: [], score: 0 }
};
var playerCardOne = randomCard(details.player);
var playerCardTwo = randomCard(details.player);
var dealerCardOne = randomCard(details.dealer);
var newCard = ``;
var dealerObj = {};
var playerObj = {};
var userType;

// Initialize score
writeHTML("score", 0);

function stand(user) {
    while (user.score < 17) {
        hit(user);
        updateTotal(user);
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
            } else {

            }
        }
    }
}

// If score = 21, player wins
// If score is still greater than 21 (after initial check) then player loses
function checkScore(user) {
    checkAces(user);
    if (user.score == 21) {
        containerElement.insertAdjacentHTML('beforeend', winningText);
    }
    if (user.score > 21) {
        containerElement.insertAdjacentHTML('beforeend', losingText);
    }
}

// Reset and re-add score from playerDeck, check for face cards, check for 21 or bust
function updateTotal(user) {
    user.score = 0;
    filterDeck(user);
    checkScore(user);
    writeHTML("score", details.player.score);
}

// Writes innerHTML 
function writeHTML(elementID, inputResult) {
    document.getElementById(elementID).innerHTML = inputResult;
}

// Initialize the card table
function startGame() {
    writeHTML("player-1", playerCardOne);
    writeHTML("player-2", playerCardTwo);
    details.player.deck = [playerCardOne, playerCardTwo];
    writeHTML("dealer-1", dealerCardOne);
    details.dealer.deck = [dealerCardOne];
    updateTotal(details.player);
}

// Returns random card from deck, adds it to playerDeck
function randomCard(user) {
    randomVal = deck[Math.floor(Math.random() * deck.length)];
    user.deck.push(randomVal);
    user.score = 0;
    filterDeck(details.player);
    return randomVal;
}

// i.e. user = details.player.variable
function hit(user) {
    user.idTracker += 1;
    newCard = `<div class="card">
                <div class="${user.userType}-card-number-area number-area">
                    <div class="${user.userType}-card-number number" id="${user.userType}-${user.idTracker}"></div>
                </div>
            </div>`;
    document.querySelector(`.${user.userType}-card-group`).insertAdjacentHTML('beforeend', newCard);
    writeHTML(`${user.userType}-${user.idTracker}`, randomCard(user));
    updateTotal(user);
}

// Change card table background color
function changeBG() {
    var hexColorArr = [];
    for (let i = 0; i < 3; i++) {
        newNum = Math.round(Math.random() * 10);
        if (newNum < 10) {
            hexColorArr.push(newNum);
        } else {
            i--;
        }
    }
    hexColorArr.unshift("#");
    var hexColor = hexColorArr.join('');
    containerElement.style.backgroundColor = hexColor;
}