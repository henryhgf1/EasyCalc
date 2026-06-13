const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

const ERROR_MESSAGES = ["Erro", "Divisão por zero", "Erro de sintaxe"];
function isErrorState() {
  return ERROR_MESSAGES.includes(display.value);
}
function lastChar() {
  return display.value.slice(-1);
}

function canAddOperator(value) {
  if (isErrorState()) return true;
  if (display.value === "") return value === "-";
  return !"+-*/".includes(lastChar());
}

function canAddDot() {
  if (isErrorState()) return true;
  const parts = display.value.split(/[+\-*/]/);
  const lastNum = parts[parts.length - 1];
  return !lastNum.includes(".");
}
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent;

    if (value === "C") {
      display.value = "";
    } else if (value === "=") {
      try {
        const result = eval(display.value);
        if (!isFinite(result)) {
          display.value = "Divisão por zero";
        } else {
          display.value = result;
        }
      } catch {
        display.value = "Erro de sintaxe";
      }
    } else if (value === "⌫") {
      display.value = display.value.slice(0, -1);
    } else {
      if (isErrorState()) display.value = "";

      if ("+-*/".includes(value)) {
        if ("+-*/".includes(lastChar()) && display.value !== "") {
          if (lastChar() !== value) {
            display.value = display.value.slice(0, -1) + value;
          }
          return;
        }
        if (!canAddOperator(value)) return;
      } else if (value === ".") {
        if (!canAddDot()) return;
        if (display.value === "") {
          display.value = "0.";
          return;
        }
      }
      display.value += value;
    }
  });
});

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (key === "Enter") {
    try {
      const result = eval(display.value);
      if (!isFinite(result)) {
        display.value = "Divisão por zero";
      } else {
        display.value = result;
      }
    } catch {
      display.value = "Erro de sintaxe";
    }
  } else if (key === "Backspace") {
    display.value = display.value.slice(0, -1);
  } else if (key === " ") {
    display.value = "";
  } else if (!isNaN(key) || "+-*/.=".includes(key)) {
    if (isErrorState()) display.value = "";

    if ("+-*/".includes(key)) {
      if ("+-*/".includes(lastChar()) && display.value !== "") {
        if (lastChar() !== key) {
          display.value = display.value.slice(0, -1) + key;
        }
        return;
      }
      if (!canAddOperator(key)) return;
    } else if (key === ".") {
      if (!canAddDot()) return;
      if (display.value === "") {
        display.value = "0.";
        return;
      }
    }
    display.value += key;
  }
});
