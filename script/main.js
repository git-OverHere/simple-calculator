function addNum(num) {
  if (resultIsHighlighted) {
    recordPrevResult();
    current.innerHTML = "0";
    unhighlightResult();
  }
  if (current.innerHTML === "0" && num === 0) {
    //prevent many zeroes to be inputted if value is 0
  } else if (current.innerHTML === "0" && num != 0) {
    //remove initial zero to prevent zero in front of number
    current.innerHTML = num.toString();
  } else {
    current.innerHTML = current.innerHTML + num.toString();
  }
  getResult();
  toggleClearAndAllClear();
}

function addOperation(operation) {
  if (resultIsHighlighted) {
    recordPrevResult();
    current.innerHTML = predicted.innerHTML.substr(1);
    unhighlightResult();
  }
  const lastChar = current.innerHTML.substr(current.innerHTML.length - 1);
  if (operations.includes(lastChar)) {
    current.innerHTML =
      current.innerHTML.substr(0, current.innerHTML.length - 1) + operation;
  } else {
    current.innerHTML = current.innerHTML + operation;
  }
  toggleClearAndAllClear();
}

function addDot() {
  if (resultIsHighlighted) {
    recordPrevResult();
    current.innerHTML = "0";
    unhighlightResult();
    getResult();
  }
  let lastNum;
  //check from the front of input if there are operation to get last number
  for (let i = current.innerHTML.length - 1; i >= 0; i--) {
    if (operations.includes(current.innerHTML[i])) {
      lastNum = current.innerHTML.substr(i + 1);
      break;
    }
  }
  //assign number if there are no operation
  if (lastNum === undefined) {
    lastNum = current.innerHTML;
  }
  if (!lastNum.includes(".")) {
    current.innerHTML = current.innerHTML + ".";
  }
  toggleClearAndAllClear();
}

function convertToPercentage() {
  if (resultIsHighlighted) {
    recordPrevResult();
    current.innerHTML = predicted.innerHTML.substr(1);
    unhighlightResult();
  }
  if (current.innerHTML === "0") {
    return;
  }
  let remainingExpression;
  let lastNum;
  let lastOperation;
  //check from the front of input if there are operation to get last number
  for (let i = current.innerHTML.length - 1; i >= 0; i--) {
    if (operations.includes(current.innerHTML[i])) {
      remainingExpression = current.innerHTML.substr(0, i + 1);
      lastNum = current.innerHTML.substr(i + 1);
      lastOperation = current.innerHTML.substr(i, 1);
      break;
    }
  }
  //same number if there are no operation
  if (lastNum === undefined) {
    remainingExpression = "";
    lastNum = current.innerHTML;
  }
  //return if last expression is none
  if (lastNum === "") {
    return;
  }
  //If true, just divide last number to 100
  if (
    lastOperation === undefined ||
    lastOperation === "*" ||
    lastOperation === "/"
  ) {
    const percentNum = Number(lastNum) / 100;
    current.innerHTML = remainingExpression + percentNum.toString();
  } else if (lastOperation === "-" || lastOperation === "+") {
    //if true, get lastNum percent of predicted equals
    let percentNum;
    if (lastOperation === "-") {
      percentNum = Number(predicted.innerHTML.substr(1)) + Number(lastNum);
    } else {
      percentNum = Number(predicted.innerHTML.substr(1)) - Number(lastNum);
    }
    percentNum = (percentNum * Number(lastNum)) / 100;
    current.innerHTML = remainingExpression + percentNum.toString();
  }
  getResult();
}

function backspaceChar() {
  if (!resultIsHighlighted) {
    current.innerHTML = current.innerHTML.substr(
      0,
      current.innerHTML.length - 1
    );
    getResult();
    if (current.innerHTML === "") {
      current.innerHTML = "0";
    }
  }
  toggleClearAndAllClear();
}

function highlightResult() {
  current.style.fontSize = "25px";
  predicted.style.fontSize = "45px";
  predicted.style.color =
    getComputedStyle(predicted).getPropertyValue("--color2");
  resultIsHighlighted = true;
}

