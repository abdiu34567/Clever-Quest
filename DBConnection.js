function DBConnection() {
  return sheetConnect("your_spreadsheet_id", "your_sheet_Name");
}

function getEmojiAndName() {
  const next_row = getNext() || 0;

  DBConnection();
  const data = SheetDB.getValues(next_row, 1, 1, 3);

  return {
    emoji: data[0][0],
    name: data[0][1],
    difficulty: data[0][2],
  };
}
