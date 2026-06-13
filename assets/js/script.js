const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent;

    if (value === "C") {
      display.value = "";
    } else if (value === "=") {
      try {
        let resultado = eval(display.value);
        display.value = resultado;
      } catch (error) {
        display.value = "erro";
      }
    } else if (value === "⌫") {
      display.value = display.value.slice(0, -1);
    } else {
      display.value += value;
    }
  });
});
