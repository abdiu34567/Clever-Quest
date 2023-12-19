function CleaverQuestTrigger() {
  ScriptApp.newTrigger("Trigger").timeBased().atHour(12).everyDays(1).create();
}

function automation(ctx) {
  var triggers = ScriptApp.getProjectTriggers();

  if (triggers.length === 0) {
    CleaverQuestTrigger();
    ctx.replyWithHtml(
      "<b>#AUTOMATION_ON</b>\n\n" +
        "🌿 Game will be Sent at 12PM Tomorrow, see yaa 👋"
    );
  } else {
    ctx.replyWithHtml(
      "<b>#AlREADY_STARTED</b>\n\n" +
        "🌿 Trival Questy Bot Is Already Automated to always Send The Game at 12PM"
    );
  }
}

//fake ctx object just for triggering the automation
function Trigger() {
  const api = {
    update_id: 991350984,
    message: {
      message_id: 11325,
      from: {
        id: 1173180004,
        is_bot: false,
        first_name: "Me",
        last_name: "ab",
        username: "Me_abd",
        language_code: "en",
      },
      chat: {
        id: -1001531569026,
        title: "Talk Telesun Telegram Bots",
        username: "telesunjs",
        type: "supergroup",
      },
      text: "start",
    },
  };

  const e = {
    postData: {
      contents: JSON.stringify(api),
    },
  };

  const token = "your_token";

  const bot = new Telesun(token, e);

  bot.Use(sendGame);
}

function deleteAutomation(ctx) {
  const admin = "1173180004"; //manually set admin, "This is Me"

  if (admin == ctx.message.from.id) {
    // Deletes all triggers in the current project.
    var triggers = ScriptApp.getProjectTriggers();
    for (var i = 0; i < triggers.length; i++) {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  } else {
    return ctx.replyWithHtml(
      "<b>#ONLY_ADMIN</b>\n\n" + "👤 Admin Required to Delete the Automation"
    );
  }

  ctx.replyWithHtml(
    "<b>#AUTOMATION_DELETED</b>\n\n" +
      "🌿 See You Another Time, I will come back with Interesting futures."
  );
}
