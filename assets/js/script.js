const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent;

    if (value === "C") {
      display.value = "";
    } else if (value === "=") {
      try {
        display.value = eval(display.value);
      } catch {
        display.value = "Erro";
      }
    } else if (value === "⌫") {
      display.value = display.value.slice(0, -1);
    } else {
      display.value += value;
    }
  });
});

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (key === "Enter") {
    try {
      display.value = eval(display.value);
    } catch {
      display.value = "Erro";
    }
  } else if (key === "Backspace") {
    display.value = display.value.slice(0, -1);
  } else if (key === " ") {
    display.value = "";
  } else if (!isNaN(key) || "+-*/.=".includes(key)) {
    display.value += key;
  }
});
