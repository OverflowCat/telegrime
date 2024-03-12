const fs = require("fs");
let flypy = fs.readFileSync("flypy.txt", "utf-8");
flypy = flypy.split("\n"); //.splice(1, 55);
let dict = {};
let reverseDict = new Map();
flypy.map(x => {
  x = x.split(",");
  dict[x[0]] = x[1];
  reverseDict.set(x[1], x[0]);
});

// libre
flypy = fs.readFileSync("libre-flypy.txt", "utf-8");
flypy = flypy.split("\n");
flypy.map(x => {
    x = x.trim().split('\t');
    const [zi, ma] = x;
    if (reverseDict.has(ma)) return;
    let i = 1;
    while (dict[zi + "=" + i]) i++;
    dict[ma + "=" + i] = zi;
  }
)
flypy = null;

function 反查(ma) {
  return reverseDict.get(ma);
}

let lastcode,
  hzxr = "";
function lookup(word, w) {
  if (!w) w = 1;
  let res = dict[word + "=" + w];
  return res ? res : word;
}

function parse(input) {
  // parse '
  let _input = input.split("'");
  if (_input != [input]) {
    // 奇偶交替
    let is_raw = true;
    _input = _input.map(part => {
      is_raw = !is_raw;
      return is_raw ? part : up(part);
    });
    let res = _input.join("");
    return res;
  } else return input;
}

let xparse = input => [parse(input), lastcode, lookupAll(lastcode, true)];

function lookupAll(code, formatting) {
  if (code) code = lastcode;
  let results = [];
  for (let ele of [1, 2, 3, 4, 5]) {
    const res = lookup(code, ele);
    if (res == code) break;
    else results.push(formatting ? ele + "." + res : res);
  }
  if (results == []) results = [""];
  console.log(results);
  return formatting ? results.join(" / ") : results;
}

function up(input) {
  input = input + "␃";
  let chars = input.split("");
  let stack = "";
  let output = [];

  function dealWithStack() {
    console.log("==" + stack);
    if (!stack) return;
    lastcode = stack;
    output.push(
      /[0-9]$/.test(stack) ?
        lookup(stack.slice(0, -1), stack.charAt(stack.length - 1)) : lookup(stack));
    stack = "";
  }

  const punctuations = (",./?<>~!'[{]}" + '"\\').split("");
  let allowMoreSpaces = false;
  let i = chars.length;
  while (i > 0) {
    i = i - 1;
    var char = chars.shift();
    //console.log(char);
    let puncflag = false;
    console.log({ char, stack });
    if ((char === " " && allowMoreSpaces) || char === "␃") {
      if (stack) dealWithStack();
    } else if (char === " " && !allowMoreSpaces) {
      console.info('空格', { stack })
      stack ? dealWithStack() : output.push(" ");
    } else if (/^[0-9]$/.test(char)) {
      console.info("带数字的长度 < 4 的码", { char, stack });
      if (stack) {
        stack += char;
        dealWithStack();
      } else {
        output += char;
      }
    } else if (/* puncflag!= false && */ punctuations.indexOf(char) != -1) {
      /* if (puncflag === 1) stack = "";
      else */ dealWithStack();
      switch (char) {
        case ".":
          output.push("。");
          break;
        case ",":
          output.push("，");
          break;
        case "!":
          output.push("！");
          break;
        case "?":
          output.push("？");
          break;
      }
      stack = "";
      //if (/(\.|,|\/)/.test(char)){
    }
    else if (stack.length == 4) {
      console.log("stack length is 4", { char, stack })
      if (/^[0-9]$/.test(char)) {
        console.log({ char }, "is ^[0-9]$")
        stack += char;
        dealWithStack();
      }
      else {
        dealWithStack();
        stack = char;
      }
      let puncflag = 1;
    } else if (/[a-z]/.test(char)) {
      console.log("char is [a-z]", { char, stack });
      stack += char;
    } else if (/[A-Z]/.test(char)) {
      stack ? dealWithStack() : output.push(char);
    } else {
      puncflag = 2;
    }
    
    //else if (chars === []) dealWithStack();
  }
  //if (stack) dealWithStack();
  return output.join("");
}

module.exports = { up, parse, xparse, 反查 };
