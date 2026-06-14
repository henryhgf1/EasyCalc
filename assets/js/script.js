const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");
const historyEl = document.getElementById("history");
let history = [];
let historyVisible = true;

document.getElementById("histToggle").addEventListener("click", () => {
  historyVisible = !historyVisible;
  document.getElementById("history").classList.toggle("collapsed");
  document.getElementById("histToggle").textContent = historyVisible
    ? "⌃"
    : "⌄";
});

document.getElementById("histClear").addEventListener("click", () => {
  history = [];
  renderHistory();
});
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent;

    if (value === "C") {
      display.value = "";
    } else if (value === "=") {
      try {
        const expression = display.value;
        const result = calculate(expression);
        display.value = result;
        addHistory(expression, result);
      } catch (error) {
        display.value =
          error.message === "Divisão por zero"
            ? "Divisão por zero"
            : "Erro de sintaxe";
      }
    } else if (value === "⌫") {
      display.value = display.value.slice(0, -1);
    } else if (value === "%") {
      if (isErrorState(display.value)) return;
      const match = display.value.match(/(\d+\.?\d*)$/);
      if (match) {
        const lastNum = parseFloat(match[1]);
        display.value =
          display.value.slice(0, -match[1].length) + lastNum / 100;
      }
    } else if (value === "±") {
      display.value = toggleSign(display.value);
    } else {
      if (isErrorState(display.value)) display.value = "";

      if ("+-*/".includes(value)) {
        if ("+-*/".includes(lastChar(display.value)) && display.value !== "") {
          if (lastChar(display.value) !== value) {
            display.value = display.value.slice(0, -1) + value;
          }
          return;
        }
        if (!canAddOperator(display.value, value)) return;
      } else if (value === ".") {
        if (!canAddDot(display.value)) return;
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
      const expression = display.value;
      const result = calculate(expression);
      display.value = result;
      addHistory(expression, result);
    } catch (error) {
      display.value =
        error.message === "Divisão por zero"
          ? "Divisão por zero"
          : "Erro de sintaxe";
    }
  } else if (key === "Backspace") {
    display.value = display.value.slice(0, -1);
  } else if (key === " ") {
    display.value = "";
  } else if (!isNaN(key) || "+-*/.=%".includes(key)) {
    if (isErrorState(display.value)) display.value = "";

    if ("+-*/".includes(key)) {
      if ("+-*/".includes(lastChar(display.value)) && display.value !== "") {
        if (lastChar(display.value) !== key) {
          display.value = display.value.slice(0, -1) + key;
        }
        return;
      }
      if (!canAddOperator(display.value, key)) return;
    } else if (key === ".") {
      if (!canAddDot(display.value)) return;
      if (display.value === "") {
        display.value = "0.";
        return;
      }
    } else if (key === "%") {
      if (isErrorState(display.value)) return;
      const match = display.value.match(/(\d+\.?\d*)$/);
      if (match) {
        const lastNum = parseFloat(match[1]);
        display.value =
          display.value.slice(0, -match[1].length) + lastNum / 100;
      }
    }
    display.value += key;
  }
});

function renderHistory() {
  const entries = document.getElementById("historyEntries");
  entries.innerHTML = history
    .map(
      (item) =>
        `<p><span class="hist-expr">${item.expression} =</span><span class="hist-result">${item.result}</span></p>`,
    )
    .join("");
  entries.scrollTop = entries.scrollHeight;
}

function addHistory(expression, result) {
  history.push({ expression, result });
  if (history.length > 10) history.shift();
  if (!historyVisible) {
    historyVisible = true;
    document.getElementById("history").classList.remove("collapsed");
    document.getElementById("histToggle").textContent = "⌃";
  }
  renderHistory();
}
