
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function kbds() {
  // Original inline_keyboard
  const originalInlineKeyboard = [
    [
      { text: "A", callback_data: "A" },
      { text: "B", callback_data: "B" },
      { text: "C", callback_data: "C" },
      { text: "D", callback_data: "D" },
      { text: "E", callback_data: "E" },
      { text: "F", callback_data: "F" },
      { text: "G", callback_data: "G" },
    ],
    [
      { text: "H", callback_data: "H" },
      { text: "I", callback_data: "I" },
      { text: "J", callback_data: "J" },
      { text: "K", callback_data: "K" },
      { text: "L", callback_data: "L" },
      { text: "M", callback_data: "M" },
      { text: "N", callback_data: "N" },
      { text: "O", callback_data: "O" },
    ],
    [
      { text: "P", callback_data: "P" },
      { text: "Q", callback_data: "Q" },
      { text: "R", callback_data: "R" },
      { text: "S", callback_data: "S" },
      { text: "T", callback_data: "T" },
      { text: "U", callback_data: "U" },
      { text: "V", callback_data: "V" },
      { text: "W", callback_data: "W" },
    ],
    [
      { text: "X", callback_data: "X" },
      { text: "Y", callback_data: "Y" },
      { text: "Z", callback_data: "Z" },
    ],
  ];

  // Shuffle each inner array
  const shuffledInlineKeyboard = originalInlineKeyboard.map((row) => shuffle([...row]));

  // Shuffle the order of the rows
  const finalShuffledKeyboard = shuffle(shuffledInlineKeyboard);

  return {
    inline_keyboard: finalShuffledKeyboard,
  };
}
