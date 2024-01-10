var crc32 = function (r) {
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
const tiger = require("./tiger");

const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.TELEGRIME);

bot.start(ctx => ctx.reply("我是一个支持小鹤音形和虎码输入的机器人。请使用 inline 模式进行输入。"));
bot.help(ctx => ctx.reply("我是一个支持小鹤音形和虎码输入的机器人。请使用 inline 模式进行输入。"));

bot.on("inline_query", async ({ inlineQuery, answerInlineQuery }) => {
  const q = inlineQuery.query;
  console.log(q);
  if (!q) return;
  let flypy_result = flypy.xparse(q);
  let flypy_first_result = flypy_result[0];
  let tiger_result = tiger.xparse(q);
  let tiger_first_result = tiger_result[0];
  const results = [
    {
      type: "article",
      id: crc32(flypy_first_result),
      title: flypy_result[1] + "‸  " + flypy_result[2],
      thumb_url: "https://www.flypy.com/images/twxh.png",
      thumb_width: 54,
      thumb_height: 54,
      description: flypy_first_result,
      input_message_content: {
        message_text: flypy_first_result ? flypy_first_result : "…"
      },
    },
    {
      type: "article",
      id: crc32("tiger" + tiger_first_result),
      title: tiger_result[1] + "‸  " + tiger_result[2],
      thumb_url: "https://tiger-code.com/images/brand.png",
      thumb_width: 54,
      thumb_height: 28,
      description: tiger_first_result,
      input_message_content: {
        message_text: tiger_first_result ? tiger_first_result : "…"
      }
    }
  ];
  try {
    await answerInlineQuery(results);
  } catch (e) { }
  return;
});

bot.launch();
