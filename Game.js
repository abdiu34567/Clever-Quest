/**
 * Only start New if there is no game in the progress
 * if there is in the progress, then the game in the progress will be loaded
 */
function sendGame(ctx) {
    ctx.replyWithChatAction("typing");

    const progress = getProgressOfTheGame();
    if (progress === "ON") { return loadGameInProgress(ctx) }
    setProgressOfTheGame("ON")

    const emoji_and_name = getEmojiAndName()
    const emoji = emoji_and_name.emoji;
    const name = emoji_and_name.name;
    const difficulty = emoji_and_name.difficulty;

    const string = generateHiddenString(name)
    const template = gameTemplate(emoji, string, null, difficulty, null)

    ctx.replyWithHtml(template, { reply_markup: kbds() })
    setImojiAndName(emoji, name, difficulty)

}

/**
 * Load Game which is already in progress.
 */
function loadGameInProgress(ctx) {

    const data = getData()
    const emoji = data.emoji;
    const difficulty = data.difficulty;
    const handler = getUpdatedString();

    const getPlayerTemplate = getPlayersTemplate() || '';

    const template = gameTemplate(emoji, handler, null, difficulty, getPlayerTemplate)

    ctx.replyWithHtml(template, { reply_markup: kbds() })
}


//Get Winner username if possible,
//unless get the first name only
function getWinner(ctx) {
    const username = (ctx.from.username) ? '@' + ctx.from.username : ''
    const first_name = ctx.from.first_name
    return username || first_name;
}




/**
 * Game Manager it self.
 */
function game(ctx) {

    var lock = LockService.getScriptLock();
    try {
        // wait up to 0.5 seconds for other processes
        lock.tryLock(500);

        ctx.replyWithChatAction("typing");

        let cbk_data = getCbkdata(ctx).toUpperCase();
        const cbk_text = getTextCbk(ctx);
        const string = updatedString(cbk_text)

        const data = getData()
        const emoji = data.emoji;
        const name = data.name;
        const update = data.update.toUpperCase();
        const difficulty = data.difficulty;

        if (!emoji) { return }

        let updated_string = '';
        let playersTemp = '';
        let stat = '';

        const old_player_template = getPlayersTemplate() || '';

        //get Index of character where to replace
        const index = indexOfElementInString(cbk_data, update)

        //Pizza will be #izza after "p" is detected
        //this is important when identical characters found
        const chars_replaced_with_hashtags = replaceFirstOccurrence(update, cbk_data, "#")


        //if the character is found
        if (index) {
            //Replace The Correct Character to the Correct Index of "-"
            updated_string = replaceSubstringAtIndex(string, index - 1, cbk_data)
            stat = '✅'

            const playerName = getWinner(ctx)
            const playerTemp = generatePlayersTemplate(playerName, cbk_data)
            playersTemp = old_player_template + playerTemp;

        } else {
            updated_string = string
            stat = '❌';
            playersTemp = old_player_template
        }


        //when all characters except spaces are replaced with "#"
        if (isGameEnded(chars_replaced_with_hashtags)) {

            const winner = getWinner(ctx)
            const winner_template = winnerTemplate(winner, playersTemp, emoji, name)
            realTimeUpdateTheWinnerFromAllChat(winner_template, ctx)

            return setTheNextGame()
        }


        //generate Game template With updates 
        const template = gameTemplate(
            emoji,
            updated_string,
            stat,
            difficulty,
            playersTemp)


        try {
            ctx.replyWithEditedMessage(template, {
                parse_mode: "HTML",
                reply_markup: kbds()
            });
        } catch (err) { }

        //save chats from where the game is being played.
        saveChats(ctx)

        setStringWithHashtagUpdates(chars_replaced_with_hashtags);
        saveUpdatedString(updated_string)

        //save players template
        if (index) { setPlayersTemplate(playersTemp); }

        checkIfTheGameIsAlreadyEnded(emoji, cbk_text, ctx)

    } finally {
        lock.releaseLock();
    }

}

/**
 * Show If the Game is already expired!
 */
function checkIfTheGameIsAlreadyEnded(emoji, cbktext, ctx) {
    const text = cbktext.split("Emoji:")[1];
    const emojiFromBot = text.split("\n\n")[0].trim()

    if (emojiFromBot !== emoji) {
        return ctx.replyWithEditedMessage("THE GAME IS EXPIRED ALREADY." +
            "\n\n USE /start TO START THE NEW GAME.")
    }
}

/**
 * SETTING UP FOR NEXT GAME
 */
function setTheNextGame() {
    const next = getNext()
    PropertiesService.getScriptProperties().setProperties(
        {
            next: Number(next) + 1,
            progres: "OFF"
        })

    //Delete Those Property, for the Next Game.
    PropertiesService.getScriptProperties().deleteProperty('emoji')
    PropertiesService.getScriptProperties().deleteProperty('name')
    PropertiesService.getScriptProperties().deleteProperty('update')
    PropertiesService.getScriptProperties().deleteProperty('difficulty')
    PropertiesService.getScriptProperties().deleteProperty('player')
    PropertiesService.getScriptProperties().deleteProperty('handler')
}


/**
 * Get The Updated String Which is Replaced 
 * With The Correct Character
 */
function updatedString(cbkText) {
    var string = ''

    const last_saved_string = getUpdatedString();
    if (!last_saved_string) {
        const text = cbkText.split("Status:")[1];
        string = text.split("\n\n")[0].trim()
    } else string = last_saved_string

    return string;
}



/**
 * Save chats Id of all chats, from which the Game is being played
 */
function saveChats(ctx) {
    const chatId = ctx.message.message.chat.id;
    const messageId = ctx.message.message.message_id;
    const getChatIds = PropertiesService.getScriptProperties().getProperty("chats") || '';

    if (!getChatIds) {
        PropertiesService.getScriptProperties().setProperty("chats", `${chatId}_${messageId}`)
    }

    else if (getChatIds.includes(chatId)) { return }

    PropertiesService.getScriptProperties().setProperty("chats", `${chatId}_${messageId}#${getChatIds}`)
}

/**
 * Update The Winner From All Chats In real time.
 */
function realTimeUpdateTheWinnerFromAllChat(template, ctx) {
    const getChats = PropertiesService.getScriptProperties().getProperty("chats") || '';
    if (!getChats) { return }
    const chats = getChats.split("#");
    try {
        for (i = 0; i <= chats.length - 2; i++) {
            const element = chats[i];
            const chatId = element.split("_")[0];
            const message_id = element.split("_")[1]
            ctx.editMessageText({
                chat_id: chatId,
                message_id: message_id,
                text: template,
                parse_mode: "HTML",
            });
        }

        PropertiesService.getScriptProperties().deleteProperty("chats")
    } catch (err) { console.log(err) }
}