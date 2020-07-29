document.addEventListener("DOMContentLoaded", () => {
  let width = 10;
  let squares = [];
  let bombAmount = 15;
  let isGameOver = false;
  let numOfFlags = 0;
  let difficulty = "easy";
  let score = 0;
  const grid = document.querySelector(".grid");
  const scoreKeeper = document.querySelector(".score");
  const gameStatus = document.querySelector(".gameStatus");
  const levels = document.querySelectorAll(".level");

  levels.forEach((level) => {
    if (level.classList.contains("active")) return;
    level.addEventListener("click", () => {
      level.classList.add("active");
      clearBoard();
      difficulty = level.innerHTML.toLowerCase().trim("");
      console.log(difficulty);
      displayBoard();
    });
  });

  clearBoard = () => {
    isGameOver = false;
    while (grid.firstChild) {
      grid.removeChild(grid.lastChild);
    }
  };

  displayBoard = () => {
    if (difficulty === "easy") {
      grid.style.width = 400 + "px";
      grid.style.height = 400 + "px";
      boxSize = 40 + "px";
      width = 10;
      bombAmount = 15;
    } else if (difficulty === "medium") {
      bombAmount = 40;
      width = 12;
      grid.style.width = 600 + "px";
      grid.style.height = 600 + "px";
      boxSize = 50 + "px";
    }
    const bombsArray = Array(bombAmount).fill("bomb");
    const remainingArray = Array(width * width - bombAmount).fill("numbers");
    const boardArray = bombsArray.concat(remainingArray);
    const shuffledArray = boardArray.sort(() => Math.random() - 0.5);
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("button");
      square.setAttribute("id", i);
      grid.appendChild(square);
      square.classList.add(shuffledArray[i]);
      squares.push(square);
      square.style.width = boxSize;
      square.style.height = boxSize;
      square.addEventListener("click", () => {
        click(square);
      });

      square.oncontextmenu = function (e) {
        e.preventDefault();
        addFlag(square);
      };
    }

    for (let i = 0; i < squares.length; i++) {
      const isLeftEdge = squares[i].id % width === 0;
      const isRightEdge = squares[i].id % width === width - 1;
      // if (isLeftEdge) squares[i].classList.add("left");
      // if (isRightEdge) squares[i].classList.add("right");
      let total = 0;

      if (squares[i].classList.contains("numbers")) {
        //chcck left
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb"))
          total++;

        // check right
        if (!isRightEdge && squares[i + 1].classList.contains("bomb")) total++;

        //check above
        if (i > width - 1 && squares[i - width].classList.contains("bomb"))
          total++;

        // check bottom
        if (
          i < width * width - width &&
          squares[i + width].classList.contains("bomb")
        )
          total++;

        //check top right
        if (
          i > width - 1 &&
          !isRightEdge &&
          squares[i + 1 - width].classList.contains("bomb")
        )
          total++;

        // check top-left
        if (
          i > width + 1 &&
          !isLeftEdge &&
          squares[i - 1 - width].classList.contains("bomb")
        )
          total++;

        // check bottom-left
        if (
          i < width * width - width &&
          !isLeftEdge &&
          squares[i - 1 + width].classList.contains("bomb")
        )
          total++;

        //check bottom-right
        if (
          i < width * width - width &&
          !isRightEdge &&
          squares[i + 1 + width].classList.contains("bomb")
        )
          total++;

        squares[i].setAttribute("bombs", total);
        // squares[i].innerHTML = total;
      }
    }
  };
  displayBoard();
  addFlag = (square) => {
    if (!square.classList.contains("flagged") && numOfFlags < bombAmount) {
      numOfFlags++;
      square.classList.add("flagged");
      square.innerHTML = "🥱";
    } else if (square.classList.contains("flagged")) {
      square.classList.remove("flagged");
      numOfFlags--;
      square.innerHTML = "";
    }
  };

  click = (square) => {
    console.log(square);
    const id = square.id;
    if (isGameOver) return;
    console.log("here");
    if (square.classList.contains("clicked")) return;
    if (square.classList.contains("flagged")) return;
    if (square.classList.contains("bomb")) {
      gameOver(square);
    } else {
      let total = parseInt(square.getAttribute("bombs"));
      console.log(total);
      if (total !== 0) {
        square.classList.add("clicked");
        square.innerHTML = total;
        if (total === 1) score += 10;
        if (total === 2) score += 20;
        if (total === 3) score += 30;
        if (total === 4) score += 40;
        if (total >= 5) score += 60;
        scoreKeeper.innerHTML = score;
      }
      if (total === 0) checkSquare(square, id);
    }
    square.classList.add("clicked");
    if (gameWon()) {
      winAnimation();
    }
    return;
  };

  gameWon = () => {
    let match = 0;
    squares.forEach((square) => {
      if (square.classList.contains("bomb")) return;
      if (square.classList.contains("clicked")) match++;
      return;
    });
    if (match === width * width - bombAmount) return true;
    return false;
  };

  checkSquare = (square, id) => {
    const isLeftEdge = id % width === 0;
    const isRightEdge = id % width === width - 1;

    setTimeout(() => {
      // check left
      if (id > 0 && !isLeftEdge) {
        const newId = squares[parseInt(id) - 1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }

      //check right
      if (id > width - 1 && !isRightEdge) {
        const newId = squares[parseInt(id) + 1 - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }

      //check top
      if (id > width - 1) {
        const newId = squares[parseInt(id) - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }

      if (id > width + 1 && !isLeftEdge) {
        const newId = squares[parseInt(id) - 1 - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }

      // check bottom
      if (id < width * width - 1 && !isRightEdge) {
        const newId = squares[parseInt(id) + 1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      // check bottom
      if (id < width * width - width + 1 && !isLeftEdge) {
        const newId = squares[parseInt(id) - 1 + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      // check bottom
      if (id < width * width - width - 1 && !isRightEdge) {
        const newId = squares[parseInt(id) + 1 + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      // check bottom
      if (id < width * width - width - 1) {
        const newId = squares[parseInt(id) + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
    }, 10);
  };

  gameOver = (square) => {
    gameStatus.innerHTML = "You Lost Click To Try Again!";
    squares.forEach((square) => {
      if (square.classList.contains("bomb")) {
        isGameOver = true;
        square.classList.add("exploded");
        square.innerHTML = "💣";
      }
      return;
    });
  };

  gameStatus.addEventListener("click", () => {
    // clearBoard();
    // displayBoard();
    location.reload();
  });

  winAnimation = () => {
    gameStatus.innerHTML = "You Won!!!! 🎉";
    console.log("You won");
  };
});
