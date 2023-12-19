//run this function by clicking run button on apps script editor
function SettingWebHook() {
  // find from bot father
  let botToken = "your_bot_token";

  //you will found the url after you deploy your code
  let webhookUrl = "web_app_url_where_your_app_hosted";
  setWebHook(botToken, { url: webhookUrl });
}

//run this function by clicking run button and selecting deletingWebHook function
function deletingWebHook() {
  let botToken = "your_bot_token";
  deleteWebhook(botToken);
}
