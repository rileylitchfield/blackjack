var deck = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
var deckObj = { "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10, "J": 10, "Q": 10, "K": 10, "A": 11 };
var playerDeck = [];
var randomVal = deck[Math.floor(Math.random() * deck.length)];
var randomValInt = 0;
var idTracker = 2;
var score = 0;
var containerElement = document.body;
var winningText = `<h1 class="game-result">YOU WIN</h1>`;
var losingText = `<h1 class="game-result">BUST</h1>`;


updateTotal();

// Search for face cards and return their value
function filterDeck(x) {
    switch (String(x)) {
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
            randomValInt = x;
            break;
    }
}

// Reset and re-add score from playerDeck, check for face cards, check for 21 or bust
function updateTotal() {
    score = 0;

    for (let i = 0; i < playerDeck.length; i++) {
        filterDeck(playerDeck[i]);
        score += parseInt(randomValInt);
    }

    if (score > 21) {
        for (let i = 0; i < playerDeck.length; i++) {
            if (playerDeck[i] == "A") {
                playerDeck[i] = "1";
                updateTotal();
            }
        }
    } else if (score == 21) {
        containerElement.insertAdjacentHTML('beforeend', winningText)
    }

    if (score > 21) {
        containerElement.insertAdjacentHTML('beforeend', losingText)
    }

    document.getElementById("score").innerHTML = score;
}

// Initialize the card table
function startGame() {
    var cardOne = randomCard();
    var cardTwo = randomCard();
    document.getElementById("number-1").innerHTML = cardOne;
    document.getElementById("number-2").innerHTML = cardTwo;
    playerDeck = [cardOne, cardTwo];
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

    document.body.style.backgroundColor = hexColor;

}

// Returns random card from deck
function randomCard() {
    randomVal = deck[Math.floor(Math.random() * deck.length)];

    // filterDeck(playerDeck[randomVal]);

    playerDeck.push(randomVal);
    score = 0;

    for (let i = 0; i < playerDeck.length; i++) {
        filterDeck(playerDeck[i]);
        score += parseInt(randomValInt);
    }

    return randomVal;
}

// Adds new card to table and updates the new total
function hit() {
    idTracker += 1;
    var cardGroup = document.querySelector(".card-group");
    var newCard = `<div class="card">
    <div class="number-area">
    <div class="number" id="number-${idTracker}">
    </div></div></div>`
    cardGroup.insertAdjacentHTML('beforeend', newCard)
    document.getElementById(`number-${idTracker}`).innerHTML = randomCard();
    updateTotal();
}