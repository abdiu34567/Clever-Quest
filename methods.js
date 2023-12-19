//Get text that is been sent With Inline-query
function getTextCbk(ctx) {
    return ctx.message.message.text
}


//Get callback_data from the Inline-query
function getCbkdata(ctx) {
    return ctx.message.data
}