function unhighlightResult() {
  current.style.fontSize = "45px";
  predicted.style.fontSize = "25px";
  predicted.style.color =
    getComputedStyle(predicted).getPropertyValue("--color7");
  resultIsHighlighted = false;
}

function recordPrevResult() {
  const previousContainer = document.querySelector("#previous-container");
  const prevPredicted = document.createElement("p");
  prevPredicted.classList.add("previous-result");
  prevPredicted.innerHTML = predicted.innerHTML;
  const prevCurrent = document.createElement("p");
  prevCurrent.classList.add("previous");
  prevCurrent.innerHTML = current.innerHTML;

  previousContainer.appendChild(prevCurrent);
  previousContainer.appendChild(prevPredicted);
}

function toggleClearAndAllClear() {
  if (current.innerHTML != "0") {
    clear.innerHTML = "C";
  } else {
    clear.innerHTML = "AC";
  }
}

function clearExpression() {
  if (clear.innerHTML === "AC") {
    const previousContainer = document.querySelector("#previous-container");
    previousContainer.innerHTML = "";
  }
  current.innerHTML = "0";
  getResult();
  if (resultIsHighlighted) {
    unhighlightResult();
  }
  toggleClearAndAllClear();
}

function getResult() {
  let isInvalid = false;
  //check all characters of expression to prevent eval security breach
  current.innerHTML.split("").forEach(function (char) {
    if (!possibleChar.includes(char)) {
      isInvalid = true;
    }
  });
  if (isInvalid) {
    predicted.innerHTML = "Invalid Expression";
  } else {
    if (
      current.innerHTML === "0" ||
      current.innerHTML === undefined ||
      current.innerHTML === ""
    ) {
      //if no expression and just zero, show nothing
      predicted.innerHTML = "";
    } else {
      //remove operation in the end if there are no number afterwards
      let toEvaluate;
      if (
        operations.includes(
          current.innerHTML.substr(current.innerHTML.length - 1)
        )
      ) {
        toEvaluate = current.innerHTML.substr(0, current.innerHTML.length - 1);
      } else {
        toEvaluate = current.innerHTML;
      }
      predicted.innerHTML = "=" + eval(toEvaluate);
    }
  }
}

function validateKeyPress(key) {
  //scan all invalid characters and remove if found
  let validatedExpression = "";
  current.innerHTML.split("").forEach(function (char) {
    if (possibleChar.includes(char)) {
      validatedExpression = validatedExpression + char;
    }
  });
  //remove leading zeroes, double decimal point, and double operation
  validatedExpression = validatedExpression.split("");
  let isFirstNum = true;
  let canBeZero = true;
  let canBeManyZero = true;
  let canBeDot = true;
  let canBeOperation = false;
  let toRemoveArray = [];
  validatedExpression.forEach(function (char, i) {
    if (char === "0") {
      canBeOperation = true;
      if (!canBeZero) {
        toRemoveArray.unshift(i);
      }
      if (!canBeManyZero) {
        canBeZero = false;
      }
    } else if (char === ".") {
      if (isFirstNum) {
        for (let index = i - 1; index >= 0; index--) {
          toRemoveArray.push(index);
        }
      }
      isFirstNum = false;
      if (canBeDot) {
        canBeDot = false;
        canBeZero = true;
        canBeManyZero = true;
      } else {
        toRemoveArray.unshift(i);
      }
    } else if (operations.includes(char)) {
      if (isFirstNum) {
        for (let index = i - 1; index > 0; index--) {
          toRemoveArray.push(index);
        }
      }
      isFirstNum = false;
      canBeDot = true;
      canBeZero = true;
      canBeManyZero = false;
      if (!canBeOperation) {
        toRemoveArray.unshift(i);
      }
      canBeOperation = false;
    } else {
      if (isFirstNum) {
        for (let index = i - 1; index >= 0; index--) {
          toRemoveArray.push(index);
        }
      }
      isFirstNum = false;
      canBeOperation = true;
      canBeZero = true;
      canBeManyZero = true;
    }
  });
  toRemoveArray.forEach(function (index) {
    validatedExpression.splice(index, 1);
  });
  //another round of checking to remove one leading zero if number is there is number in expression
  toRemoveArray = [];
  let prevprevChar;
  let prevChar;
  let currChar;
  validatedExpression.forEach(function (char, i) {
    prevprevChar = prevChar;
    prevChar = currChar;
    currChar = char;
    if (
      operations.includes(prevprevChar) &&
      prevChar === "0" &&
      nonZeroNum.includes(currChar)
    ) {
      toRemoveArray.unshift(i - 1);
    }
  });
  toRemoveArray.forEach(function (index) {
    validatedExpression.splice(index, 1);
  });
  validatedExpression = validatedExpression.join("");
  current.innerHTML = validatedExpression;
  if (current.innerHTML === "") {
    current.innerHTML = "0";
  }
  getResult();
}

