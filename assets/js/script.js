const display = document.getElementById("display");
const buttons = document.querySelectorAll("button:not(.hist-btn):not(.theme-btn)");
const historyEl = document.getElementById("history");
const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
  document
    .querySelector(".calculator")
    .classList.toggle("light", theme === "light");
  themeToggle.textContent = theme === "light" ? "🌙" : "☀️";
  localStorage.setItem("theme", theme);
}

const savedTheme = localStorage.getItem("theme") || "dark";
applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const current = document
    .querySelector(".calculator")
    .classList.contains("light")
    ? "light"
    : "dark";
  applyTheme(current === "light" ? "dark" : "light");
});
let history = [];
let historyVisible = true;
let justCalculated = false;

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
      justCalculated = false;
    } else if (value === "=") {
      try {
        const expression = display.value;
        const result = calculate(expression);
        display.value = result;
        justCalculated = true;
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
      if (justCalculated && !"+-*/".includes(value)) {
        display.value = "";
        justCalculated = false;
      }

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
  let key = event.key;
  if (event.code.startsWith("Numpad")) {
    const NUMPAD_MAP = {
      Numpad0: "0",
      Numpad1: "1",
      Numpad2: "2",
      Numpad3: "3",
      Numpad4: "4",
      Numpad5: "5",
      Numpad6: "6",
      Numpad7: "7",
      Numpad8: "8",
      Numpad9: "9",
      NumpadAdd: "+",
      NumpadSubtract: "-",
      NumpadMultiply: "*",
      NumpadDivide: "/",
      NumpadDecimal: ".",
      NumpadEnter: "Enter",
    };
    if (NUMPAD_MAP[event.code]) {
      key = NUMPAD_MAP[event.code];
    }
  }

  if (key === "Enter") {
    event.preventDefault();
    try {
      const expression = display.value;
      const result = calculate(expression);
      display.value = result;
      justCalculated = true;
      addHistory(expression, result);
    } catch (error) {
      display.value =
        error.message === "Divisão por zero"
          ? "Divisão por zero"
          : "Erro de sintaxe";
    }
  } else if (key === "Backspace") {
    event.preventDefault();
    display.value = display.value.slice(0, -1);
  } else if (key === " ") {
    event.preventDefault();
    display.value = "";
    justCalculated = false;
  } else if (!isNaN(key) || "+-*/.=%".includes(key)) {
    event.preventDefault();
    if (isErrorState(display.value)) display.value = "";
    if (justCalculated && !"+-*/".includes(key)) {
      display.value = "";
      justCalculated = false;
    }

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
