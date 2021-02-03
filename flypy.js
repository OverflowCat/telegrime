const fs = require("fs");
let flypy = fs.readFileSync("flypy.txt", "utf-8");
flypy = flypy.split("\n"); //.splice(1, 55);
flypy = flypy.map(x => {
  x = x.split(",");
  let a = x[0].split("=");
  a[1] = Number(a[1]);
  return a.concat(x[1]);
});

function up(input) {
  //let input = "xmzdu yyxu eewdd ksged,soyijiuiu do daf l ksge ye u m wftid.";
  input = input + " ";
  let chars = input.split("");
  let stack = "";
  let output = [];
  function lookup(word, w) {
    if (!w) {
      w = 1;
    }
    for (let x of flypy) {
      if (x[0] == word && x[1] == w) return x;
    }

    return ["", 0, ""];
  }

  function dealWithStack() {
    if (!stack) return;
    output.push(lookup(stack)[2]);
    stack = "";
  }
  const punctuations = (",./?<>~!'[{]}" + '"\\').split("");
  let allowMoreSpaces = true;
  let i = 100;
  while (i > 0) {
    i = i - 1;
    var char = chars.shift();
    //if (char) console.log(char);
    //console.log(char);
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
      }
      //if (/(\.|,|\/)/.test(char)){
    }
  }
  return output.join("");
}

module.exports = {up}