var deck = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
var deckObj = { "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10, "J": 10, "Q": 10, "K": 10, "A": 1 };
var randomVal = deck[Math.floor(Math.random() * deck.length)];
var randomValInt = 0;
var idTracker = 2;
var score = 0;

updateTotal();

function updateTotal() {
    document.getElementById("score").innerHTML = score;

    if (score > 21) {
        var containerElement = document.querySelector(".container");
        var newCard = `<h1 class="test">BUST</h1>`
        containerElement.insertAdjacentHTML('beforeend', newCard)
    } else if (score == 21) {
        var containerElement = document.body;
        var newCard = `<h1 class="test">YOU WIN</h1>`
        containerElement.insertAdjacentHTML('beforeend', newCard)
    }
}

function startGame() {
    document.getElementById("number-1").innerHTML = changeCard();
    document.getElementById("number-2").innerHTML = changeCard();
    updateTotal();
}

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

function changeCard() {
    randomVal = deck[Math.floor(Math.random() * deck.length)];

    switch (randomVal) {
        case 'J':
            randomValInt = 10;
            break;
        case "Q":
            randomValInt = 10;
            break;
        case "K":
            randomValInt = 10;
            break;
        case "A":
            randomValInt = 1;
            break;
        default:
            randomValInt = randomVal;
            break;
    }

    score += parseInt(randomValInt);
    return randomVal;
}

function hit() {
    idTracker += 1;
    var cardGroup = document.querySelector(".card-group");
    var newCard = `<div class="card">
    <div class="number-area">
    <div class="number" id="number-${idTracker}">
    </div></div></div>`
    cardGroup.insertAdjacentHTML('beforeend', newCard)
    document.getElementById(`number-${idTracker}`).innerHTML = changeCard();
    updateTotal();
}