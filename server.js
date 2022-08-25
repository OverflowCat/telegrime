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

bot.start(ctx => ctx.reply("请使用 inline 模式进行输入"));
bot.help(ctx => ctx.reply("请使用 inline 模式进行输入"));
bot.hears("hi", ctx => ctx.reply("Hey there"));

bot.on("inline_query", async ({ inlineQuery, answerInlineQuery }) => {
  const q = inlineQuery.query;
  console.log(q);
  if (!q) return;
  let xres = flypy.xparse(q);
  let res = xres[0];
  var results = [
    {
      type: "article",
      id: crc32(res),
      title: xres[1] + "‸  " + xres[2],
      thumb_url: "https://www.flypy.com/images/twxh.png",
      thumb_width: 54,
      thumb_height: 54,
      description: res,
      input_message_content: {
        message_text: res
      }
    }
  ];
  answerInlineQuery(results);
  return;
});

bot.launch();
