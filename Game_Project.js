// var player1 = prompt("Player One: Enter Your Name , you will be Red");
const player1 = 'Joao';
const player1Color = 'red';

// var player2 = prompt("Player Two: Enter Your Name, you will be Blue");
const player2 = 'Isabela';
const player2Color = 'mediumAquaMarine';

var game_on = true;
const tr = document.querySelectorAll("tr");
const td = document.querySelectorAll('tr td');

document.querySelector("#player").innerHTML = player1;
document.querySelector("#playerColor").innerHTML = player1Color;
document.querySelector("#playerColor").style.color = player1Color;

const buttons = document.querySelectorAll('button');
assignEventListener(buttons);

// add action listener to all buttons
function assignEventListener(buttons) {
  auxAssignEventListener(buttons, 0);

  function auxAssignEventListener(buttons, i) {
    if(i < buttons.length){
      buttons[i].addEventListener('click', function() {
        if (game_on) {
          // Recognize what column was chosen
          var column = findColumn(this.parentNode);
          // Gets the empty(gray) button nearest to the bottom
          var row = getBottom(column);

          // Drop the disc
          dropDisc(row, column, currentColor());

          // Change the player
          document.querySelector("#player").innerHTML = currentPlayer();
          document.querySelector("#playerColor").innerHTML = currentColor();
          document.querySelector("#playerColor").style.color = currentColor();

          // Check for a win or a tie
          if (checkHorizontalWin() || checkVerticalWin() || checkDiagonalWin()) {
            endGame();
          }
        }
      });
      auxAssignEventListener(buttons, i + 1);
    }
  }
}

// ---------------------------------- DISC ----------------------------------

// Recognize what column was chosen
function findColumn(c) {
  var i = auxFindColumn(c, td, 0);
  return i % 7;

  function auxFindColumn(c, td, i) {
    if(i < td.length){
      if (td[i] === c) {
        return i;
      }else{
        return auxFindColumn(c, td, i + 1);
      }
    }
  }
}

// Gets the empty(gray) button nearest to the bottom
function getBottom(column) {
  return auxGetBottom(5, column);

  function auxGetBottom(row, column) {
    colorReport = returnColor(row,column);
    if (colorReport === 'rgb(128, 128, 128)') {
      return row;
    }else{
      return auxGetBottom(row - 1, column);
    }
  }
}

// Place the disc in the right position
function dropDisc(row,column,color) {
  return tr[row].querySelectorAll("td")[column].querySelector("button").style.backgroundColor = color;
}

// ------------------------------ COLOR FUNCTIONS ------------------------------

// Check if the inputs are the same color and not gray
function equalColors(c1,c2,c3,c4){
  return (c1 === c2 && c2 === c3 && c3 === c4 && c1 !== 'rgb(128, 128, 128)' && c1 !== undefined);
}

// Return color of a button
function returnColor(row,column) {
  if (row >= 0 && row < 6 && column < 7 && column >= 0) {
    var pos = (tr[row].querySelectorAll("td")[column].querySelector("button"));
    // used window.getComputedStyle instead of style because using style you might
    // have not set the background color before reading it
    var color = window.getComputedStyle(pos, null).getPropertyValue('background-color');
    return color;
  }
}

// ------------------------------ CURRENT STATUS ------------------------------

// return the current player
function currentPlayer() {
  if(countDiscs() % 2 === 0){
    return player1;
  }else{
    return player2;
  }
}

// return the current color
function currentColor() {
  if(countDiscs() % 2 === 0){
    return player1Color;
  }else{
    return player2Color;
  }
}

// count how many discs are in the table
function countDiscs() {
  return auxCountDiscs(td, 0);

  function auxCountDiscs(td, i) {
    if(i < td.length){
      var color = window.getComputedStyle(td[i].querySelector("button"), null).getPropertyValue('background-color');
      if(color !== 'rgb(128, 128, 128)'){
        return 1 + auxCountDiscs(td, i + 1);
      }else{
        return auxCountDiscs(td, i + 1);
      }
    }else{
      return 0;
    }
  }
}

// ------------------------- CHECK END GAME SITUATIONS -------------------------

// Check for Horizontal Wins
function checkHorizontalWin() {
  return auxCheckHorizontalWin(0);

  // change the rows
  function auxCheckHorizontalWin(row) {
    if (row < 6) {
      if (auxCheckHorizontalWin2(row, 0)) {
        return true;
      }else{
        return auxCheckHorizontalWin(row + 1);
      }
    }
  }
  // change the columns
  function auxCheckHorizontalWin2(row, column) {
    if (column < 4) {
      if (auxCheckHorizontalWin3(row, column)) {
        return true;
      }else{
        return auxCheckHorizontalWin2(row, column + 1);
      }
    }else{
      return false;
    }
  }
  // check if there is a horizontal win
  function auxCheckHorizontalWin3(row, column) {
    if (equalColors(returnColor(row,column), returnColor(row,column+1) ,returnColor(row,column+2), returnColor(row,column+3))) {
      console.log('horizontal win');
      return true;
    }else {
      return false;
    }
  }

}

// Check for Vertical Wins
function checkVerticalWin() {
  return auxCheckVerticalWin(0);

  // change the columns
  function auxCheckVerticalWin(column) {
    if (column < 7) {
      if (auxCheckVerticalWin2(0, column)) {
        return true;
      }else{
        return auxCheckVerticalWin(column + 1);
      }
    }
  }
  // change the rows
  function auxCheckVerticalWin2(row, column) {
    if (row < 3) {
      if (auxCheckVerticalWin3(row, column)) {
        return true;
      }else{
        return auxCheckVerticalWin2(row + 1, column);
      }
    }else{
      return false;
    }
  }
  // check if there is a vertical win
  function auxCheckVerticalWin3(row, column) {
    if (equalColors(returnColor(row,column), returnColor(row + 1,column) ,returnColor(row + 2,column), returnColor(row + 3,column))) {
      console.log('vertical win');
      return true;
    }else {
      return false;
    }
  }

}

// Check for Diagonal Wins
function checkDiagonalWin() {
  return auxCheckDiagonalWin(0);

  // change the columns
  function auxCheckDiagonalWin(column) {
    if (column < 5) {
      if (auxCheckDiagonalWin2(0, column)) {
        return true;
      }else{
        return auxCheckDiagonalWin(column + 1);
      }
    }
  }
  // change the rows
  function auxCheckDiagonalWin2(row, column) {
    if (row < 7) {
      if (auxCheckDiagonalWin3(row, column)) {
        return true;
      }else{
        return auxCheckDiagonalWin2(row + 1, column);
      }
    }else{
      return false;
    }
  }
  // check if there is a diagonal win
  function auxCheckDiagonalWin3(row, column) {
    if (equalColors(returnColor(row,column), returnColor(row+1,column+1) ,returnColor(row+2,column+2), returnColor(row+3,column+3))) {
      console.log('diagonal win');
      return true;
    }else if (equalColors(returnColor(row,column), returnColor(row-1,column+1) ,returnColor(row-2,column+2), returnColor(row-3,column+3))) {
      console.log('diagonal win');
      return true;
    }else {
      return false;
    }
  }

}

// --------------------------------- END GAME ---------------------------------

// End game
function endGame() {
  document.querySelector("#playerTurn").remove();
  document.querySelector("#notificationHeading").innerHTML = defineWinner() + " won. Refresh to play again.";
  game_on = false;

  function defineWinner() {
    if(currentPlayer() === player1){
      return player2;
    }else{
      return player1;
    }
  }
}
