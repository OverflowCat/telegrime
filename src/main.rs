use teloxide::{
    prelude2::*,
    types::{
        InlineQueryResult, InlineQueryResultArticle, InputMessageContent, InputMessageContentText,
    },
    Bot,
};

use lazy_static::lazy_static;

mod table;

fn parse_long(text: &str) -> String {
    String::from("")
}

#[tokio::main]
async fn main() {
    lazy_static! {
        static ref MABIAO: table::Mabiao = table::flypy().unwrap();
    }
    teloxide::enable_logging!();
    log::info!("Starting TelegrIMEbot v2...");
    // let token = env::var("TELEGRIME").expect("TELEGRIME bot token not found");
    let token = "1502134572:xxxxxxxxxx";
    let proxy = reqwest::Proxy::all("http://127.0.0.1:11224").expect("Creating proxy");
    let client = reqwest::Client::builder()
        .proxy(proxy)
        .build()
        .expect("creating reqwest::Client");

    let bot = Bot::with_client(token, client).auto_send();

    /*     teloxide::repls2::repl(bot, |message: Message, bot: AutoSend<Bot>| async move {
        bot.send_dice(message.chat.id).await?;
        respond(())
    })
    .await; */

    // inline query
    let handler = Update::filter_inline_query().branch(dptree::endpoint(
        |query: InlineQuery, bot: AutoSend<Bot>| async move {
            // First, create your actual response
            let key = query.query.clone();
            let res = match (MABIAO.table).get(&(key, 1)) {
                Some(value) => value.clone(),
                None => String::from("(空)"),
            };
            let article1 = InlineQueryResultArticle::new(
                // Each item needs a unique ID, as well as the response container for the
                // items. These can be whatever, as long as they don't
                // conflict.
                "01".to_string(),
                // What the user will actually see
                query.query.clone(),
                // What message will be sent when clicked/tapped
                InputMessageContent::Text(InputMessageContentText::new(format!("{}", res,))),
            ).description(format!("{}‸", res)).thumb_url(reqwest::Url::parse("http://telegra.ph/file/a8a78f809e7dcb1f11351.png").unwrap());
            // While constructing them from the struct itself is possible, it is preferred
            // to use the builder pattern if you wish to add more
            // information to your result. Please refer to the documentation
            // for more detailed information about each field. https://docs.rs/teloxide/latest/teloxide/types/struct.InlineQueryResultArticle.html
/*             let ddg_search = InlineQueryResultArticle::new(
                "02".to_string(),
                "DuckDuckGo Search".to_string(),
                InputMessageContent::Text(InputMessageContentText::new(format!(
                    "https://duckduckgo.com/?q={}",
                    query.query.clone()
                ))),
            )
            .description("DuckDuckGo Search")
            .thumb_url(
                "https://duckduckgo.com/assets/logo_header.v108.png"
                    .parse()
                    .unwrap(),
            )
            .url("https://duckduckgo.com/about".parse().unwrap()); // Note: This is the url that will open if they click the thumbnail */

            let results = vec![
                InlineQueryResult::Article(article1),
/*                 InlineQueryResult::Article(ddg_search), */
            ];

            // Send it off! One thing to note -- the ID we use here must be of the query
            // we're responding to.
            let response = bot.answer_inline_query(&query.id, results).send().await;
            if let Err(err) = response {
                log::error!("Error in handler: {:?}", err);
            }
            respond(())
        },
    ));

    Dispatcher::builder(bot, handler)
        .build()
        .setup_ctrlc_handler()
        .dispatch()
        .await;
}
