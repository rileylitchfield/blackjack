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
const playerCardGroup = document.querySelector(".player-card-group");
const dealerCardGroup = document.querySelector(".dealer-card-group");
var playerCardOne = randomCard(playerDeck);
var playerCardTwo = randomCard(playerDeck);
var dealerCardOne = randomCard(dealerDeck);
var newCard = ``;

// Initialize score
writeHTML("score", 0);

function stand() {
    while (dealerScore < 17) {
        idTracker += 1;
        newCard = `<div class="card">
                <div class="dealer-card-number-area number-area">
                    <div class="dealer-card-number number" id="dealer-${idTracker}"></div>
                </div>
            </div>`;
        dealerCardGroup.insertAdjacentHTML('beforeend', newCard);
        writeHTML(`dealer-${idTracker}`, randomCard(dealerDeck));
        for (let i = 0; i < dealerDeck.length; i++) {
            switch (dealerDeck[i]) {
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
                    randomValInt = dealerDeck[i];
                    break;
            }
            dealerScore += parseInt(randomValInt);
        }
        if (dealerScore > 21) {
            for (let i = 0; i < dealerDeck.length; i++) {
                if (dealerDeck[i] == "A" && dealerScore > 21) {
                    dealerDeck[i] = "1";
                    for (let i = 0; i < dealerDeck.length; i++) {
                        switch (dealerDeck[i]) {
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
                                randomValInt = dealerDeck[i];
                                break;
                        }
                        dealerScore += parseInt(randomValInt);
                    }
                }
            }
        }
    }
}

// Search for face cards and return their value
function filterDeck() {
    for (let i = 0; i < playerDeck.length; i++) {
        switch (playerDeck[i]) {
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
                randomValInt = playerDeck[i];
                break;
        }
        score += parseInt(randomValInt);
    }
}

// If players busts, check for aces to reduce the value from 11 to 1
// If there is more than one ace, it prioritizes 11 over 1 unless it is a bust
function checkAces() {
    if (score > 21) {
        for (let i = 0; i < playerDeck.length; i++) {
            if (playerDeck[i] == "A" && score > 21) {
                playerDeck[i] = "1";
                updateTotal();
            } else {

            }
        }
    }
}

// If score = 21, player wins
// If score is still greater than 21 (after initial check) then player loses
function checkScore() {
    checkAces();
    if (score == 21) {
        containerElement.insertAdjacentHTML('beforeend', winningText);
    }
    if (score > 21) {
        containerElement.insertAdjacentHTML('beforeend', losingText);
    }
}

// Reset and re-add score from playerDeck, check for face cards, check for 21 or bust
function updateTotal() {
    score = 0;
    filterDeck();
    checkScore();
    writeHTML("score", score);
}

// Writes innerHTML 
function writeHTML(elementID, inputResult) {
    document.getElementById(elementID).innerHTML = inputResult;
}

// Initialize the card table
function startGame() {
    writeHTML("player-1", playerCardOne);
    writeHTML("player-2", playerCardTwo);
    playerDeck = [playerCardOne, playerCardTwo];
    writeHTML("dealer-1", dealerCardOne);
    dealerDeck = [dealerCardOne];
    updateTotal();
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

// Returns random card from deck, adds it to playerDeck
function randomCard(x) {
    randomVal = deck[Math.floor(Math.random() * deck.length)];
    x.push(randomVal);
    score = 0;
    filterDeck();
    return randomVal;
}

// Adds new card to table and updates the new total
function hit() {
    idTracker += 1;
    newCard = `<div class="card">
                <div class="player-card-number-area number-area">
                    <div class="player-card-number number" id="player-${idTracker}"></div>
                </div>
            </div>`;
    playerCardGroup.insertAdjacentHTML('beforeend', newCard);
    writeHTML(`player-${idTracker}`, randomCard(playerDeck));
    updateTotal();
}