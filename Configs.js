function getNext() {
    const nextGame = PropertiesService.getScriptProperties().getProperty('next')
    return Number(nextGame)
}


function setNext(next) {
    PropertiesService.getScriptProperties().setProperty("next", next)
}


function setImojiAndName(emoji, name, difficulty) {
    PropertiesService.getScriptProperties().setProperties(
        {
            emoji: emoji,
            name: name,
            update: name,
            difficulty: difficulty,
            player: '',
            handler: ''
        })
}

function deleteEmojiAndName() {
    PropertiesService.getScriptProperties().deleteProperty("emoji")
}



function getData() {
    return PropertiesService.getScriptProperties().getProperties()
}



function setStringWithHashtagUpdates(update) {
    PropertiesService.getScriptProperties().setProperty("update", update)
}


function saveUpdatedString(update) {
    PropertiesService.getScriptProperties().setProperty("handler", update)
}


function getUpdatedString() {
    return PropertiesService.getScriptProperties().getProperty("handler")
}


function setPlayersTemplate(playerTemp) {
    PropertiesService.getScriptProperties().setProperty("player", playerTemp)
}

function getPlayersTemplate() {
    return PropertiesService.getScriptProperties().getProperty("player")
}



function setProgressOfTheGame(progress) {
    PropertiesService.getScriptProperties().setProperty("progres", progress)
}


function getProgressOfTheGame() {
    return PropertiesService.getScriptProperties().getProperty("progres")
}