var crc32 = function(r) {
  for (var a, o = [], c = 0; c < 256; c++) {
    a = c;
    for (var f = 0; f < 8; f++) a = 1 & a ? 3988292384 ^ (a >>> 1) : a >>> 1;
    o[c] = a;
  }
  for (var n = -1, t = 0; t < r.length; t++)
    n = (n >>> 8) ^ o[255 & (n ^ r.charCodeAt(t))];
  return ((-1 ^ n) >>> 0).toString(10);
};

const flypy = require("./flypy");

const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.TELEGRIME);

bot.start(ctx => ctx.reply("Welcome"));
bot.help(ctx => ctx.reply("Send me a sticker"));
bot.on("sticker", ctx => ctx.reply("👍"));
bot.hears("hi", ctx => ctx.reply("Hey there"));

bot.on("inline_query", async ({ inlineQuery, answerInlineQuery }) => {
  const q = inlineQuery.query;
  console.log(q);
  if (!q) return;
  let res = flypy.up(q);
  var results = [
    {
      type: "article",
      id: crc32(res),
      title: "FLYPY",
      description: res,
      input_message_content: {
        message_text: res
      }
    }
  ];
  return answerInlineQuery(results);
});

bot.launch();