function toggleTheme() {
  const iconTheme = document.querySelector("#icon-theme");
  const body = document.querySelector("body");
  body.classList.toggle("light-theme");
  if (iconTheme.icon === "fa-solid:sun") {
    iconTheme.icon = "fa-solid:moon";
  } else {
    iconTheme.icon = "fa-solid:sun";
  }
}

const possibleChar = [
  ".",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "+",
  "-",
  "*",
  "/",
];
const nonZeroNum = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
const operations = ["+", "-", "*", "/"];

let resultIsHighlighted = false;

const body = document.querySelector("body");
const current = document.querySelector("#current");
const predicted = document.querySelector("#predicted");

const btnTheme = document.querySelector("#btn-theme");
btnTheme.addEventListener("click", function (e) {
  toggleTheme();
});

current.addEventListener("focusout", function (e) {
  validateKeyPress();
});

const clear = document.querySelector("#clear");
clear.addEventListener("click", function (e) {
  clearExpression();
});

const backspace = document.querySelector("#backspace");
backspace.addEventListener("click", function (e) {
  backspaceChar();
});

const percent = document.querySelector("#percent");
percent.addEventListener("click", function (e) {
  convertToPercentage();
});

const divide = document.querySelector("#divide");
divide.addEventListener("click", function (e) {
  addOperation("/");
});

const multiply = document.querySelector("#multiply");
multiply.addEventListener("click", function (e) {
  addOperation("*");
});

const minus = document.querySelector("#minus");
minus.addEventListener("click", function (e) {
  addOperation("-");
});

const plus = document.querySelector("#plus");
plus.addEventListener("click", function (e) {
  addOperation("+");
});

const equals = document.querySelector("#equals");
equals.addEventListener("click", function (e) {
  highlightResult();
});

const dot = document.querySelector("#dot");
dot.addEventListener("click", function (e) {
  addDot();
});

const nine = document.querySelector("#nine");
nine.addEventListener("click", function (e) {
  addNum(9);
});

const eight = document.querySelector("#eight");
eight.addEventListener("click", function (e) {
  addNum(8);
});

const seven = document.querySelector("#seven");
seven.addEventListener("click", function (e) {
  addNum(7);
});

const six = document.querySelector("#six");
six.addEventListener("click", function (e) {
  addNum(6);
});

const five = document.querySelector("#five");
five.addEventListener("click", function (e) {
  addNum(5);
});

const four = document.querySelector("#four");
four.addEventListener("click", function (e) {
  addNum(4);
});

const three = document.querySelector("#three");
three.addEventListener("click", function (e) {
  addNum(3);
});

const two = document.querySelector("#two");
two.addEventListener("click", function (e) {
  addNum(2);
});

const one = document.querySelector("#one");
one.addEventListener("click", function (e) {
  addNum(1);
});

const zero = document.querySelector("#zero");
zero.addEventListener("click", function (e) {
  addNum(0);
});
