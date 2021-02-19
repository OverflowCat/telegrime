const fs = require("fs");
let flypy = fs.readFileSync("flypy.txt", "utf-8");
flypy = flypy.split("\n"); //.splice(1, 55);
let dict = {};
flypy.map(x => {
  x = x.split(",");
  dict[x[0]] = x[1];
});

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
  //let input = "xmzdu yyxu eewdd ksged,soyijiuiu do daf l ksge ye u m wftid.";
  input = input + "␃";
  let chars = input.split("");
  let stack = "";
  let output = [];

  function dealWithStack() {
    console.log("==" + stack);
    if (!stack) return;
    lastcode = stack;
    output.push(lookup(stack));
    stack = "";
  }
  const punctuations = (",./?<>~!'[{]}" + '"\\').split("");
  let allowMoreSpaces = true;
  let i = chars.length;
  while (i > 0) {
    /*if (stack.length == 4) {
      dealWithStack();
      stack = "";
    }*/
    i = i - 1;
    var char = chars.shift();
    //console.log(char);
    let puncflag = false;
    if ((char === " " && allowMoreSpaces) || char === "␃") {
      if (stack) dealWithStack();
    } else if (char === " " && !allowMoreSpaces) {
      stack ? dealWithStack() : output.push(" ");
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
      dealWithStack();
      stack = char;
      let puncflag = 1;
    } else if (/[a-z]/.test(char)) {
      stack = stack + char;
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

module.exports = { up, parse, xparse };
