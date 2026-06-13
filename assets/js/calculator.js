const ERROR_MESSAGES = ["Erro", "Divisão por zero", "Erro de sintaxe"];

function isErrorState(value) {
  return ERROR_MESSAGES.includes(value);
}

function lastChar(str) {
  return str.slice(-1);
}

function canAddOperator(displayValue, value) {
  if (isErrorState(displayValue)) return true;
  if (displayValue === "") return value === "-";
  return !"+-*/".includes(lastChar(displayValue));
}

function canAddDot(displayValue) {
  if (isErrorState(displayValue)) return true;
  const parts = displayValue.split(/[+\-*/]/);
  const lastNum = parts[parts.length - 1];
  return !lastNum.includes(".");
}

function calculate(expression) {
  {
    if (expression === "") return "";

    const tokens = expression.match(/\d+(\.\d+)?|[+\-*/]/g);
    if (!tokens) return "";

    const nums = [];
    const ops = [];

    for (let i = 0; i < tokens.length; i++) {
      if (/^\d+(\.\d+)?$/.test(tokens[i])) {
        nums.push(parseFloat(tokens[i]));
      } else if ("+-*/".includes(tokens[i])) {
        if (tokens[i] === "-" && (i === 0 || "+-*/".includes(tokens[i - 1]))) {
          i++;
          nums.push(-parseFloat(tokens[i]));
        } else {
          ops.push(tokens[i]);
        }
      }
    }
    while (ops.length > 0 && ops.length >= nums.length) {
      ops.pop();
    }
    for (let i = 0; i < ops.length; i++) {
      if (ops[i] === "*") {
        nums[i] = nums[i] * nums[i + 1];
        nums.splice(i + 1, 1);
        ops.splice(i, 1);
        i--;
      } else if (ops[i] === "/") {
        if (nums[i + 1] === 0) throw new Error("Divisão por zero");
        nums[i] = nums[i] / nums[i + 1];
        nums.splice(i + 1, 1);
        ops.splice(i, 1);
        i--;
      }
    }
    let result = nums[0] || 0;
    for (let i = 0; i < ops.length; i++) {
      if (ops[i] === "+") result += nums[i + 1];
      else result -= nums[i + 1];
    }
    return result;
  }
}
