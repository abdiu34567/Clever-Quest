function generateHiddenString(input) {
    // Replace spaces with underscores and other characters with spaces
    const sanitizedInput = input.replace(/[^a-zA-Z ]/g, ' ');

    // Split the sanitized input into words
    const words = sanitizedInput.split(' ');

    // Create an array of underscore strings with the same length as each word
    const underscoreStrings = words.map(word => '➖'.repeat(word.length));

    // Join the underscore strings with spaces
    const result = underscoreStrings.join(' ');

    return result;
}





function replaceSubstringAtIndex(originalString, index, newChar) {

   if (index < 0 || index >= originalString.length) {
        console.error("Invalid index. Index should be within the bounds of the original string.");
        return originalString;
    }

    const updatedString =
        originalString.slice(0, index) + newChar + originalString.slice(index + newChar.length);

    return updatedString;
}





function indexOfElementInString(element, searchString) {
    const index = searchString.indexOf(element);

    if (index !== -1) {
        // Element found, return the index
        return index + 1; // Adding 1 to make it 1-based index
    } else {
        // Element not found, return 0 or false
        return 0; // You can also return `false` instead of 0 if you prefer
    }
}





function replaceFirstOccurrence(inputString, targetChar, replacementChar) {
    const index = inputString.indexOf(targetChar);

    if (index !== -1) {
        const updatedString =
            inputString.substring(0, index) +
            replacementChar +
            inputString.substring(index + 1);

        return updatedString;
    }

    return inputString; // If the targetChar is not found, return the original string
}






/**
 * Check if Game is ended, by just simply checking
 * if all characters except space are replaced with hashtags
 */
function isGameEnded(str, char = "#") {
    // Create a regular expression to match the pattern
    const regex = new RegExp(`^${char}*$`);

    // Remove spaces from the string and test if the modified string matches the pattern
    return regex.test(str.replace(/\s/g, ''));
}