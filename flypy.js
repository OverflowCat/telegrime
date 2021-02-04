const fs = require("fs");
let flypy = fs.readFileSync("flypy.txt", "utf-8");
flypy = flypy.split("\n"); //.splice(1, 55);
let dict = {};
flypy.map(x => {
  x = x.split(",");
  dict[x[0]] = x[1];
});

function lookup(word, w) {
  if (!w) w = 1;
  let res = dict[word + "=" + w];
  return res ? res : word;
}

function parse(input) {
  // parse '
  let _input = input.split("'");
  if (_input !== [input]) {
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
function up(input) {
  //let input = "xmzdu yyxu eewdd ksged,soyijiuiu do daf l ksge ye u m wftid.";
  input = input + " ";
  let chars = input.split("");
  let stack = "";
  let output = [];

  function dealWithStack() {
    if (!stack) return;
    output.push(lookup(stack));
    stack = "";
  }
  const punctuations = (",./?<>~!'[{]}" + '"\\').split("");
  let allowMoreSpaces = true;
  let i = 100;
  while (i > 0) {
    i = i - 1;
    var char = chars.shift();
    if (char === " " && allowMoreSpaces) {
      stack ? dealWithStack() : output.push(" ");
    } else if (stack.length == 4) {
      dealWithStack();
      stack = char;
    } else if (char === " " && !allowMoreSpaces) {
      stack ? dealWithStack() : output.push(" ");
    } else if (/[a-z]/.test(char)) {
      stack = stack + char;
    } else if (/[A-Z]/.test(char)) {
      stack ? dealWithStack() : output.push(char);
    } else if (punctuations.indexOf(char) != -1) {
      switch (char) {
        case ".":
          dealWithStack();
          output.push("。");
          break;
        case ",":
          dealWithStack();
          output.push("，");
          break;
        case "!":
          dealWithStack();
          output.push("！");
          break;
        case "?":
          dealWithStack();
          output.push("？");
          break;
      }
      //if (/(\.|,|\/)/.test(char)){
    }
  }
  return output.join("");
}

module.exports = { up, parse };
