const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(height, width, percentage = 25) {
    this._height = height;
    this._width = width;
    this._percentage = percentage;
    this._field = Field.generateField(height, width, percentage);
  }

  print() {
    for (let row of this._field) {
      console.log(row.join(" "))
    }
  }

  play() {
    let posY = 0;
    let posX = 0;
    let userMove;
    let allowedMoves = this.allowedMoves(posY, posX);
    while (!allowedMoves) {
      this._field = Field.generateField(this._height, this._width, this._percentage);
    }
    while (this._field[posY][posX] !== hat && this._field[posY][posX] !== hole) {
      console.clear();
      this._field[posY][posX] = pathCharacter;
      this.print()
      allowedMoves = this.allowedMoves(posY, posX);
      if (!allowedMoves) {
        console.log("You can't move anymore. Maybe there was no path?")
      }
      userMove = prompt("Where do you want to go? Type U for Up, R for Right, D for Down, L for Left: ");
      while (!allowedMoves.includes(userMove.toUpperCase())) {
        userMove = prompt("The move you entered is invalid or forbidden. Please, try again: ");
      }
      switch (userMove.toUpperCase()) {
        case "U":
          posY -= 1;
          break;
        case "R":
          posX += 1;
          break;
        case "D":
          posY += 1;
          break;
        case "L":
          posX -= 1;
          break;
      }
    }
    if (this._field[posY][posX] === hat) {
      console.log("Yeah! You found your hat!")
    } else if (this._field[posY][posX] === hole) {
      console.log("Did you just fall in a hole?")
    }
  }

  allowedMoves(posY, posX) {
    const allowedMoves = [];
    // Up:
    if (posY && this._field[posY - 1][posX] !== pathCharacter) { allowedMoves.push("U"); }
    // Right:
    if (posX < this._field[0].length - 1 && this._field[posY][posX + 1] !== pathCharacter) { allowedMoves.push("R"); }
    // Down :
    if (posY < this._field.length - 1 && this._field[posY + 1][posX] !== pathCharacter) { allowedMoves.push("D"); }
    // Left:
    if (posX && this._field[posY][posX - 1] !== pathCharacter) { allowedMoves.push("L"); }
    return allowedMoves;
  }

  static generateField(height, width, percentage = 25) {
    const field = [] // Creating the field.
    if (percentage > 50) {
      percentage = 35;
      console.log("The percentage of holes, being too high, has been set to 35%")
    }
    let numberOfHoles = Math.floor(height * width * percentage / 100) // Defining the number of holes.
    // The position of the hat is generated randomly. It can't be [0][0].
    let hatY = 0;
    let hatX = 0;
    while (!hatX && !hatY) {
      hatY = Math.floor(Math.random() * height)
      hatX = Math.floor(Math.random() * width)
    }
    for (let row = 0; row < height; row++) {
      const rowArray = []
      for (let column = 0; column < width; column++) {
        // The position [0][0] is the starting point.
        if (row === 0 & column === 0) {
          rowArray.push(pathCharacter);
          continue;
        }
        // The hat is added if the position corresponds to its.
        if (row === hatY && column === hatX) {
          rowArray.push(hat);
          continue;
        }
        // Every other position is filled with a field character.
        rowArray.push(fieldCharacter);
      }
      field.push(rowArray);
    }
    for (numberOfHoles; numberOfHoles > 0; numberOfHoles--) {
      let holeY = 0;
      let holeX = 0;
      while (field[holeY][holeX] !== fieldCharacter) {
        holeY = Math.floor(Math.random() * height);
        holeX = Math.floor(Math.random() * width);
      }
      field[holeY][holeX] = hole;
    }
    return field;
  }
}

playGround = new Field(15, 25);
console.log(playGround.play())