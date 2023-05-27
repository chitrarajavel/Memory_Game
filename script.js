/*

## **Part One - Reading the code**

Take a look at the starter code provided.

- We have an array of colors which we shuffle and then loop over to create 10  elements on the page and give them a class of the color we loop over.
    
    ***<div>***
    
- We then append the  elements to the DOM and add an event listener for a “click” for each of the elements.
    
    ***<div>***
    

Make sure to read through the code before continuing on!

*/

// localStorage.removeItem('storedLowestScore');

const gameContainer = document.getElementById('game');
const startButton = document.querySelector('#startButton');
const curScoreElement = document.querySelector('#curScore');
const gameOver = document.querySelector('#gameOver');
const lowestScoreElement = document.querySelector('#lowestScore');
let lowestScore = localStorage.getItem('storedLowestScore') || 0;
let cardOne;
let cardTwo;
let timeOutRunning = false;
let curScore = 0;
let numberOfMatches = 0;
let clickCount = 0;
let gameOverCheck = false;
gameOver.style.display = 'none';

//If we don't set this below, lowest score will display zero when it starts
lowestScoreElement.innerText = lowestScore > 0 ? lowestScore : '';

const COLORS = [
    'red',
    'blue',
    'green',
    'orange',
    'purple',
    'red',
    'blue',
    'green',
    'orange',
    'purple',
];

const maxNumberOfMatchedCards = COLORS.length / 2;

//Save Game
function Save() {
    localStorage.setItem('storedLowestScore', lowestScore);
}

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want to research more
function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
    for (let color of colorArray) {
        // create a new div
        const newDiv = document.createElement('div');

        //<div class="color" click="handleCardClick()"></div>

        // give it a class attribute for the value we are looping over
        newDiv.classList.add(color);

        // call a function handleCardClick when a div is clicked on
        newDiv.addEventListener('click', handleCardClick);

        // append the div to the element with an id of game
        gameContainer.append(newDiv);
    }
}

// Start button will trigger the event listener on click and start the game

startButton.addEventListener('click', startGame);

function startGame() {
    let shuffledColors = shuffle(COLORS);
    // when the DOM loads
    gameContainer.innerHTML = ''; //This will clear out the cards every time you hit the start button.
    createDivsForColors(shuffledColors);
    startButton.style.display = 'none'; // Start button disappears

    //Reset
    gameOver.style.display = 'none';
    timeOutRunning = false;
    curScore = 0;
    numOfMatchedCards = 0;
    clickCount = 0;
    gameOverCheck = false;
    curScoreElement.innerText = curScore;
}

// TODO: Implement this function!
function handleCardClick(event) {
    // you can use event.target to see which element was clicked

    //don't continue if timeOut is running or if it's game over
    if (timeOutRunning) return;
    if (gameOverCheck) return;

    clickCount++;

    let thisCard = event.target;

    // set the bg color of the card using the class. [0] is necessary if we add more than one class.
    thisCard.style.backgroundColor = thisCard.classList[0];

    if (clickCount === 1) {
        cardOne = thisCard;

        //max click count will be 2, curScore = number of curScore
    } else if (clickCount === 2) {
        cardTwo = thisCard;

        //if the same card was clicked, then cancel click and return - two equals checks for the same element - Bug fix
        if (cardOne == cardTwo) {
            clickCount--;
            return;
        }

        clickCount = 0; // Reset click to zero to execute conditions

        //update score
        curScore++;
        curScoreElement.innerText = curScore;

        //colors match?
        if (cardTwo.classList[0] === cardOne.classList[0]) {
            numOfMatchedCards++;

            cardOne.removeEventListener('click', handleCardClick);
            cardTwo.removeEventListener('click', handleCardClick);

            //game Over?
            if (numOfMatchedCards === maxNumberOfMatchedCards) {
                if (curScore < lowestScore || lowestScore === 0) {
                    lowestScore = curScore;
                    lowestScoreElement.innerText = lowestScore;
                    Save();
                }

                gameOverCheck = true;
                gameOver.style.display = 'block';
                startButton.style.display = 'block';
                startButton.innerText = 'Restart';
            }

            /* If the current card and the previous card matches, remove the event listener for both cards
            otherwise you can keep click on the card */
        } else {
            timeOutRunning = true;
            setTimeout(function () {
                cardOne.style.backgroundColor = '';
                cardTwo.style.backgroundColor = '';
                timeOutRunning = false;
            }, 1000);
        }
    }
}
