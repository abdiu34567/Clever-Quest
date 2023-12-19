function gameTemplate(image, string, character, difficulty, players) {
    return (
        `🧠💡 <b>Difficulty:</b> <code>${difficulty}</code>\n\n` +
        `<b>${players || '👤'}</b>` +
        `<pre>🎨 Emoji Puzzle Time! 🎨\n\n\n` +
        `Guess the Emoji: ${image}\n\n` +
        `Status: ${string}\n\n\n` +
        `<b>Your Turn! Choose a Letter:</b> <code>${character || '🔖'}</code> </pre>`
    )
}

function winnerTemplate(winner, players, emoji, name) {
    return (
        `🎮👥 <b>Players:\n\n` +
        `${players}\n` +
        `🎮 Game:\n\n` +
        `   ▫️ Emoji: <code>${emoji}</code>\n` +
        `   ▫️ Name: <code>${name}</code>\n\n\n` +
        `🌟 Emoji Puzzle Winner!</b> 🌟\n\n` +
        `         ${winner} 🎉🏆 \n\n\n` +
        `Thanks to everyone for participating.\n` +
        `Join us again tomorrow for more brain-teasing questions! 🧠💡`)
}

function generatePlayersTemplate(player, char) {
    return (` 👤 ${player} : ${char}\n`)
}
