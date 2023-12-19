function doPost(e) {
  const token = "your_bot_token";
  const bot = new Telesun(token, e);

  bot.Command(/start/, sendGame);

  bot.Command("automation@clever_quest_game_bot", automation);

  bot.Command("delete_automation@clever_quest_game_bot", deleteAutomation);

  bot.Cbquery(game);
}
