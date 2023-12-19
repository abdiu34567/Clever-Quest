const Context = {
  api: undefined, //Default returned

  get message() {

    let api = this.api;

    if (!api) { return };


    const messageProperties = [
      'message', //.chat && .from?=undefined
      'edited_message',//
      'channel_post',//
      'edited_channel_post',//

      'my_chat_member',//.chat & .from
      'chat_member',//
      'chat_join_request',//

      'inline_query', //.from && X	
      'chosen_inline_result', //
      'shipping_query',//
      'pre_checkout_query',//

      'poll_answer',//.user

      'callback_query',//.from && message.from && message.chat

      'poll',//id #unique poll identifier
    ];

    for (const prop of messageProperties) {
      if (api[prop]) {
        return api[prop];
      }
    }

    return undefined;
  },

  /** Only available on groups anc channels */
  get chat() {
    let message = this.message;
    if (!message) { return }
    return message.chat || message.message?.chat || undefined;
  },

  //always available
  get from() {
    let message = this.message;
    if (!message) { return }
    return message.from;
  },


  /**
   * Reply Message anywhere
   * @param {string|number} Message - message to reply
   * @param {object} Param - Object Parameter to send message
   * @param {number} [Param.message_thread_id] - Unique identifier for the target message thread (topic) of the forum; for forum supergroups only
   * @param {object} [Param.reply_markup] - object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user
   * @param {string} [Param.parse_mode] - Mode for parsing entities in the message text
   * @param {object} [Param.entities] - list of special entities that appear in message text, which can be specified instead of parse_mode
   * @param {boolean} [Param.disable_web_page_preview] - Disables link previews for links in this message
   * @param {boolean} [Param.disable_notification] - Sends the message silently. Users will receive a notification with no sound
   * @param {boolean} [Param.protect_content] - Protects the contents of the sent message from forwarding and saving
   * @param {number} [Param.reply_to_message_id] - If the message is a reply, ID of the original message
   * @param {boolean} [Param.allow_sending_without_reply] - Pass True, if the message should be sent even if the specified replied-to message is not found
   * @returns the sent Message
   */
  reply(Message, Param) {
    const chat = this.chat || this.from || this.user || undefined
    if (!chat || !chat.id) { throw new Error('Chat_id Not Found.') }
    let req = rM_({ chat_id: chat.id, text: Message }, Param);
    return this.sendMessage(req);
  },

  /**
   * Reply Message With HTML
   * @param {string|number} Message
   * @param {object} Param - Object Parameter to send message
   * @param {number} [Param.message_thread_id] - Unique identifier for the target message thread (topic) of the forum; for forum supergroups only
   * @param {object} [Param.reply_markup] - object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user
   * @param {object} [Param.entities] - list of special entities that appear in message text, which can be specified instead of parse_mode
   * @param {boolean} [Param.disable_web_page_preview] - Disables link previews for links in this message
   * @param {boolean} [Param.disable_notification] - Sends the message silently. Users will receive a notification with no sound
   * @param {boolean} [Param.protect_content] - Protects the contents of the sent message from forwarding and saving
   * @param {number} [Param.reply_to_message_id] - If the message is a reply, ID of the original message
   * @param {boolean} [Param.allow_sending_without_reply] - Pass True, if the message should be sent even if the specified replied-to message is not found
   * @returns the sent Message
   */
  replyWithHtml(Message, Param) {
    const chat = this.chat || this.from || this.user || undefined
    if (!chat || !chat.id) { throw new Error('Chat_id Not Found.') }
    let req = rM_({ chat_id: chat.id, text: Message, parse_mode: "HTML" }, Param);
    return this.sendMessage(req);
  },

  /**
   * Reply Message With Markdown anywhere
   * @param {string|number} Message
   * @param {object} Param - Object Parameter to send message
   * @param {number} [Param.message_thread_id] - Unique identifier for the target message thread (topic) of the forum; for forum supergroups only
   * @param {object} [Param.reply_markup] - object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user
   * @param {object} [Param.entities] - list of special entities that appear in message text, which can be specified instead of parse_mode
   * @param {boolean} [Param.disable_web_page_preview] - Disables link previews for links in this message
   * @param {boolean} [Param.disable_notification] - Sends the message silently. Users will receive a notification with no sound
   * @param {boolean} [Param.protect_content] - Protects the contents of the sent message from forwarding and saving
   * @param {number} [Param.reply_to_message_id] - If the message is a reply, ID of the original message
   * @param {boolean} [Param.allow_sending_without_reply] - Pass True, if the message should be sent even if the specified replied-to message is not found
   * @returns the sent Message
   *
   */
  replyWithMarkdown(Message, Param) {
    const chat = this.chat || this.from || this.user || undefined
    if (!chat || !chat.id) { throw new Error('Chat_id Not Found.') }

    let req = rM_(
      { chat_id: chat.id, text: Message, parse_mode: "MarkdownV2" },
      Param
    );

    return this.sendMessage(req);
  },

  /**
   * Reply With Photo
   * @param {string} photo - Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or upload a new photo using multipart/form-data. The photo must be at most 10 MB in size. The photo's width and height must not exceed 10000 in total. Width and height ratio must be at most 20
   * @param {object} Param - Object Parameter to send photo
   * @param {number} [Param.message_thread_id] - Unique identifier for the target message thread (topic) of the forum; for forum supergroups only
   * @param {string} [Param.parse_mode] - Mode for parsing entities in the photo caption
   * @param {string} [Param.caption] - Photo caption (may also be used when resending photos by file_id), 0-1024 characters after entities parsing
   * @param {object} [Param.reply_markup] - object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user
   * @param {object} [Param.caption_entities] - list of special entities that appear in the caption, which can be specified instead of parse_mode
   * @param {boolean} [Param.disable_notification] - Sends the message silently. Users will receive a notification with no sound
   * @param {boolean} [Param.protect_content] - Protects the contents of the sent message from forwarding and saving
   * @param {number} [Param.reply_to_message_id] - If the message is a reply, ID of the original message
   * @param {boolean} [Param.allow_sending_without_reply] - Pass True if the message should be sent even if the specified replied-to message is not found
   * @returns the sent Message
   */
  replyWithPhoto(Photo, Param) {
    const chat = this.chat || this.from || this.user || undefined
    if (!chat || !chat.id) { throw new Error('Chat_id Not Found.') }
    let req = rM_({ chat_id: chat.id, photo: Photo }, Param);
    return this.sendPhoto(req);
  },

  /**
   * Reply with chat action
   * @param {string} Action
   */
  replyWithChatAction(Action) {
    const chat = this.chat || this.from || this.user || undefined
    if (!chat || !chat.id) { throw new Error('Chat_id Not Found.') }
    let req = rM_({ chat_id: chat.id, action: Action });
    return this.sendChatAction(req);
  },


  replyWithEditedMessage(Message, Param) {
    const chat = this.chat || this.from || this.user || undefined
    if (!chat || !chat.id) { throw new Error('Chat_id Not Found.') }

    if (!this.message) { throw new Error('message to edit not found') }

    let message_id = this.message.message_id
      || this.message.message.message_id//callbacks

    if (!message_id) { throw new Error("message to edit not found") }
    let req = rM_({ chat_id: chat.id, text: Message, message_id: message_id }, Param);

    return this.editMessageText(req);
  },


  /**
   * Get current Stage
   * @returns {string|number}
   */
  getStage() {
    return TSession.getSessionValue('stage');
  },

  /**
    * clear current Stage
    * @returns null
    */
  clearStage() {
    return TSession.removeSessionValue('stage');
  },
  /**
   * Save value as current Stage
   * @param {string|number} stage - stage
   * @returns 
   */
  setStage(stage) {
    return (stage) ? TSession.setSessionValue('stage', stage) : undefined
  },
  /**
   * A simple method for testing your bot's authentication token. Requires no parameters
   *
   * https://core.telegram.org/bots/api#getme
   *
   * @Returns basic information about the bot in form of a User object
   */
  getMe() {
    let response = UrlFetchApp.fetch(url + "/getMe");
    Logger.log(response);
  },

  /**
   * Use this method to log out from the cloud Bot API server before launching the bot locally. You must log out the bot before running it locally, otherwise there is no guarantee that the bot will receive updates. After a successful call, you can immediately log in on a local server, but will not be able to log in back to the cloud Bot API server for 10 minutes. Requires no parameters.
   *
   * https://core.telegram.org/bots/api#logout
   *
   * @Returns True on success
   */
  logOut() {
    let response = UrlFetchApp.fetch(url + "/logOut");
    Logger.log(response);
  },

  /**
   * Use this method to close the bot instance before moving it from one local server to another. You need to delete the webhook before calling this method to ensure that the bot isn't launched again after server restart. The method will return error 429 in the first 10 minutes after the bot is launched. Requires no parameters.
   *
   * https://core.telegram.org/bots/api#close
   *
   * @Returns True on success
   */
  close() {
    let response = UrlFetchApp.fetch(url + "/close");
    Logger.log(response);
  },

  /**
   * Use this method to send text messages.
   * https://core.telegram.org/bots/api#sendmessage
   * @param {object} Param - Object Parameter to send message
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @param {string} Param.text - Text of the message to be sent, 1-4096 characters after entities parsing
   * @param {number} [Param.message_thread_id] - Unique identifier for the target message thread (topic) of the forum; for forum supergroups only
   * @param {object} [Param.reply_markup] - object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user
   * @param {string} [Param.parse_mode] - Mode for parsing entities in the message text
   * @param {object} [Param.entities] - list of special entities that appear in message text, which can be specified instead of parse_mode
   * @param {boolean} [Param.disable_web_page_preview] - Disables link previews for links in this message
   * @param {boolean} [Param.disable_notification] - Sends the message silently. Users will receive a notification with no sound
   * @param {boolean} [Param.protect_content] - Protects the contents of the sent message from forwarding and saving
   * @param {number} [Param.reply_to_message_id] - If the message is a reply, ID of the original message
   * @param {boolean} [Param.allow_sending_without_reply] - Pass True, if the message should be sent even if the specified replied-to message is not found
   * @returns the sent Message
   */
  sendMessage(Param) {
    return Main_("sendMessage", Param);
  },

  /**
   * Use this method to forward messages of any kind. Service messages can't be forwarded
   *
   * https://core.telegram.org/bots/api#forwardmessage
   *
   * @param {object} Param - Object Parameter to forward message
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target
   * @param {string} Param.from_chat_id - Unique identifier for the chat where the original message was sent
   * @param {number} Param.message_id - Message identifier in the chat specified in from_chat_id
   * @param {number} [Param.message_thread_id] - Unique identifier for the target message thread (topic) of the forum; for forum supergroups only
   * @param {boolean} [Param.disable_notification] - Sends the message silently. Users will receive a notification with no sound
   * @param {boolean} [Param.protect_content] - Protects the contents of the forwarded message from forwarding and saving
   * @returns the sent Message
   */
  forwardMessage(Param) {
    return Main_("forwardMessage", Param);
  },

  /**
   * Use this method to copy messages of any kind. Service messages and invoice messages can't be copied. A quiz poll can be copied only if the value of the field correct_option_id is known to the bot. The method is analogous to the method forwardMessage, but the copied message doesn't have a link to the original message
   *
   * https://core.telegram.org/bots/api#copymessage
   * @param {object} Param - Object Parameter to copy message
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target
   * @param {string} Param.from_chat_id - Unique identifier for the chat where the original message was sent (or channel username
   * @param {number} Param.message_id - Message identifier in the chat specified in from_chat_id
   * @param {number} [Param.message_thread_id] - Unique identifier for the target message thread (topic) of the forum; for forum supergroups only
   * @param {object} [Param.reply_markup] - object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user
   * @param {string} [Param.caption] - New caption for media, 0-1024 characters after entities parsing. If not specified, the original caption is kept
   * @param {string} [Param.parse_mode] - Mode for parsing entities in the new caption
   * @param {object} [Param.caption_entities] - list of special entities that appear in the new caption
   * @param {boolean} [Param.disable_notification] - Sends the message silently. Users will receive a notification with no sound
   * @param {boolean} [Param.protect_content] - Protects the contents of the sent message from forwarding and saving
   * @param {number} [Param.reply_to_message_id] - If the message is a reply, ID of the original message
   * @param {boolean} [Param.allow_sending_without_reply] - Pass True if the message should be sent even if the specified replied-to message is not found
   * @Returns the MessageId of the sent message
   */
  copyMessage(Param) {
    return Main_("copyMessage", Param);
  },

  /**
   * se this method to send photos
   *
   * https://core.telegram.org/bots/api#sendphoto
   * @param {object} Param - Object Parameter to send photo
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @param {string} Param.photo - Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or upload a new photo using multipart/form-data. The photo must be at most 10 MB in size. The photo's width and height must not exceed 10000 in total. Width and height ratio must be at most 20
   * @param {number} [Param.message_thread_id] - Unique identifier for the target message thread (topic) of the forum; for forum supergroups only
   * @param {string} [Param.parse_mode] - Mode for parsing entities in the photo caption
   * @param {string} [Param.caption] - Photo caption (may also be used when resending photos by file_id), 0-1024 characters after entities parsing
   * @param {object} [Param.reply_markup] - object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user
   * @param {object} [Param.caption_entities] - list of special entities that appear in the caption, which can be specified instead of parse_mode
   * @param {boolean} [Param.disable_notification] - Sends the message silently. Users will receive a notification with no sound
   * @param {boolean} [Param.protect_content] - Protects the contents of the sent message from forwarding and saving
   * @param {number} [Param.reply_to_message_id] - If the message is a reply, ID of the original message
   * @param {boolean} [Param.allow_sending_without_reply] - Pass True if the message should be sent even if the specified replied-to message is not found
   * @returns the sent Message
   */
  sendPhoto(Param) {
    return Main_("sendPhoto", Param);
  },

  /**
   * Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .MP3 or .M4A format. On success, the sent Message is returned. Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future
   *
   * https://core.telegram.org/bots/api#sendaudio
   * @param {object} Param - Object Parameter to send Audio
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @param {string} Param.audio - Audio file to send. Pass a file_id as String to send an audio file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an audio file from the Internet, or upload a new one using multipart/form-data
   * @param {number} [Param.message_thread_id] - Unique identifier for the target message thread (topic) of the forum; for forum supergroups only
   * @param {string} [Param.caption] - Audio caption, 0-1024 characters after entities parsing
   * @param {string} [Param.parse_mode] - Mode for parsing entities in the audio caption
   * @param {object} [Param.reply_markup] - object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user
   * @param {object} [Param.caption_entities] - list of special entities that appear in the caption, which can be specified instead of parse_mode
   * @param {number} [Param.duration] - Duration of the audio in seconds
   * @param {string} [Param.performer] - Performer
   * @param {string} [Param.title] - Track name
   * @param {string} [Param.thumb] - Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>
   * @param {boolean} [Param.disable_notification] - Sends the message silently. Users will receive a notification with no sound
   * @param {boolean} [Param.protect_content] - Protects the contents of the sent message from forwarding and saving
   * @param {number} [Param.reply_to_message_id] - If the message is a reply, ID of the original message
   * @param {boolean} [Param.allow_sending_without_reply] - Pass True if the message should be sent even if the specified replied-to message is not found
   * @returns the sent Message
   */
  sendAudio(Param) {
    return Main_("sendAudio", Param);
  },

  /**
   * Use this method to send general files. On success, the sent Message is returned. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future
   *
   * https://core.telegram.org/bots/api#senddocument
   * @param {object} Param - Object Parameter to send Document
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @param {string} Param.document - File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data
   * @param {number} [Param.message_thread_id] - Unique identifier for the target message thread (topic) of the forum; for forum supergroups only
   * @param {string} [Param.thumb] - Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under
   * @param {string} [Param.caption] - Document caption (may also be used when resending documents by file_id), 0-1024 characters after entities parsing
   * @param {string} [Param.parse_mode] - Mode for parsing entities in the document caption
   * @param {object} [Param.reply_markup] - object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user
   * @param {object} [Param.caption_entities] - list of special entities that appear in the caption, which can be specified instead of parse_mode
   * @param {boolean} [Param.disable_content_type_detection] - Disables automatic server-side content type detection for files uploaded using multipart/form-data
   * @param {boolean} [Param.disable_notification] - Sends the message silently. Users will receive a notification with no sound
   * @param {boolean} [Param.protect_content] - Protects the contents of the sent message from forwarding and saving
   * @param {number} [Param.reply_to_message_id] - If the message is a reply, ID of the original message
   * @param {boolean} [Param.allow_sending_without_reply] - Pass True if the message should be sent even if the specified replied-to message is not found
   * @returns the sent Message
   */
  sendDocument(Param) {
    return Main_("sendDocument", Param);
  },

  /**
   * Use this method to send video files, Telegram clients support MPEG4 videos (other formats may be sent as Document). On success, the sent Message is returned. Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future
   *
   * https://core.telegram.org/bots/api#sendvideo
   * @param {object} Param - Object Parameter to send Video
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @param {string} Param.video - Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a video from the Internet, or upload a new video using multipart/form-data
   * @param {number} [Param.message_thread_id] - Unique identifier for the target message thread (topic) of the forum; for forum supergroups only
   * @param {string} [Param.caption] - Video caption (may also be used when resending videos by file_id), 0-1024 characters after entities parsing
   * @param {string} [Param.parse_mode] - Mode for parsing entities in the video caption
   * @param {object} [Param.reply_markup] - object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user
   * @param {number} [Param.duration] - Duration of sent video in seconds
   * @param {number} [Param.width] - Video width
   * @param {number} [Param.height] - Video height
   * @param {string} [Param.thumb] - Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>
   * @param {object} [Param.caption_entities] - list of special entities that appear in the caption, which can be specified instead of parse_mode
   * @param {boolean} [Param.supports_streaming] - Pass True if the uploaded video is suitable for streaming
   * @param {boolean} [Param.disable_notification] - Sends the message silently. Users will receive a notification with no sound
   * @param {boolean} [Param.protect_content] - Protects the contents of the sent message from forwarding and saving
   * @param {number} [Param.reply_to_message_id] - If the message is a reply, ID of the original message
   * @param {boolean} [Param.allow_sending_without_reply] - Pass True if the message should be sent even if the specified replied-to message is not found
   * @returns the sent Message
   */
  sendVideo(Param) {
    return Main_("sendVideo", Param);
  },

  /**
   * Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound). On success, the sent Message is returned. Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future
   *
   * https://core.telegram.org/bots/api#sendanimation
   * @param {object} Param - Object Parameter to send animation
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @param {string} Param.animation - Animation to send. Pass a file_id as String to send an animation that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an animation from the Internet, or upload a new animation using multipart/form-data
   * @param {number} [Param.message_thread_id] - Unique identifier for the target message thread (topic) of the forum; for forum supergroups only
   * @param {string} [Param.caption] - Animation caption (may also be used when resending animation by file_id), 0-1024 characters after entities parsing
   * @param {string} [Param.parse_mode] - Mode for parsing entities in the animation captio
   * @param {object} [Param.reply_markup] - object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user
   * @param {number} [Param.duration] - Duration of sent animation in seconds
   * @param {number} [Param.width] - Animation width
   * @param {number} [Param.height] - Animation height
   * @param {string} [Param.thumb] - Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>
   * @param {object} [Param.caption_entities] - list of special entities that appear in the caption, which can be specified instead of parse_mode
   * @param {boolean} [Param.disable_notification] - Sends the message silently. Users will receive a notification with no sound
   * @param {boolean} [Param.protect_content] - Protects the contents of the sent message from forwarding and saving
   * @param {number} [Param.reply_to_message_id] - If the message is a reply, ID of the original message
   * @param {boolean} [Param.allow_sending_without_reply] - Pass True if the message should be sent even if the specified replied-to message is not found
   * @returns the sent Message
   */
  sendAnimation(Param) {
    return Main_("sendAnimation", Param);
  },

  /**
   * Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .OGG file encoded with OPUS (other formats may be sent as Audio or Document). On success, the sent Message is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future
   *
   * https://core.telegram.org/bots/api#sendvoice
   * @param {object} Param - Object Parameter to send voice
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel (in the format
   * @param {string} Param.voice - Audio file to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data
   * @param {number} [Param.message_thread_id] - Unique identifier for the target message thread (topic) of the forum; for forum supergroups only
   * @param {string} [Param.caption] - Voice message caption, 0-1024 characters after entities parsing
   * @param {string} [Param.parse_mode] - Mode for parsing entities in the voice message caption
   * @param {object} [Param.reply_markup] - object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user
   * @param {object} [Param.caption_entities] - list of special entities that appear in the caption, which can be specified instead of parse_mode
   * @param {number} [Param.duration] - Duration of the voice message in seconds
   * @param {boolean} [Param.disable_notification] - Sends the message silently. Users will receive a notification with no sound
   * @param {boolean} [Param.protect_content] - Protects the contents of the sent message from forwarding and saving
   * @param {number} [Param.reply_to_message_id] - If the message is a reply, ID of the original message
   * @param {boolean} [Param.allow_sending_without_reply] - Pass True if the message should be sent even if the specified replied-to message is not found
   */
  sendVoice(Param) {
    return Main_("sendVoice", Param);
  },

  /**
   * As of v.4.0, Telegram clients support rounded square MPEG4 videos of up to 1 minute long. Use this method to send video messages
   *
   * https://core.telegram.org/bots/api#sendvideonote
   * @param {object} Param - Object Parameter to send video note
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @param {string} Param.video_note - Video note to send. Pass a file_id as String to send a video note that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. More information on Sending Files ». Sending video notes by a URL is currently unsupported
   * @param {number} [Param.message_thread_id] - Unique identifier for the target message thread (topic) of the forum; for forum supergroups only
   * @param {object} [Param.reply_markup] - object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user
   * @param {number} [Param.duration] - Duration of sent video in seconds
   * @param {number} [Param.length] - Video width and height, i.e. diameter of the video message
   * @param {string} [Param.thumb] - Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>
   * @param {boolean} [Param.disable_notification] - Sends the message silently. Users will receive a notification with no sound
   * @param {boolean} [Param.protect_content] - Protects the contents of the sent message from forwarding and saving
   * @param {number} [Param.reply_to_message_id] - If the message is a reply, ID of the original message
   * @param {boolean} [Param.allow_sending_without_reply] - Pass True if the message should be sent even if the specified replied-to message is not found
   * @returns the sent Message
   */
  sendVideoNote(Param) {
    return Main_("sendVideoNote", Param);
  },

  /**
   * Use this method to send a group of photos, videos, documents or audios as an album. Documents and audio files can be only grouped in an album with messages of the same type
   *
   * https://core.telegram.org/bots/api#sendmediagroup
   * @param {object} Param - Object Parameter to send media group
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @param {object} Param.media - array describing messages to be sent, must include 2-10 items
   * @param {number} [Param.message_thread_id] - Unique identifier for the target message thread (topic) of the forum; for forum supergroups only
   * @param {boolean} [Param.disable_notification] - Sends messages silently. Users will receive a notification with no sound
   * @param {boolean} [Param.protect_content] - Protects the contents of the sent messages from forwarding and saving
   * @param {number} [Param.reply_to_message_id] - If the messages are a reply, ID of the original message
   * @param {boolean} [Param.allow_sending_without_reply] - Pass True if the message should be sent even if the specified replied-to message is not found
   * @returns an array of Messages that were sent
   */
  sendMediaGroup(Param) {
    return Main_("sendMediaGroup", Param);
  },

  /**
   * Use this method to send point on the map
   *
   * https://core.telegram.org/bots/api#sendlocation
   * @param {object} Param - Object Parameter to send location
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @param {number} Param.latitude - Latitude of the location
   * @param {number} Param.longitude - Longitude of the location
   * @param {number} [Param.message_thread_id] - Unique identifier for the target message thread (topic) of the forum; for forum supergroups only
   * @param {object} [Param.reply_markup] - object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user
   * @param {number} [Param.horizontal_accuracy] - The radius of uncertainty for the location, measured in meters; 0-1500
   * @param {number} [Param.live_period] - Period in seconds for which the location will be updated (see Live Locations, should be between 60 and 86400
   * @param {number} [Param.heading] - For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified
   * @param {number} [Param.proximity_alert_radius] - For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified
   * @param {boolean} [Param.disable_notification] - Sends the message silently. Users will receive a notification with no sound
   * @param {boolean} [Param.protect_content] - Protects the contents of the sent message from forwarding and saving
   * @param {number} [Param.reply_to_message_id] - If the message is a reply, ID of the original message
   * @param {boolean} [Param.allow_sending_without_reply] - Pass True if the message should be sent even if the specified replied-to message is not found
   * @returns the sent Message
   */
  sendLocation(Param) {
    return Main_("sendLocation", Param);
  },

  /**
   * Use this method to edit live location messages. A location can be edited until its live_period expires or editing is explicitly disabled by a call to stopMessageLiveLocation. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned
   *
   * https://core.telegram.org/bots/api#editmessagelivelocation
   * @param {object} Param - Object Parameter to edit message live location
   * @param {string} [Param.chat_id] - Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target channel
   * @param {number} [Param.message_id] - Required if inline_message_id is not specified. Identifier of the message to edit
   * @param {string} [Param.inline_message_id] - Required if chat_id and message_id are not specified. Identifier of the inline message
   * @param {number} Param.latitude - Latitude of new location
   * @param {number} Param.longitude - Longitude of new location
   * @param {object} [Param.reply_markup] - object for a new inline keyboard
   * @param {number} [Param.horizontal_accuracy] - The radius of uncertainty for the location, measured in meters; 0-1500
   * @param {number} [Param.heading] - Direction in which the user is moving, in degrees. Must be between 1 and 360 if specified
   * @param {number} [Param.proximity_alert_radius] - The maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified
   */
  editMessageLiveLocation(Param) {
    return Main_("editMessageLiveLocation", Param);
  },

  /**
   * Use this method to send a game
   *
   * https://core.telegram.org/bots/api#sendgame
   * @param {object} Param - Object Parameter to send game
   * @param {number} Param.chat_id - Unique identifier for the target chat
   * @param {string} Param.game_short_name - Short name of the game, serves as the unique identifier for the game. Set up your games via @BotFather
   * @param {number} [Param.message_thread_id] - Unique identifier for the target message thread (topic) of the forum; for forum supergroups only
   * @param {boolean} [Param.disable_notification] - Sends the message silently. Users will receive a notification with no sound
   * @param {boolean} [Param.protect_content] - Protects the contents of the sent message from forwarding and saving
   * @param {number} [Param.reply_to_message_id] - If the message is a reply, ID of the original message
   * @param {boolean} [Param.allow_sending_without_reply] - Pass True if the message should be sent even if the specified replied-to message is not found
   * @param {object} [Param.reply_markup] - object for an inline keyboard. If empty, one 'Play game_title' button will be shown. If not empty, the first button must launch the game
   * @returns the sent Message
   */
  sendGame(Param) {
    return Main_("sendGame", Param);
  },

  /**
   * Use this method to set the score of the specified user in a game message
   *
   * https://core.telegram.org/bots/api#setgamescore
   *
   * @param {object} Param - Object Parameter to send game score
   * @param {number} Param.user_id - User identifier
   * @param {number} Param.score - New score, must be non-negative
   * @param {boolean} [Param.force] - Pass True if the high score is allowed to decrease. This can be useful when fixing mistakes or banning cheaters
   * @param {boolean} [Param.disable_edit_message] - Pass True if the game message should not be automatically edited to include the current scoreboard
   * @param {number} [Param.chat_id] - Required if inline_message_id is not specified. Unique identifier for the target chat
   * @param {number} [Param.message_id] - Required if inline_message_id is not specified. Identifier of the sent message
   * @param {string} [Param.inline_message_id] - Required if chat_id and message_id are not specified. Identifier of the inline message
   * @returns On success, if the message is not an inline message, the Message is returned, otherwise True is returned. Returns an error, if the new score is not greater than the user's current score in the chat and force is False
   */
  setGameScore(Param) {
    return Main_("setGameScore", Param);
  },

  /**
   * Use this method to get data for high score tables. Will return the score of the specified user and several of their neighbors in a game
   *
   * https://core.telegram.org/bots/api#getgamehighscores
   * @param {object} Param - Object Parameter to get game high score
   * @param {number} Param.user_id - Target user id
   * @param {number} [Param.chat_id] - Required if inline_message_id is not specified. Unique identifier for the target chat
   * @param {number} [Param.message_id] - Required if inline_message_id is not specified. Identifier of the sent message
   * @param {string} [Param.inline_message_id] - Required if chat_id and message_id are not specified. Identifier of the inline message
   * @returns Array of GameHighScore objects
   */
  getGameHighScores(Param) {
    return Main_("getGameHighScores", Param);
  },

  /**
 * Use this method to send answers to an inline query.
No more than 50 results per query are allowed
 * https://core.telegram.org/bots/api#answerinlinequery
 * @param {object} Param - Object Parameter to answer inline query
 * @param {string} Param.inline_query_id - Unique identifier for the answered query
 * @param {object} Param.results - array of results for the inline query
 * @param {number} [Param.cache_time] - The maximum amount of time in seconds that the result of the inline query may be cached on the server. Defaults to 300
 * @param {boolean} [Param.is_personal] - Pass True if results may be cached on the server side only for the user that sent the query. By default, results may be returned to any user who sends the same query
 * @param {string} [Param.next_offset] - Pass the offset that a client should send in the next query with the same text to receive more results. Pass an empty string if there are no more results or if you don't support pagination. Offset length can't exceed 64 bytes
 * @param {string} [Param.switch_pm_text] - If passed, clients will display a button with specified text that switches the user to a private chat with the bot and sends the bot a start message with the parameter switch_pm_parameter
 * @param {string} [Param.switch_pm_parameter] - Deep-linking parameter for the /start message sent to the bot when user presses the switch button. 1-64 characters, only A-Z, a-z, 0-9, _ and - are allowed
 * @returns True On success
 */
  answerInlineQuery(Param) {
    return Main_("answerInlineQuery", Param);
  },

  /**
   * Use this method to set the result of an interaction with a Web App and send a corresponding message on behalf of the user to the chat from which the query originated
   *
   * https://core.telegram.org/bots/api#answerwebappquery
   * @param {object} Param - Object Parameter to answer web app query
   * @param {string} Param.web_app_query_id - Unique identifier for the query to be answered
   * @param {object} Param.result - object describing the message to be sent
   * @returns SentWebAppMessage object
   */
  answerWebAppQuery(Param) {
    return Main_("answerWebAppQuery", Param);
  },

  /**
   * Use this method to change the list of the bot's commands. See https://core.telegram.org/bots#commands for more details about bot commands.
   *
   * https://core.telegram.org/bots/api#setmycommands
   *
   * @param {object} Param.commands -  list of bot commands to be set as the list of the bot's commands. At most 100 commands can be specified
   * @param {object} [Param.scope] -  object describing scope of users for which the commands are relevant. Defaults to BotCommandScopeDefaul
   * @param {object} [Param.language_code] -  A two-letter ISO 639-1 language code. If empty, commands will be applied to all users from the given scope, for whose language there are no dedicated commands
   * @Returns True on success
   */
  setMyCommands(Param) {
    return Main_("setMyCommands", Param);
  },

  /**
   * Use this method to stop updating a live location message before live_period expires.
   *
   * https://core.telegram.org/bots/api#stopmessagelivelocation
   *
   * @param {string} [Param.chat_id] - Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target channel
   * @param {number} [Param.message_id] - Required if inline_message_id is not specified. Identifier of the message with live location to stop
   * @param {string} [Param.inline_message_id] - Required if chat_id and message_id are not specified. Identifier of the inline message
   * @param {object} [Param.reply_markup] - object for a new inline keyboard
   * @returns if the message is not an inline message, the edited Message is returned, otherwise True is returned
   */
  stopMessageLiveLocation(Param) {
    return Main_("stopMessageLiveLocation", Param);
  },

  /**
   *Use this method to send information about a venue. On success
   *
   * https://core.telegram.org/bots/api#sendvenue
   *
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel (in the format
   * @param {number} Param.latitude - Latitude of the venue
   * @param {number} Param.longitude - Longitude of the venue
   * @param {string} Param.title - Name of the venue
   * @param {string} Param.address - Address of the venue
   * @param {object} [Param.reply_markup] - object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user
   * @param {string} [Param.foursquare_id] - Foursquare identifier of the venue
   * @param {string} [Param.foursquare_type] - Foursquare type of the venue, if known. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.)
   * @param {string} [Param.google_place_id] - Google Places identifier of the venue
   * @param {string} [Param.google_place_type] - Google Places type of the venue
   * @param {boolean} [Param.disable_notification] - Sends the message silently. Users will receive a notification with no sound
   * @param {boolean} [Param.protect_content] - Protects the contents of the sent message from forwarding and saving
   * @param {number} [Param.reply_to_message_id] - If the message is a reply, ID of the original message
   * @param {boolean} [Param.allow_sending_without_reply] - Pass True if the message should be sent even if the specified replied-to message is not found
   * @returns the sent Message
   */
  sendVenue(Param) {
    return Main_("sendVenue", Param);
  },

  /**
   * Use this method to send phone contacts
   *
   * https://core.telegram.org/bots/api#sendcontact
   *
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @param {string} Param.phone_number - Contact's phone number
   * @param {string} Param.first_name - Contact's first name
   * @param {string} [Param.last_name] - Contact's last name
   * @param {object} [Param.reply_markup] - object for an inline keyboard, custom reply keyboard, instructions to remove keyboard or to force a reply from the user
   * @param {string} [Param.vcard] - Additional data about the contact in the form of a vCard, 0-2048 bytes
   * @param {Boolean} [Param.disable_notification] - Sends the message silently. Users will receive a notification with no sound
   * @param {Boolean} [Param.protect_content] - Protects the contents of the sent message from forwarding and saving
   * @param {number} [Param.reply_to_message_id] - If the message is a reply, ID of the original message
   * @param {Boolean} [Param.allow_sending_without_reply] - Pass True if the message should be sent even if the specified replied-to message is not found
   * @returns the sent Message
   */
  sendContact(Param) {
    return Main_("sendContact", Param);
  },

  /**
   * Use this method to send a native poll. On success
   *
   * https://core.telegram.org/bots/api#sendpoll
   *
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @param {string} Param.question - Poll question, 1-300 characters
   * @param {object} Param.options - list of answer options, 2-10 strings 1-100 characters each
   * @param {object} [Param.reply_markup] - object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user
   * @param {boolean} [Param.is_anonymous] - True, if the poll needs to be anonymous, defaults to True
   * @param {string} [Param.type] - Poll type, “quiz” or “regular”, defaults to “regular”
   * @param {boolean} [Param.allows_multiple_answers] - True, if the poll allows multiple answers, ignored for polls in quiz mode, defaults to False
   * @param {number} [Param.correct_option_id] - 0-based identifier of the correct answer option, required for polls in quiz mode
   * @param {string} [Param.explanation] - Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters with at most 2 line feeds after entities parsing
   * @param {string} [Param.explanation_parse_mode] - Mode for parsing entities in the explanation
   * @param {object} [Param.explanation_entities] - list of special entities that appear in the poll explanation, which can be specified instead of parse_mode
   * @param {number} [Param.open_period] - Amount of time in seconds the poll will be active after creation, 5-600. Can't be used together with close_date
   * @param {number} [Param.close_date] - Point in time (Unix timestamp) when the poll will be automatically closed. Must be at least 5 and no more than 600 seconds in the future. Can't be used together with open_period
   * @param {number} [Param.is_closed] - Pass True if the poll needs to be immediately closed. This can be useful for poll preview
   * @param {boolean} [Param.disable_notification] - Sends the message silently. Users will receive a notification with no sound
   * @param {boolean} [Param.protect_content] - Protects the contents of the sent message from forwarding and saving
   * @param {number} [Param.reply_to_message_id] - If the message is a reply, ID of the original message
   * @param {boolean} [Param.allow_sending_without_reply] - Pass True if the message should be sent even if the specified replied-to message is not found
   * @returns the sent Message
   */
  sendPoll(Param) {
    return Main_("sendPoll", Param);
  },

  /**
   * Use this method to send an animated emoji that will display a random value.
   *
   * https://core.telegram.org/bots/api#senddice
   *
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @param {string} [Param.emoji] - Emoji on which the dice throw animation is based. Currently, must be one of “🎲”, “🎯”, “🏀”, “⚽”, “🎳”, or “🎰”. Dice can have values 1-6 for “🎲”, “🎯” and “🎳”, values 1-5 for “🏀” and “⚽”, and values 1-64 for “🎰”. Defaults to “🎲”
   * @param {object} [Param.reply_markup] - object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user
   * @param {boolean} [Param.disable_notification] - Sends the message silently. Users will receive a notification with no sound
   * @param {boolean} [Param.protect_content] - Protects the contents of the sent message from forwarding
   * @param {number} [Param.reply_to_message_id] - If the message is a reply, ID of the original message
   * @param {boolean} [Param.allow_sending_without_reply] - Pass True if the message should be sent even if the specified replied-to message is not found
   * @returns the sent Message
   */
  sendDice(Param) {
    return Main_("sendDice", Param);
  },

  /**
   * Use this method when you need to tell the user that something is happening on the bot's side. The status is set for 5 seconds or less
   *
   *  https://core.telegram.org/bots/api#sendchataction
   * @param {object} Param - Object Parameter to send chat action
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @param {string} Param.action - Type of action to broadcast. Choose one, depending on what the user is about to receive: typing for text messages, upload_photo for photos, record_video or upload_video for videos, record_voice or upload_voice for voice notes, upload_document for general files, choose_sticker for stickers, find_location for location data, record_video_note or upload_video_note for video notes
   * @returns True on success
   */
  sendChatAction(Param) {
    return Main_("sendChatAction", Param);
  },

  /**
   * Use this method to get a list of profile pictures for a user
   *
   * https://core.telegram.org/bots/api#getuserprofilephotos
   * @param {object} Param - Object Parameter to get user profile photos
   * @param {number} Param.user_id - Unique identifier of the target user
   * @param {number} [Param.offset] - Sequential number of the first photo to be returned. By default, all photos are returned
   * @param {number} [Param.limit] - Limits the number of photos to be retrieved. Values between 1-100 are accepted. Defaults to 100
   * @returns UserProfilePhotos object
   */
  getUserProfilePhotos(Param) {
    return Main_("getUserProfilePhotos", Param);
  },

  /**
   * Use this method to get basic information about a file and prepare it for downloading. For the moment, bots can download files of up to 20MB in size. On success, a File object is returned. The file can then be downloaded via the link https://api.telegram.org/file/bot<token>/<file_path>, where <file_path> is taken from the response. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling getFile again
   *
   * Note: This function may not preserve the original file name and MIME type. You should save the file's MIME type and name (if available) when the File object is received
   *
   * https://core.telegram.org/bots/api#getfile
   * @param {object} Param - Object Parameter to get file
   * @param {string} Param.file_id - File identifier to get information about
   * @returns File object
   */
  getFile(Param) {
    return Main_("getFile", Param);
  },

  /**
   * Use this method to ban a user in a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the chat on their own using invite links, etc., unless unbanned first. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights
   *
   * https://core.telegram.org/bots/api#banchatmember
   * @param {object} Param - Object Parameter to ban chat member
   * @param {string} Param.chat_id - Unique identifier for the target group or username of the target supergroup or channel
   * @param {number} Param.user_id - Unique identifier of the target user
   * @param {number} [Param.until_date] - Date when the user will be unbanned, unix time. If user is banned for more than 366 days or less than 30 seconds from the current time they are considered to be banned forever. Applied for supergroups and channels only
   * @param {boolean} [Param.revoke_messages] - Pass True to delete all messages from the chat for the user that is being removed. If False, the user will be able to see messages in the group that were sent before the user was removed. Always True for supergroups and channels
   * @returns True on success
   */
  banChatMember(Param) {
    return Main_("banChatMember", Param);
  },

  /**
   * Use this method to unban a previously banned user in a supergroup or channel. The user will not return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work. By default, this method guarantees that after the call the user is not a member of the chat, but will be able to join it. So if the user is a member of the chat they will also be removed from the chat. If you don't want this, use the parameter only_if_banned
   *
   * https://core.telegram.org/bots/api#unbanchatmember
   * @param {object} Param - Object Parameter to unban chat member
   * @param {string} Param.chat_id - Unique identifier for the target group or username of the target supergroup or channel
   * @param {number} [Param.user_id] - Unique identifier of the target user
   * @param {boolean} [Param.only_if_banned] - Do nothing if the user is not banned
   * @returns True on success
   */
  unbanChatMember(Param) {
    return Main_("unbanChatMember", Param);
  },

  /**
   *Use this method to restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate administrator rights. Pass True for all permissions to lift restrictions from a user
   *
   * https://core.telegram.org/bots/api#restrictchatmember
   * @param {object} Param - Object Parameter to restrict chat member
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target supergroup
   * @param {number} Param.user_id - Unique identifier of the target user
   * @param {object} Param.permissions - object for new user permissions
   * @param {number} [Param.until_date] - Date when restrictions will be lifted for the user, unix time. If user is restricted for more than 366 days or less than 30 seconds from the current time, they are considered to be restricted forever
   * @returns True on success
   */
  restrictChatMember(Param) {
    return Main_("restrictChatMember", Param);
  },

  /**
   * Use this method to promote or demote a user in a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Pass False for all boolean parameters to demote a user
   *
   * https://core.telegram.org/bots/api#promotechatmember
   * @param {object} Param - Object Parameter to promote chat member
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @param {number} Param.user_id - Unique identifier of the target user
   * @param {boolean} [Param.is_anonymous] - Pass True if the administrator's presence in the chat is hidden
   * @param {boolean} [Param.can_manage_chat] - Pass True if the administrator can access the chat event log, chat statistics, message statistics in channels, see channel members, see anonymous administrators in supergroups and ignore slow mode. Implied by any other administrator privilege
   * @param {boolean} [Param.can_post_messages] - Pass True if the administrator can create channel posts, channels only
   * @param {boolean} [Param.can_edit_messages] - Pass True if the administrator can edit messages of other users and can pin messages, channels only
   * @param {boolean} [Param.can_delete_messages] - Pass True if the administrator can delete messages of other users
   * @param {boolean} [Param.can_manage_video_chats] - Pass True if the administrator can manage video chats
   * @param {boolean} [Param.can_restrict_members] - Pass True if the administrator can restrict, ban or unban chat members
   * @param {boolean} [Param.can_promote_members] - Pass True if the administrator can add new administrators with a subset of their own privileges or demote administrators that he has promoted, directly or indirectly (promoted by administrators that were appointed by him)
   * @param {boolean} [Param.can_change_info] - Pass True if the administrator can change chat title, photo and other settings
   * @param {boolean} [Param.can_invite_users] - Pass True if the administrator can invite new users to the chat
   * @param {boolean} [Param.can_pin_messages] - Pass True if the administrator can pin messages, supergroups only
   * @param {boolean} [Param.can_manage_topics] - Pass True if the user is allowed to create, rename, close, and reopen forum topics, supergroups only
   * @returns True on success
   */
  promoteChatMember(Param) {
    return Main_("promoteChatMember", Param);
  },

  /**
   * Use this method to set a custom title for an administrator in a supergroup promoted by the bot
   *
   * https://core.telegram.org/bots/api#setchatadministratorcustomtitle
   *
   * @param {object} Param - Object Parameter to set chat administrator custom title
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target supergroup
   * @param {number} Param.user_id - Unique identifier of the target user
   * @param {string} Param.custom_title - New custom title for the administrator; 0-16 characters, emoji are not allowed
   * @returns True on success
   */
  setChatAdministratorCustomTitle(Param) {
    return Main_("setChatAdministratorCustomTitle", Param);
  },

  /**
   * Use this method to ban a channel chat in a supergroup or a channel. Until the chat is unbanned, the owner of the banned chat won't be able to send messages on behalf of any of their channels. The bot must be an administrator in the supergroup or channel for this to work and must have the appropriate administrator rights
   *
   * https://core.telegram.org/bots/api#banchatsenderchat
   * @param {object} Param - Object Parameter to ban chat sender chat
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @param {number} Param.sender_chat_id - Unique identifier of the target sender chat
   * @returns True on success
   */
  banChatSenderChat(Param) {
    return Main_("banChatSenderChat", Param);
  },

  /**
   * Use this method to unban a previously banned channel chat in a supergroup or channel. The bot must be an administrator for this to work and must have the appropriate administrator rights
   *
   * https://core.telegram.org/bots/api#unbanchatsenderchat
   * @param {object} Param - Object Parameter to unban chat sender chat
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @param {number} Param.sender_chat_id - Unique identifier of the target sender chat
   * @returns True on success
   */
  unbanChatSenderChat(Param) {
    return Main_("unbanChatSenderChat", Param);
  },

  /**
   * Use this method to set default chat permissions for all members. The bot must be an administrator in the group or a supergroup for this to work and must have the can_restrict_members administrator rights
   *
   * https://core.telegram.org/bots/api#setchatpermissions
   * @param {object} Param - Object Parameter to set chat permissions
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target supergroup
   * @param {object} Param.permissions - object for new default chat permissions
   * @returns True on success
   */
  setChatPermissions(Param) {
    return Main_("setChatPermissions", Param);
  },

  /**
   * Use this method to generate a new primary invite link for a chat; any previously generated primary link is revoked. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights
   *
   * https://core.telegram.org/bots/api#exportchatinvitelink
   * @param {object} Param - Object Parameter to export chat invite link
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @returns the new invite link as String on success
   */
  exportChatInviteLink(Param) {
    return Main_("exportChatInviteLink", Param);
  },

  /**
   * Use this method to create an additional invite link for a chat. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. The link can be revoked using the method revokeChatInviteLink
   *
   * https://core.telegram.org/bots/api#createchatinvitelink
   * @param {object} Param - Object Parameter to create chat invite link
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @param {string} [Param.name] - Invite link name; 0-32 characters
   * @param {number} [Param.expire_date] - Point in time (Unix timestamp) when the link will expire
   * @param {number} [Param.member_limit] - The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999
   * @param {boolean} [Param.creates_join_request] - True, if users joining the chat via the link need to be approved by chat administrators. If True, member_limit can't be specified
   * @returns the new invite link as ChatInviteLink object
   */
  createChatInviteLink(Param) {
    return Main_("createChatInviteLink", Param);
  },

  /**
   * Use this method to edit a non-primary invite link created by the bot. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights
   *
   * https://core.telegram.org/bots/api#editchatinvitelink
   * @param {object} Param - Object Parameter to edit chat invite link
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @param {string} Param.invite_link - The invite link to edit
   * @param {string} [Param.name] - Invite link name; 0-32 characters
   * @param {number} [Param.expire_date] - Point in time (Unix timestamp) when the link will expire
   * @param {number} [Param.member_limit] - The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999
   * @param {boolean} [Param.creates_join_request] - True, if users joining the chat via the link need to be approved by chat administrators. If True, member_limit can't be specified
   * @returns the edited invite link as a ChatInviteLink object
   */
  editChatInviteLink(Param) {
    return Main_("editChatInviteLink", Param);
  },

  /**
   * Use this method to revoke an invite link created by the bot. If the primary link is revoked, a new link is automatically generated. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights
   *
   * https://core.telegram.org/bots/api#revokechatinvitelink
   * @param {object} Param - Object Parameter to revoke chat invite link
   * @param {string} Param.chat_id - Unique identifier of the target chat or username of the target channel
   * @param {string} Param.invite_link - The invite link to revoke
   * @returns the revoked invite link as ChatInviteLink object
   */
  revokeChatInviteLink(Param) {
    return Main_("revokeChatInviteLink", Param);
  },

  /**
   * Use this method to approve a chat join request. The bot must be an administrator in the chat for this to work and must have the can_invite_users administrator right
   *
   * https://core.telegram.org/bots/api#approvechatjoinrequest
   * @param {object} Param - Object Parameter to Approve chat join request
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @param {number} Param.user_id - Unique identifier of the target user
   * @returns True on success
   */
  approveChatJoinRequest(Param) {
    return Main_("approveChatJoinRequest", Param);
  },

  /**
   * Use this method to decline a chat join request. The bot must be an administrator in the chat for this to work and must have the can_invite_users administrator right
   *
   * https://core.telegram.org/bots/api#declinechatjoinrequest
   * @param {object} Param - Object Parameter to decline chat join request
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @param {number} Param.user_id - Unique identifier of the target user
   * @returns True on success
   */
  declineChatJoinRequest(Param) {
    return Main_("declineChatJoinRequest", Param);
  },

  /**
   * Use this method to set a new profile photo for the chat. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights
   *
   * https://core.telegram.org/bots/api#setchatphoto
   * @param {object} Param - Object Parameter to set chat photo
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @param {string} Param.photo - New chat photo, uploaded using multipart/form-data
   * @returns True on success
   */
  setChatPhoto(Param) {
    return Main_("setChatPhoto", Param);
  },

  /**
   * Use this method to delete a chat photo. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights
   *
   * https://core.telegram.org/bots/api#deletechatphoto
   * @param {object} Param - Object Parameter to delete chat photo
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @returns True on success
   */
  deleteChatPhoto(Param) {
    return Main_("deleteChatPhoto", Param);
  },

  /**
   * Use this method to change the title of a chat. Titles can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights
   *
   * https://core.telegram.org/bots/api#setchattitle
   * @param {object} Param - Object Parameter to set chat title
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @param {string} Param.title - New chat title, 1-255 characters
   * @returns True on success
   */
  setChatTitle(Param) {
    return Main_("setChatTitle", Param);
  },

  /**
   * Use this method to change the description of a group, a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights
   *
   * https://core.telegram.org/bots/api#setchatdescription
   * @param {object} Param - Object Parameter to set chat description
   * @param {string} Param.chat_id - 	Unique identifier for the target chat or username of the target channel
   * @param {string} [Param.description] - New chat description, 0-255 characters
   * @returns True on success
   */
  setChatDescription(Param) {
    return Main_("setChatDescription", Param);
  },

  /**
   * Use this method to add a message to the list of pinned messages in a chat. If the chat is not a private chat, the bot must be an administrator in the chat for this to work and must have the 'can_pin_messages' administrator right in a supergroup or 'can_edit_messages' administrator right in a channel
   *
   * https://core.telegram.org/bots/api#pinchatmessage
   * @param {object} Param - Object Parameter to pin chat message
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @param {number} Param.message_id - Identifier of a message to pin
   * @param {boolean} [Param.disable_notification ]- Pass True if it is not necessary to send a notification to all chat members about the new pinned message. Notifications are always disabled in channels and private chats
   * @returns True on success
   */
  pinChatMessage(Param) {
    return Main_("pinChatMessage", Param);
  },

  /**
   * Use this method to remove a message from the list of pinned messages in a chat. If the chat is not a private chat, the bot must be an administrator in the chat for this to work and must have the 'can_pin_messages' administrator right in a supergroup or 'can_edit_messages' administrator right in a channel
   *
   * https://core.telegram.org/bots/api#unpinchatmessage
   * @param {object} Param - Object Parameter to unpin chat message
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @param {number} [Param.message_id] - Identifier of a message to unpin. If not specified, the most recent pinned message
   * @returns True on success
   */
  unpinChatMessage(Param) {
    return Main_("unpinChatMessage", Param);
  },

  /**
   * Use this method to clear the list of pinned messages in a chat. If the chat is not a private chat, the bot must be an administrator in the chat for this to work and must have the 'can_pin_messages' administrator right in a supergroup or 'can_edit_messages' administrator right in a channel
   *
   * https://core.telegram.org/bots/api#unpinallchatmessages
   * @param {object} Param - Object Parameter to unpin all chat message
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @returns True on success
   */
  unpinAllChatMessages(Param) {
    return Main_("unpinAllChatMessages", Param);
  },

  /**
   * Use this method for your bot to leave a group, supergroup or channel
   *
   * https://core.telegram.org/bots/api#unpinallchatmessages
   * @param {object} Param - Object Parameter to leave Chat
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @returns True on success
   */
  leaveChat(Param) {
    return Main_("leaveChat", Param);
  },

  /**
   * Use this method to get up to date information about the chat (current name of the user for one-on-one conversations, current username of a user, group or channel, etc.)
   *
   * https://core.telegram.org/bots/api#getchat
   * @param {object} Param - Object Parameter to get Chat
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @returns a Chat object on success
   */
  getChat(Param) {
    return Main_("getChat", Param);
  },

  /**
   * Use this method to get a list of administrators in a chat, which aren't bots
   *
   * https://core.telegram.org/bots/api#getchatadministrators
   * @param {object} Param - Object Parameter to get Chat administrators
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @returns an Array of ChatMember objects
   */
  getChatAdministrators(Param) {
    return Main_("getChatAdministrators", Param);
  },

  /**
   * Use this method to get the number of members in a chat
   *
   * https://core.telegram.org/bots/api#getchatmembercount
   * @param {object} Param - Object Parameter to get member count
   * @param {string} chat_id - Unique identifier for the target chat or username of the target channel
   * @returns number on success
   */
  getChatMemberCount(Param) {
    return Main_("getChatMemberCount", Param);
  },

  /**
   * Use this method to get information about a member of a chat
   *
   * https://core.telegram.org/bots/api#getchatmember
   * @param {object} Param - Object Parameter to get chat member
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @param {number} Param.user_id - Unique identifier of the target user
   * @returns a ChatMember object on success
   */
  getChatMember(Param) {
    return Main_("getChatMember", Param);
  },

  /**
   * Use this method to set a new group sticker set for a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field can_set_sticker_set optionally returned in getChat requests to check if the bot can use this method
   *
   * https://core.telegram.org/bots/api#setchatstickerset
   * @param {object} Param - Object Parameter to set chat sticker set
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target supergroup
   * @param {string} Param.sticker_set_name - Name of the sticker set to be set as the group sticker set
   * @returns True on success
   */
  setChatStickerSet(Param) {
    return Main_("setChatStickerSet", Param);
  },

  /**
   * Use this method to delete a group sticker set from a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field can_set_sticker_set optionally returned in getChat requests to check if the bot can use this method
   *
   * https://core.telegram.org/bots/api#deletechatstickerset
   * @param {object} Param - Object Parameter to delete chat sticker set
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @returns True on success
   */
  deleteChatStickerSet(Param) {
    return Main_("deleteChatStickerSet", Param);
  },

  /**
   * Use this method to send answers to callback queries sent from inline keyboards. The answer will be displayed to the user as a notification at the top of the chat screen or as an alert. On success, True is returned
   *
   * https://core.telegram.org/bots/api#answercallbackquery
   * @param {object} Param - Object Parameter to answer callback query
   * @param {string} Param.callback_query_id - Unique identifier for the query to be answered
   * @param {string} [Param.text] - Text of the notification. If not specified, nothing will be shown to the user, 0-200 characters
   * @param {boolean} [Param.show_alert] - If True, an alert will be shown by the client instead of a notification at the top of the chat screen. Defaults to false
   * @param {string} [Param.urls] - URL that will be opened by the user's client. If you have created a Game and accepted the conditions via @BotFather, specify the URL that opens your game - note that this will only work if the query comes from a callback_game button
   * Otherwise, you may use links like t.me/your_bot?start=XXXX that open your bot with a parameter
   * @param {number} [Param.cache_time] - The maximum amount of time in seconds that the result of the callback query may be cached client-side. Telegram apps will support caching starting in version 3.14. Defaults to 0
   * @returns True on success
   */
  answerCallbackQuery(Param) {
    return Main_("answerCallbackQuery", Param);
  },

  /**
   * Use this method to delete the list of the bot's commands for the given scope and user language. After deletion, higher level commands will be shown to affected users
   *
   * https://core.telegram.org/bots/api#deletemycommands
   * @param {object} Param - Object Parameter to delete commands
   * @param {object} [Param.scope] - describing scope of users for which the commands are relevant. Defaults to BotCommandScopeDefault
   * @param {string} [Param.language_code] - A two-letter ISO 639-1 language code. If empty, commands will be applied to all users from the given scope, for whose language there are no dedicated commands
   * @returns True on success
   */
  deleteMyCommands(Param) {
    return Main_("deleteMyCommands", Param);
  },

  /**
   * Use this method to get the current list of the bot's commands for the given scope and user language
   *
   * https://core.telegram.org/bots/api#getmycommands
   *
   * @param {object} [Param.scope] - describing scope of users. Defaults to BotCommandScopeDefault
   * @param {string} [Param.language_code] - A two-letter ISO 639-1 language code or an empty string
   * @returns an Array of BotCommand objects. If commands aren't set, an empty list is returned
   */
  getMyCommands(Param) {
    return Main_("getMyCommands", Param);
  },

  /**
   * Use this method to change the bot's menu button in a private chat, or the default menu button
   *
   * https://core.telegram.org/bots/api#setchatmenubutton
   * @param {object} Param - Object Parameter to set chat menu button
   * @param {number} [Param.chat_id] - Unique identifier for the target private chat. If not specified, default bot's menu button will be changed
   * @param {object} [Param.menu_button] - object for the bot's new menu button. Defaults to MenuButtonDefault
   * @returns True on success
   */
  setChatMenuButton(Param) {
    return Main_("setChatMenuButton", Param);
  },

  /**
   * Use this method to get the current value of the bot's menu button in a private chat, or the default menu button
   *
   * https://core.telegram.org/bots/api#getchatmenubutton
   * @param {object} Param - Object Parameter to get chat menu button
   * @param {number} [Param.chat_id] - Unique identifier for the target private chat. If not specified, default bot's menu button will be returned
   * @returns MenuButton on success
   */
  getChatMenuButton(Param) {
    return Main_("getChatMenuButton", Param);
  },

  /**
   * Use this method to change the default administrator rights requested by the bot when it's added as an administrator to groups or channels. These rights will be suggested to users, but they are are free to modify the list before adding the bot
   *
   * https://core.telegram.org/bots/api#setmydefaultadministratorrights
   * @param {object} Param - Object Parameter to set default administrator rights
   * @param {object} [Param.rights] - object describing new default administrator rights. If not specified, the default administrator rights will be cleared
   * @param {boolean} [Param.for_channels] - Pass True to change the default administrator rights of the bot in channels. Otherwise, the default administrator rights of the bot for groups and supergroups will be changed
   * @returns True on success
   */
  setMyDefaultAdministratorRights(Param) {
    return Main_("setMyDefaultAdministratorRights", Param);
  },

  /**
   * Use this method to get the current default administrator rights of the bot
   *
   * https://core.telegram.org/bots/api#getmydefaultadministratorrights
   * @param {object} Param - Object Parameter to get default administrator rights
   * @param {boolean} [Param.for_channels] - Pass True to get default administrator rights of the bot in channels. Otherwise, default administrator rights of the bot for groups and supergroups will be returned
   * @returns ChatAdministratorRights on success
   */
  getMyDefaultAdministratorRights(Param) {
    return Main_("getMyDefaultAdministratorRights", Param);
  },

  /**
   * Use this method to send invoices
   *
   * https://core.telegram.org/bots/api#sendinvoice
   * @param {object} Param - Object Parameter to send invoice
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @param {string} Param.title - Product name, 1-32 characters
   * @param {string} Param.description - Product description, 1-255 characters
   * @param {string} Param.payload - Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use for your internal processes
   * @param {string} Param.provider_token - Payment provider token, obtained via @BotFather
   * @param {string} Param.currency - Three-letter ISO 4217 currency code
   * @param {object} [Param.prices] - list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.)
   * @param {object} [Param.reply_markup] - object for an inline keyboard. If empty, one 'Pay total price' button will be shown. If not empty, the first button must be a Pay button
   * @param {number} [Param.max_tip_amount] - The maximum accepted amount for tips in the smallest units of the currency (integer, not float/double). For example, for a maximum tip of US$ 1.45 pass max_tip_amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0
   * @param {object} [Param.suggested_tip_amounts] - array of suggested amounts of tips in the smallest units of the currency (integer, not float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed max_tip_amount
   * @param {string} [Param.start_parameter] - Unique deep-linking parameter. If left empty, forwarded copies of the sent message will have a Pay button, allowing multiple users to pay directly from the forwarded message, using the same invoice. If non-empty, forwarded copies of the sent message will have a URL button with a deep link to the bot (instead of a Pay button), with the value used as the start parameter
   * @param {string} [Param.provider_data] - data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider
   * @param {string} [Param.photo_url] - URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service. People like it better when they see what they are paying for
   * @param {number} [Param.photo_size] - Photo size in bytes
   * @param {number} [Param.photo_width] - Photo width
   * @param {number} [Param.photo_height] - Photo height
   * @param {boolean} [Param.need_name] - Pass True if you require the user's full name to complete the order
   * @param {boolean} [Param.need_phone_number] - Pass True if you require the user's phone number to complete the order
   * @param {boolean} [Param.need_email] - Pass True if you require the user's email address to complete the order
   * @param {boolean} [Param.need_shipping_address] - Pass True if you require the user's shipping address to complete the order
   * @param {boolean} [Param.send_phone_number_to_provider] - Pass True if the user's phone number should be sent to provider
   * @param {boolean} [Param.send_email_to_provider] - Pass True if the user's email address should be sent to provider
   * @param {boolean} [Param.is_flexible] - Pass True if the final price depends on the shipping method
   * @param {boolean} [Param.disable_notification] - Sends the message silently. Users will receive a notification with no sound
   * @param {boolean} [Param.protect_content] - Protects the contents of the sent message from forwarding and saving
   * @param {number} [Param.reply_to_message_id] - If the message is a reply, ID of the original message
   * @param {boolean} [Param.allow_sending_without_reply] - Pass True if the message should be sent even if the specified replied-to message is not found
   * @returns the sent Message
   */
  sendInvoice(Param) {
    return Main_("sendInvoice", Param);
  },

  /**
   * Use this method to create a link for an invoice
   *
   * https://core.telegram.org/bots/api#function createinvoicelink(
   * @param {object} Param - Object Parameter to create invoice link
   * @param {string} Param.title - Product name, 1-32 characters
   * @param {string} Param.description - Product description, 1-255 characters
   * @param {string} Param.payload - Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use for your internal processes
   * @param {string} Param.provider_token - Payment provider token, obtained via @BotFather
   * @param {string} Param.currency - Three-letter ISO 4217 currency code
   * @param {object} Param.prices - list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.)
   * @param {number} [Param.max_tip_amount] - The maximum accepted amount for tips in the smallest units of the currency (integer, not float/double). For example, for a maximum tip of US$ 1.45 pass max_tip_amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0
   * @param {object} [Param.suggested_tip_amounts] - array of suggested amounts of tips in the smallest units of the currency (integer, not float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed max_tip_amount
   * @param {string} [Param.provider_data] - data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider
   * @param {string} [Param.photo_url] - URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service. People like it better when they see what they are paying for
   * @param {number} [Param.photo_size] - Photo size in bytes
   * @param {number} [Param.photo_width] - Photo width
   * @param {number} [Param.photo_height] - Photo height
   * @param {boolean} [Param.need_name] - Pass True if you require the user's full name to complete the order
   * @param {boolean} [Param.need_phone_number] - Pass True if you require the user's phone number to complete the order
   * @param {boolean} [Param.need_email] - Pass True if you require the user's email address to complete the order
   * @param {boolean} [Param.need_shipping_address] - Pass True if you require the user's shipping address to complete the order
   * @param {boolean} [Param.send_phone_number_to_provider] - Pass True if the user's phone number should be sent to provider
   * @param {boolean} [Param.send_email_to_provider] - Pass True if the user's email address should be sent to provider
   * @param {boolean} [Param.is_flexible] - Pass True if the final price depends on the shipping method
   * @returns the created invoice link as String on success
   */
  createInvoiceLink(Param) {
    return Main_("createInvoiceLink", Param);
  },

  /**
   * If you sent an invoice requesting a shipping address and the parameter is_flexible was specified, the Bot API will send an Update with a shipping_query field to the bot. Use this method to reply to shipping queries
   *
   * https://core.telegram.org/bots/api#answershippingquery
   * @param {object} Param - Object Parameter to answer shipping query
   * @param {string} Param.shipping_query_id - Unique identifier for the query to be answered
   * @param {boolean} Param.ok - Pass True if delivery to the specified address is possible and False if there are any problems (for example, if delivery to the specified address is not possible)
   * @param {object} [Param.shipping_options] - Required if ok is True. A JSON-serialized array of available shipping options
   * @param {string} [Param.error_message] - Required if ok is False. Error message in human readable form that explains why it is impossible to complete the order (e.g. "Sorry, delivery to your desired address is unavailable'). Telegram will display this message to the user
   * @returns True On success
   */
  answerShippingQuery(Param) {
    return Main_("answerShippingQuery", Param);
  },

  /**
   * Once the user has confirmed their payment and shipping details, the Bot API sends the final confirmation in the form of an Update with the field pre_checkout_query. Use this method to respond to such pre-checkout queries
   *
   * https://core.telegram.org/bots/api#answerprecheckoutquery
   * @param {object} Param - Object Parameter to answer pre checkout query
   * @param {string} Param.shipping_query_id - Unique identifier for the query to be answered
   * @param {boolean} Param.ok - Specify True if everything is alright (goods are available, etc.) and the bot is ready to proceed with the order. Use False if there are any problems
   * @param {string} [Param.error_message] - Required if ok is False. Error message in human readable form that explains why it is impossible to complete the order (e.g. "Sorry, delivery to your desired address is unavailable'). Telegram will display this message to the user
   * @returns True On success
   */
  answerPreCheckoutQuery(Param) {
    return Main_("answerPreCheckoutQuery", Param);
  },


  /**
   * Use this method to send static .WEBP, animated .TGS, or video .WEBM stickers
   *
   * https://core.telegram.org/bots/api#sendsticker
   * @param {object} Param - Object Parameter to send sticker
   * @param {string} Param.chat_id - Unique identifier for the target chat or username of the target channel
   * @param {string} Param.sticker - Sticker to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a .WEBP file from the Internet, or upload a new one using multipart/form-data
   * @param {number} [Param.message_thread_id] - Unique identifier for the target message thread (topic) of the forum; for forum supergroups only
   * @param {object} [Param.reply_markup] - object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user
   * @param {boolean} [Param.disable_notification] - Sends the message silently. Users will receive a notification with no sound
   * @param {boolean} [Param.protect_content] - Protects the contents of the sent message from forwarding and saving
   * @param {number} [Param.reply_to_message_id] - If the message is a reply, ID of the original message
   * @param {boolean} [Param.allow_sending_without_reply] - Pass True if the message should be sent even if the specified replied-to message is not found
   * @returns the sent Message
   */
  sendSticker(Param) {
    return Main_("sendSticker", Param);
  },

  /**
   * Use this method to get a sticker set
   *
   * https://core.telegram.org/bots/api#getstickerset
   *
   * @param {string} Param.name - Name of the sticker set
   * @returns StickerSet object
   */
  getStickerSet(Param) {
    return Main_("getStickerSet", Param);
  },

  /**
   * Use this method to get information about custom emoji stickers by their identifiers
   * @param {object} Param - Object Parameter to get custom emoji stickers
   * @param {object} Param.custom_emoji_ids - List of custom emoji identifiers. At most 200 custom emoji identifiers can be specified
   * @returns Array of Sticker objects
   */
  getCustomEmojiStickers(Param) {
    return Main_("getCustomEmojiStickers", Param);
  },

  /**
   * Use this method to upload a .PNG file with a sticker for later use in createNewStickerSet and addStickerToSet methods (can be used multiple times)
   *
   * https://core.telegram.org/bots/api#uploadstickerfile
   * @param {object} Param - Object Parameter to upload sticker file
   * @param {number} Param.user_id - User identifier of sticker file owner
   * @param {string} Param.png_sticker - PNG image with the sticker, must be up to 512 kilobytes in size, dimensions must not exceed 512px, and either width or height must be exactly 512px
   * @returns the uploaded File on success
   */
  uploadStickerFile(Param) {
    return Main_("uploadStickerFile", Param);
  },

  /**
   * Use this method to create a new sticker set owned by a user. The bot will be able to edit the sticker set thus created. You must use exactly one of the fields png_sticker, tgs_sticker, or webm_sticker
   *
   * https://core.telegram.org/bots/api#createnewstickerset
   * @param {object} Param - Object Parameter to create new sticker set
   * @param {number} Param.user_id - User identifier of created sticker set owner
   * @param {string} Param.name - Short name of sticker set, to be used in t.me/addstickers/ URLs (e.g., animals). Can contain only English letters, digits and underscores. Must begin with a letter, can't contain consecutive underscores and must end in "_by_<bot_username>". <bot_username> is case insensitive. 1-64 characters
   * @param {string} Param.title - Sticker set title, 1-64 characters
   * @param {string} [Param.png_sticker] - PNG image with the sticker, must be up to 512 kilobytes in size, dimensions must not exceed 512px, and either width or height must be exactly 512px. Pass a file_id as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data
   * @param {string} [Param.tgs_sticker] - TGS animation with the sticker, uploaded using multipart/form-data
   * @param {string} [Param.webm_sticker] - WEBM video with the sticker, uploaded using multipart/form-data
   * @param {string} [Param.sticker_type] - Type of stickers in the set, pass “regular” or “mask”. Custom emoji sticker sets can't be created via the Bot API at the moment. By default, a regular sticker set is created
   * @param {string} [Param.emojis] - One or more emoji corresponding to the sticker
   * @param {object} [Param.mask_position] - object for position where the mask should be placed on faces
   * @returns True on success
   */
  createNewStickerSet(Param) {
    return Main_("createNewStickerSet", Param);
  },

  /**
   * Use this method to add a new sticker to a set created by the bot. You must use exactly one of the fields png_sticker, tgs_sticker, or webm_sticker. Animated stickers can be added to animated sticker sets and only to them. Animated sticker sets can have up to 50 stickers. Static sticker sets can have up to 120 stickers
   *
   * https://core.telegram.org/bots/api#addstickertoset
   * @param {object} Param - Object Parameter to add sticker to set
   * @param {number} Param.user_id - User identifier of sticker set owner
   * @param {string} Param.name - Sticker set name
   * @param {string} Param.png_sticker - PNG image with the sticker, must be up to 512 kilobytes in size, dimensions must not exceed 512px, and either width or height must be exactly 512px. Pass a file_id as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data
   * @param {string} Param.tgs_sticker - TGS animation with the sticker, uploaded using multipart/form-data
   * @param {string} Param.webm_sticker - WEBM video with the sticker, uploaded using multipart/form-data
   * @param {string} Param.emojis - One or more emoji corresponding to the sticker
   * @param {object} Param.mask_position - object for position where the mask should be placed on faces
   * @returns
   */
  addStickerToSet(Param) {
    return Main_("addStickerToSet", Param);
  },

  /**
   * Use this method to move a sticker in a set created by the bot to a specific position
   *
   * https://core.telegram.org/bots/api#setstickerpositioninset
   * @param {object} Param - Object Parameter to set sticker position in set
   * @param {string} [Param.sticker] - File identifier of the sticker
   * @param {number} [Param.position] - New sticker position in the set, zero-based
   * @returns True on success
   */
  setStickerPositionInSet(Param) {
    return Main_("setStickerPositionInSet", Param);
  },

  /**
   * Use this method to delete a sticker from a set created by the bot
   *
   * https://core.telegram.org/bots/api#deletestickerfromset
   * @param {object} Param - Object Parameter to delete sticker from set
   * @param {string} [Param.sticker] - File identifier of the sticker
   * @returns True on success
   */
  deleteStickerFromSet(Param) {
    return Main_("deleteStickerFromSet", Param);
  },

  /**
   * Use this method to set the thumbnail of a sticker set. Animated thumbnails can be set for animated sticker sets only. Video thumbnails can be set only for video sticker sets only
   * @param {object} Param - Object Parameter to set sticker set thumb
   * @param {string} Param.name - Sticker set name
   * @param {number} [Param.user_id] - User identifier of the sticker set owner
   * @param {string} [Param.thumbnail] - A PNG image with the thumbnail, must be up to 128 kilobytes in size and have width and height exactly 100px, or a TGS animation with the thumbnail up to 32 kilobytes in size
   * @returns True on success
   */
  setStickerSetThumbnail(Param) {
    return Main_("setStickerSetThumbnail", Param);
  },

  /**
   * Use this method to edit text and game messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned
   * https://core.telegram.org/bots/api#editmessagetext
   * @param {object} Param - Object Parameter to edit message text
   * @param {string} [Param.chat_id] - Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target channel
   * @param {number} [Param.message_id] - Required if inline_message_id is not specified. Identifier of the message to edit
   * @param {number} [Param.inline_message_id] - Required if chat_id and message_id are not specified. Identifier of the inline message
   * @param {string} Param.text - New text of the message, 1-4096 characters after entities parsing
   * @param {string} [Param.parse_mode] - Mode for parsing entities in the message text
   * @param {object} [Paramreply_markup] - object for an inline keyboard
   * @param {object} [Param.entities] - list of special entities that appear in message text, which can be specified instead of parse_mode
   * @param {boolean} [Param.disable_web_page_preview] - Disables link previews for links in this message
   */
  editMessageText(Param) {
    return Main_("editMessageText", Param);
  },

  /**
   * Use this method to edit captions of messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned
   * https://core.telegram.org/bots/api#editmessagecaption
   * @param {object} Param - Object Parameter to edit message caption
   * @param {string} [Param.chat_id] - Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target channel
   * @param {number} [Param.message_id] - Required if inline_message_id is not specified. Identifier of the message to edit
   * @param {number} [Param.inline_message_id] - Required if chat_id and message_id are not specified. Identifier of the inline message
   * @param {string} [Param.caption] - New caption of the message, 0-1024 characters after entities parsing
   * @param {string} [Param.parse_mode] - Mode for parsing entities in the message caption
   * @param {object} [Param.reply_markup] - object for an inline keyboard
   * @param {object} [Param.caption_entities] - list of special entities that appear in the caption, which can be specified instead of parse_mode
   */
  editMessageCaption(Param) {
    return Main_("editMessageCaption", Param);
  },

  /**
   * Use this method to edit animation, audio, document, photo, or video messages. If a message is part of a message album, then it can be edited only to an audio for audio albums, only to a document for document albums and to a photo or a video otherwise. When an inline message is edited, a new file can't be uploaded; use a previously uploaded file via its file_id or specify a URL. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned
   * https://core.telegram.org/bots/api#editmessagemedia
   * @param {object} Param - Object Parameter to edit message media
   * @param {string} Param.media - object for a new media content of the message
   * @param {string} [Param.chat_id] - Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target channel
   * @param {number} [Param.message_id] - Required if inline_message_id is not specified. Identifier of the message to edit
   * @param {number} [Param.inline_message_id] - Required if chat_id and message_id are not specified. Identifier of the inline message
   * @param {object} [Param.reply_markup] - object for a new inline keyboard
   */
  editMessageMedia(Param) {
    return Main_("editMessageMedia", Param);
  },

  /**
   * Use this method to edit only the reply markup of messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned
   * https://core.telegram.org/bots/api#editmessagereplymarkup
   * @param {object} Param - Object Parameter to edit message reply markup
   * @param {string} [Param.chat_id] - Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target channel
   * @param {number} [Param.message_id] - Required if inline_message_id is not specified. Identifier of the message to edit
   * @param {number} [Param.inline_message_id] - Required if chat_id and message_id are not specified. Identifier of the inline message
   * @param {object} [Param.reply_markup] - object for an inline keyboard
   */
  editMessageReplyMarkup(Param) {
    return Main_("editMessageReplyMarkup", Param);
  },

  /**
   * Use this method to delete a message, including service messages
   * https://core.telegram.org/bots/api#deletemessage
   * @param {object} Param - Object Parameter to delete message
   * @param {string} [Param.chat_id] - Unique identifier for the target chat or username of the target channel
   * @param {number} [Param.message_id] - Identifier of the message to delete
   */
  deleteMessage(Param) {
    return Main_("deleteMessage", Param);
  },
};



/** 
 * @typedef {object} 
 * @property {*} Connect
 * @property {*} AppendRow()
 * @property {string} title
 * @property {boolean} completed
 */
var SheetDB = {
  connect: undefined,

  /**
   * Adds values from Array to the last row of the sheet
   * @param {object} ArrayOfValues - Array containing values
   */
  appendRow(ArrayofValues) {
    return this.connect.appendRow(ArrayofValues);
  },

  /**
   * Clear Full Sheet
   * @param {string} sheetId - sheetId from sheet url
   * @param {string} sheetName - unique sheet name
   * @returns
   */
  clearFullSheet() {
    return this.connect.clear();
  },

  /**
   * clears values between range specified
   * @param {string} Range - range to clear values
   * @returns
   */
  clearByRange(row, col, numCol = 1, numRow = 1) {
    return this.connect.getRange(row, col, numCol, numRow).clear();
  },

  /**
   * Clear single value at specific coordinates
   * @param {number} x - row
   * @param {number} y - col
   * @returns value
   */
  clearValue(row, col) {
    return this.connect.getRange(row, col).clear();
  },

  findOne(query) {
    return this.connect.createTextFinder(query).findNext();
  },

  findAll(query) {
    return this.connect.createTextFinder(query).findAll();
  },

  deleteColumn(colNum) {
    return this.connect.deleteColumn(colNum);
  },

  /**
   * Deletes column starting at given index , and how Many to delete
   */
  deleteColumns(colIndex, howMany) {
    return this.connect.deleteColumns(colIndex, howMany);
  },

  /**
   * Deletes a row at a specific position
   */
  deleteRow(rowNum) {
    return this.connect.deleteRow(rowNum);
  },

  deleteRows(rowIndex, howmany) {
    return this.connect.deleteRows(rowIndex, howmany);
  },

  /**
   * Gets All Data found on the sheet
   * @returns
   */
  getSheetData() {
    return this.connect.getDataRange().getValues();
  },

  getLastColumn() {
    return this.connect.getLastColumn();
  },

  getLastRow() {
    return this.connect.getLastRow();
  },

  insertColumnAfter(indexCol) {
    return this.connect.insertColumnAfter(indexCol);
  },
  insertColumnBefore(indexCol) {
    return this.connect.insertColumnBefore(indexCol);
  },
  /**
   * insert columns
   * @param {*} indexCol - index to insert a new column
   * @param {*} [numberOfColumn] - number of columns to be added
   * @returns
   */
  insertColumns(indexCol, howMany) {
    return this.connect.insertColumns(indexCol, howMany);
  },

  insertColumnsAfter(afterPosition, howMany) {
    return this.connect.insertColumnsAfter(afterPosition, howMany);
  },

  insertColumnsBefore(beforePosition, howMany) {
    return this.connect.insertColumnsBefore(beforePosition, howMany);
  },
  insertRowAfter(afterPosition) {
    return this.connect.insertRowAfter(afterPosition);
  },
  insertRowBefore(beforePosition) {
    return this.connect.insertRowBefore(beforePosition);
  },
  /**
   *
   * @param {*} rowIndex - index at wich rows will be inserted
   * @param {*} [numRows] - Number of rows to be added
   * @returns
   */
  insertRows(rowIndex, numRows) {
    return this.connect.insertRows(rowIndex, numRows);
  },

  insertRowsAfter(afterPosition, howMany) {
    return this.connect.insertRowsAfter(afterPosition, howMany);
  },

  insertRowsBefore(beforePosition, howMany) {
    return this.connect.insertRowsBefore(beforePosition, howMany);
  },

  /**
   * Moves Range of Columns
   * @param {string} Range - range 
   * @param {string} destinationIndex - move the columns before destinationIndex 
   */
  moveColumns(Range, destinationIndex) {
    let columnSpec = this.connect.getRange(Range)
    return this.connect.moveColumns(columnSpec, destinationIndex);
  },

  /**
   * Moves Range of Rows
   * @param {string} Range - range 
   * @param {string} destinationIndex - move the rows before destinationIndex 
   */
  moveRows(Range, destinationIndex) {
    let rowSpec = this.connect.getRange(Range)
    return this.connect.moveRows(rowSpec, destinationIndex);
  },
  /**
   * Update Sheet Name
   * @param {string} name
   * @returns
   */
  setName(name) {
    return this.connect.setName(name);
  },

  sortByColumn(columnPosition, sort = true) {
    return this.connect.sort(columnPosition, sort);
  },

  /**
   *
   * @param {number | string} value - value to be inserted
   * @param {number} row - row to insert
   * @param {number} col - column to insert
   * @param {number} numRow - number of rows to inserted in
   * @param {number} numCol - number of column to be inserted in
   * @returns
   */
  saveOne(value, row, col, numRow = 1, numCol = 1) {
    return this.connect.getRange(row, col, numRow, numCol).setValue(value);
  },

  /**
   *
   * @param {object} arrayOfvalues - Array of array like : [ [1,2,3],[4,5,6] ]
   * @param {number} row - row to insert
   * @param {number} col - column to insert
   * @param {number} numRow - number of rows to inserted in
   * @param {number} numCol - number of column to
   * @returns
   */
  saveMany(arrayOfvalues, row, col, numRow = 1, numCol = 1) {
    return this.connect.getRange(row, col, numRow, numCol).setValues(
      arrayOfvalues
    );
  },

  /**
    *
    * @param {number} row - row to insert
    * @param {number} col - column to insert
    * @returns value
    */
  getValue(row, col) {
    return this.connect.getRange(row, col).getValue()
  },

  /**
    *
    * @param {object} arrayOfvalues - Array of array like : [ [1,2,3],[4,5,6] ]
    * @param {number} row - row to insert
    * @param {number} col - column to insert
    * @param {number} numRow - number of rows to inserted in
    * @param {number} numCol - number of column to
    * @returns array of array
    */
  getValues(row, col, numRow = 1, numCol = 1) {
    return this.connect.getRange(row, col, numRow, numCol).getValues()
  }

};


/**
 * Initializes the Telesun object with the provided bot token and event object.
 *
 * `Example:`
 * ```js
 * const apiResponse = Telesun('your-bot-token');
 * console.log(apiResponse);
 * ```
 * 
 * @param {string} botToken - The token for the Telegram bot.
 * @param {Object} e - The event object.
 * @returns {Object} - The API object.
 * @throws {Error} - Throws an error if the token is unauthorized or invalid.
 */
var Telesun = class Telesun {
  constructor(botToken, e) {

    if (botToken && typeof botToken === "string") {

      Constants.TELEGRAM_API_URL = Constants.TELEGRAM_API_URL + botToken;

      if (e && e.postData && e.postData.contents) { Context.api = JSON.parse(e.postData.contents); }
      else { Context.api = GetLatestUpdate_(botToken); }

      return this;

    } else { throw new Error("Unauthorized, Invalid Token"); }

  }
  /**
    * @typedef {object} ctx
    * @property {Object} message
    * @property {Object} chat
    * @property {Object} from
    * @property {boolean} getStage
    * @property {Object} reply
    * @property {Object} replyWithHtml
    * @property {Object} replyWithMarkdown
    * @property {Object} replyWithPhoto
    * @property {Object} replyWithChatAction
    * @property {Object} replyWithEditedMessage
    * @property {Object} getStage
    * @property {Object} clearStage
    * @property {Object} setStage
    * @property {Object} getMe
    * @property {Object} logOut
    * @property {Object} close
    * @property {Object} sendMessage
    * @property {Object} forwardMessage
    * @property {Object} copyMessage
    * @property {Object} sendPhoto
    * @property {Object} sendAudio
    * @property {Object} sendDocument
    * @property {Object} sendVideo
    * @property {Object} sendAnimation
    * @property {Object} sendVoice
    * @property {Object} sendVideoNote
    * @property {Object} sendMediaGroup
    * @property {Object} sendLocation
    * @property {Object} editMessageLiveLocation
    * @property {Object} sendGame
    * @property {Object} setGameScore
    * @property {Object} getGameHighScores
    * @property {Object} answerInlineQuery
    * @property {Object} answerWebAppQuery
    * @property {Object} setMyCommands
    * @property {Object} stopMessageLiveLocation
    * @property {Object} sendVenue
    * @property {Object} sendContact
    * @property {Object} sendPoll
    * @property {Object} sendDice
    * @property {Object} sendChatAction
    * @property {Object} getUserProfilePhotos
    * @property {Object} getFile
    * @property {Object} banChatMember
    * @property {Object} unbanChatMember
    * @property {Object} restrictChatMember
    * @property {Object} promoteChatMember
    * @property {Object} setChatAdministratorCustomTitle
    * @property {Object} banChatSenderChat
    * @property {Object} unbanChatSenderChat
    * @property {Object} setChatPermissions
    * @property {Object} exportChatInviteLink
    * @property {Object} createChatInviteLink
    * @property {Object} editChatInviteLink
    * @property {Object} revokeChatInviteLink
    * @property {Object} approveChatJoinRequest
    * @property {Object} declineChatJoinRequest
    * @property {Object} setChatPhoto
    * @property {Object} deleteChatPhoto
    * @property {Object} setChatTitle
    * @property {Object} setChatDescription
    * @property {Object} pinChatMessage
    * @property {Object} unpinChatMessage
    * @property {Object} unpinAllChatMessages
    * @property {Object} leaveChat
    * @property {Object} getChat
    * @property {Object} getChatAdministrators
    * @property {Object} getChatMemberCount
    * @property {Object} getChatMember
    * @property {Object} setChatStickerSet
    * @property {Object} deleteChatStickerSet
    * @property {Object} answerCallbackQuery
    * @property {Object} deleteMyCommands
    * @property {Object} getMyCommands
    * @property {Object} setChatMenuButton
    * @property {Object} getChatMenuButton
    * @property {Object} setMyDefaultAdministratorRights
    * @property {Object} getMyDefaultAdministratorRights
    * @property {Object} sendInvoice
    * @property {Object} createInvoiceLink
    * @property {Object} answerShippingQuery
    * @property {Object} answerPreCheckoutQuery
    * @property {Object} sendSticker
    * @property {Object} getStickerSet
    * @property {Object} getCustomEmojiStickers
    * @property {Object} uploadStickerFile
    * @property {Object} createNewStickerSet
    * @property {Object} addStickerToSet
    * @property {Object} setStickerPositionInSet
    * @property {Object} deleteStickerFromSet
    * @property {Object} setStickerSetThumb
    * @property {Object} editMessageText
    * @property {Object} editMessageCaption
    * @property {Object} editMessageMedia
    * @property {Object} editMessageReplyMarkup
    * @property {Object} deleteMessage
    */
  /**
    *
    * This callback is displayed as a global member.
    * @callback ctxfunc
    * @param {ctx} ctx - global context
    */
  /**
  * Executes in every cases.
  *
  * @param {ctxfunc} callback - The callback function to be executed.
  * @returns {any} - The result of the callback function execution.
  */
  Use(callback) {
    if (!Constants.NEXT_MIDDLEWARE) { return; };
    Middleware_(callback);
  }
  /**
  * Executes the provided middleware function only if the current stage matches the specified stage(s).
  * @param {string|number|string[]|number[]} stage - The stage(s) to check against the current stage.
  * @param {function} middleware - The middleware function to execute.
  */
  Stage(Stage, callback) {
    let _Stage = Context.getStage();
    if (!Constants.NEXT_MIDDLEWARE || !Context.api || !_Stage) { return; };

    if (Array.isArray(Stage)) {
      if (!Stage.includes(_Stage)) { return; }
    } else if (Stage !== _Stage) { return; }

    Middleware_(callback);
  }
  /**
  * Executes the provided callback function if middleware and the required API properties are available for an `message`.
  *
  * @param {Function} callback - The callback function to be executed.
  */
  Message(callback) {
    if (!Constants.NEXT_MIDDLEWARE || !Context.api || !Context.api.message) { return; };
    Middleware_(callback);
  }
  /**
  * Executes the provided callback function if middleware and the required API properties are available for an `edited_message`.
  *
  * @param {Function} callback - The callback function to be executed.
  */
  Edited_message(callback) {
    if (!Constants.NEXT_MIDDLEWARE || !Context.api || !Context.api.edited_message) { return; };
    Middleware_(callback);
  }
  /**
  * Executes the provided callback function if middleware and the required API properties are available for `channel_post`.
  *
  * @param {Function} callback - The callback function to be executed.
  */
  Channel_post(callback) {
    if (!Constants.NEXT_MIDDLEWARE || !Context.api || !Context.api.channel_post) { return; };
    Middleware_(callback);
  }
  /**
  * Executes the provided callback function if middleware and the required API properties are available for `edited_channel_post`.
  *
  * @param {Function} callback - The callback function to be executed.
  */
  Edited_channel_post(callback) {
    if (!Constants.NEXT_MIDDLEWARE || !Context.api || !Context.api.edited_channel_post) { return; };
    Middleware_(callback);
  }
  /**
  * Executes the provided callback function if middleware and the required API properties are available for `chosen_inline_result`.
  *
  * @param {Function} callback - The callback function to be executed.
  */
  Chosen_inline_result(callback) {
    if (!Constants.NEXT_MIDDLEWARE || !Context.api || !Context.api.chosen_inline_result) { return; };
    Middleware_(callback);
  }
  /**
  * Executes the provided callback function if middleware and the required API properties are available for `shipping_query`.
  *
  * @param {Function} callback - The callback function to be executed.
  */
  Shipping_query(callback) {
    if (!Constants.NEXT_MIDDLEWARE || !Context.api || !Context.api.shipping_query) { return; };
    Middleware_(callback);
  }
  /**
  * Executes the provided callback function if middleware and the required API properties are available for `pre_checkout_query`.
  *
  * @param {Function} callback - The callback function to be executed.
  */
  Pre_checkout_query(callback) {
    if (!Constants.NEXT_MIDDLEWARE || !Context.api || !Context.api.pre_checkout_query) { return; };
    Middleware_(callback);
  }
  /**
  * Executes the provided callback function if middleware and the required API properties are available for `poll`.
  *
  * @param {Function} callback - The callback function to be executed.
  */
  Poll(callback) {
    if (!Constants.NEXT_MIDDLEWARE || !Context.api || !Context.api.poll) { return; };
    Middleware_(callback);
  }
  /**
  * Executes the provided callback function if middleware and the required API properties are available for `poll_answer`.
  *
  * @param {Function} callback - The callback function to be executed.
  */
  Poll_answer(callback) {
    if (!Constants.NEXT_MIDDLEWARE || !Context.api || !Context.api.poll_answer) { return; };
    Middleware_(callback);
  }
  /**
  * Executes the provided callback function if middleware and the required API properties are available for `my_chat_member`.
  *
  * @param {Function} callback - The callback function to be executed.
  */
  My_chat_member(callback) {
    if (!Constants.NEXT_MIDDLEWARE || !Context.api || !Context.api.my_chat_member) { return; };
    Middleware_(callback);
  }
  /**
  * Executes the provided callback function if middleware and the required API properties are available for `chat_member`.
  *
  * @param {Function} callback - The callback function to be executed.
  */
  Chat_member(callback) {
    if (!Constants.NEXT_MIDDLEWARE || !Context.api || !Context.api.chat_member) { return; };
    Middleware_(callback);
  }
  /**
  * Executes the provided callback function if middleware and the required API properties are available for `chat_join_request`.
  *
  * @param {Function} callback - The callback function to be executed.
  */
  Chat_join_request(callback) {
    if (!Constants.NEXT_MIDDLEWARE || !Context.api || !Context.api.chat_join_request) { return; };
    Middleware_(callback);
  }
  /**
  * Executes the provided callback function if middleware and the required API properties are available for `text=/start`.
  *
  * @param {Function} callback - The callback function to be executed.
  */
  Start(callback) {
    if (!Constants.NEXT_MIDDLEWARE ||
      !Context.api ||
      !Context.api.message ||
      Context.api.message.text !== "/start") { return; };

    Middleware_(callback);
  }
  /**
  * Executes the provided callback function if middleware and the required API properties are available for `text=/help`.
  *
  * @param {Function} callback - The callback function to be executed.
  */
  Help(callback) {
    if (!Constants.NEXT_MIDDLEWARE ||
      !Context.api ||
      !Context.api.message ||
      Context.api.message.text !== "/help") { return; };
    Middleware_(callback);
  }
  /**
  * Executes the provided callback function if middleware and the required API properties are available for `callback_query`.
  *
  * @param {Function} callback - The callback function to be executed.
  */
  Cbquery(callback) {
    if (!Constants.NEXT_MIDDLEWARE || !Context.api || !Context.api.callback_query) { return; };
    Middleware_(callback);
  }
  /**
  * Executes the provided callback function based on the specified value and the presence of a callback_query.
  *
  * @param {string|Object} Value - The value or pattern to match against the callback_query data.
  * @param {Function} callback - The callback function to be executed.
  */
  Action(Value, callback) {
    if (!Constants.NEXT_MIDDLEWARE || !Context.api || !Context.api.callback_query) { return; };
    let _Data = Context.api.callback_query.data;

    if (typeof Value === "string" || typeof Value === "object") {
      if (typeof Value === "string" && !_Data.includes(Value)) { return; }
      else if (typeof Value === "object") {
        try {
          /** Array && string elements */
          if (Array.isArray(Value)) {
            if (!Value.includes(_Data)) { return; };
          } else if (!Value.test(_Data)) { return; };

          /** Object && regex */
        } catch (err) {
          throw new Error(
            "--- ❌ Input Value Can Not Include RegEx or object---"
          );
        }
      }

      Middleware_(callback);
    }
  }
  /**
  * Executes the provided callback function if the message text matches the specified value.
  *
  * @param {string|Object} Text - The text or pattern to match against the message text.
  * @param {Function} callback - The callback function to be executed.
  */
  Hears(Text, callback) {
    if (!Constants.NEXT_MIDDLEWARE ||
      !Context.api ||
      !Context.api.message ||
      !Context.api.message.text)
      return;

    let _Text = Context.api.message.text;

    if (typeof Text === "string" || typeof Text === "object") {

      if (typeof Text === "string") {
        if (_Text !== Text) { return; };
      } else if (typeof Text === "object") {
        try {
          if (Array.isArray(Text)) {
            if (!Text.includes(_Text)) { return; };
          } else if (!Text.test(_Text)) { return; };
        } catch (err) {
          throw new Error(
            "--- ❌ Input Value Can Not Include RegEx or object---"
          );
        }
      }

      Middleware_(callback);
    }
  }
  /**
  * Executes the provided callback function if middleware and the required API properties are available for `contact`.
  *
  * @param {Function} callback - The callback function to be executed.
  */
  Contact(callback) {
    if (!Constants.NEXT_MIDDLEWARE || !Context.api || !Context.api.message || !Context.api.message.contact) { return; };
    Middleware_(callback);
  }
  /**
  * Executes the provided callback function if middleware and the required API properties are available for `inline_query`.
  *
  * @param {Function} callback - The callback function to be executed.
  */
  Inline_query(callback) {
    if (!Constants.NEXT_MIDDLEWARE || !Context.api || !Context.api.inline_query) { return; };
    Middleware_(callback);
  }
  /**
  * Executes the provided callback function if middleware and the required API properties are available for `photo`.
  *
  * @param {Function} callback - The callback function to be executed.
  */
  Photo(callback) {
    if (!Constants.NEXT_MIDDLEWARE || !Context.api || !Context.api.message || !Context.api.message.photo) { return; };
    Middleware_(callback);
  }
  /**
  * Executes the provided callback function if middleware and the required API properties are available for `video`.
  *
  * @param {Function} callback - The callback function to be executed.
  */
  Video(callback) {
    if (!Constants.NEXT_MIDDLEWARE || !Context.api || !Context.api.message || !Context.api.message.video) { return; };
    Middleware_(callback);
  }
  /**
  * Executes the provided callback function if middleware and the required API properties are available for `voice`.
  *
  * @param {Function} callback - The callback function to be executed.
  */
  Voice(callback) {
    if (!Constants.NEXT_MIDDLEWARE || !Context.api || !Context.api.message || !Context.api.message.voice) { return; };
    Middleware_(callback);
  }
  /**
  * Executes the provided callback function if middleware and the required API properties are available for `document`.
  *
  * @param {Function} callback - The callback function to be executed.
  */
  Document(callback) {
    if (!Constants.NEXT_MIDDLEWARE ||
      !Context.api ||
      !Context.api.message ||
      !Context.api.message.document) { return; };

    Middleware_(callback);
  }
  /**
  * Executes the provided callback function if middleware and the required API properties are available for `audio`.
  *
  * @param {Function} callback - The callback function to be executed.
  */
  Audio(callback) {
    if (!Constants.NEXT_MIDDLEWARE || !Context.api || !Context.api.message || !Context.api.message.audio) { return; };
    Middleware_(callback);
  }
  /**
  * Executes the provided callback function if middleware and the required API properties are available for any `text`.
  *
  * @param {Function} callback - The callback function to be executed.
  */
  Text(callback) {
    if (!Constants.NEXT_MIDDLEWARE || !Context.api || !Context.api.message || !Context.api.message.text) { return; };
    Middleware_(callback);
  }
  /**
  * Executes the provided callback function if middleware and the required API properties are available for `sticker`.
  *
  * @param {Function} callback - The callback function to be executed.
  */
  Stiker(callback) {
    if (!Constants.NEXT_MIDDLEWARE || !Context.api || !Context.api.message || !Context.api.message.sticker) { return; };
    Middleware_(callback);
  }
  /**
  * Executes the provided callback function if middleware and the required API properties are available for any `bot_command`.
  *
  * @param {Function} callback - The callback function to be executed.
  */
  Commands(callback) {
    if (!Constants.NEXT_MIDDLEWARE ||
      !Context.api ||
      !Context.api.message ||
      !Context.api.message.entities ||
      Context.api.message.entities[0].type !== "bot_command") { return; };
    Middleware_(callback);
  }
  /**
  * Executes the provided callback function if middleware and the required API properties are available for specified `bot_command`.
  *
  * @param {Function} callback - The callback function to be executed.
  */
  Command(Command, callback) {
    if (!Constants.NEXT_MIDDLEWARE ||
      !Context.api ||
      !Context.api.message ||
      !Context.api.message.entities ||
      Context.api.message.entities[0].type !== "bot_command") { return; };

    if (typeof Command == "string" || typeof Command == "object") {
      let _Text = Context.api.message.text.slice(1);

      /**check if command matched up*/
      if (typeof Command === "string") {
        if (_Text !== Command) { return; };
      } else if (typeof Command === "object") {
        try {

          if (Array.isArray(Command)) {
            if (!Command.includes(_Text)) { return; };
          } else if (!Command.test(_Text)) { return; };


        } catch (err) {

          throw new Error("--- ❌ Input Value Can Not Include RegEx or object---");

        }
      }

      /** Allow func.. to run */
      Middleware_(callback);
    }
  }
}


/**
 * Use this method to receive incoming updates using long polling (wiki)
 *
 * https://core.telegram.org/bots/api#getupdates
 * @param {object} [Param] - Object Parameter to get Updates
 * @param {array}  [Param.allowed_updates]  - list of the update types you want your bot to receive. For example, specify [“message”, “edited_channel_post”, “callback_query”] to only receive updates of these types. See Update for a complete list of available update types. Specify an empty list to receive all update types except chat_member (default). If not specified, the previous setting will be used. Please note that this parameter doesn't affect updates created before the call to the getUpdates, so unwanted updates may be received for a short period of time
 * @param {number} [Param.offset] - Identifier of the first update to be returned. Must be greater by one than the highest among the identifiers of previously received updates. By default, updates starting with the earliest unconfirmed update are returned. An update is considered confirmed as soon as getUpdates is called with an offset higher than its update_id. The negative offset can be specified to retrieve updates starting from -offset update from the end of the updates queue. All previous updates will forgotten
 * @param {number} [Param.limit] - Limits the number of updates to be retrieved. Values between 1-100 are accepted. Defaults to 100
 * @param {number} [Param.timeout] - Timeout in seconds for long polling. Defaults to 0, i.e. usual short polling. Should be positive, short polling should be used for testing purposes only
 * @returns an Array of Update objects
 */
function getUpdates(botToken, timeout) {
  const data = {
    method: "post",
    payload: {
      method: "getUpdates",
      allowed_updates: JSON.stringify(Constants.ALLOWED_UPDATES),
      offset: Constants.NEW_REQUEST_UPDATE,
      // limit: limit,#default value used = 100
      timeout: timeout,

    }
  };
  return Api_(botToken, data)
}

/**
 * Use this method to specify a URL and receive incoming updates via an outgoing webhook. Whenever there is an update for the bot, we will send an HTTPS POST request to the specified URL, containing a JSON-serialized Update. In case of an unsuccessful request, we will give up after a reasonable amount of attempts. 
 * If you'd like to make sure that the webhook was set by you, you can specify secret data in the parameter secret_token. If specified, the request will contain a header “X-Telegram-Bot-Api-Secret-Token” with the secret token as content
* https://core.telegram.org/bots/api#setwebhook
* @param {object} Param - Object Parameter to set webhook
* @param {string} Param.url - HTTPS URL to send updates to. Use an empty string to remove webhook integration
* @param {string} [Param.certificate] - Upload your public key certificate so that the root certificate in use can be checked
* @param {string} [Param.ip_address] - The fixed IP address which will be used to send webhook requests instead of the IP address resolved through DNS
* @param {integer} [Param.max_connections] - The maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery, 1-100. Defaults to 40. Use lower values to limit the load on your bot's server, and higher values to increase your bot's throughput
* @param {array} [Param.allowed_updates] - list of the update types you want your bot to receive. For example, specify [“message”, “edited_channel_post”, “callback_query”] to only receive updates of these types. See Update for a complete list of available update types. Specify an empty list to receive all update types except chat_member (default). If not specified, the previous setting will be used.
Please note that this parameter doesn't affect updates created before the call to the setWebhook, so unwanted updates may be received for a short period of time
* @param {boolean} [Param.drop_pending_updates] -  Pass True to drop all pending updates
* @param {string} [Param.secret_token] - A secret token to be sent in a header “X-Telegram-Bot-Api-Secret-Token” in every webhook request, 1-256 characters. Only characters A-Z, a-z, 0-9, _ and - are allowed. The header is useful to ensure that the request comes from a webhook set by you
* @Returns True on success
*/
function setWebHook(botToken, { url: url, certificate: certificate,
  ip_address: ip_address, max_connections: max_connections,
  drop_pending_updates: drop_pending_updates,
  secret_token: secret_token }) {
  const data = {
    method: "post",
    payload: {
      method: "setWebhook",
      url: url,
      certificate: certificate,
      ip_address: ip_address,
      max_connections: max_connections,
      allowed_updates: JSON.stringify(Constants.ALLOWED_UPDATES),
      drop_pending_updates: drop_pending_updates,
      secret_token: secret_token,

    }
  };

  return Api_(botToken, data)
}

/**
 * Use this method to remove webhook integration if you decide to switch back to getUpdates
 * https://core.telegram.org/bots/api#deletewebhook
 * @param {object} [Param] - Object Parameter to delete webhook
 * @param {boolean} [Param.drop_pending_updates] - Pass True to drop all pending updates
 * @Returns True on success
 */
function deleteWebhook(botToken, drop_pending_updates) {

  const data = {
    method: "post",
    payload: {
      method: "deleteWebhook",
      drop_pending_updates: drop_pending_updates
    }
  };
  return Api_(botToken, data)
}

/**
 * Use this method to get current webhook status. Requires no parameters. On success, returns a WebhookInfo object. If the bot is using getUpdates
 *
 * https://core.telegram.org/bots/api#getwebhookinfo
 * @returns an object with the url field empty
 */
function getWebhookInfo(botToken,
  { url: url, has_custom_certificate: has_custom_certificate, pending_update_count: pending_update_count,
    ip_address: ip_address, last_error_date: last_error_date, last_error_message: last_error_message,
    last_synchronization_error_date: last_synchronization_error_date, max_connections: max_connections,
  }) {
  const data = {
    method: "post",
    payload: {
      method: "getWebhookInfo",
      url: url,
      has_custom_certificate: has_custom_certificate,
      pending_update_count: pending_update_count,
      ip_address: ip_address,
      last_error_date: last_error_date,
      last_error_message: last_error_message,
      last_synchronization_error_date: last_synchronization_error_date,
      max_connections: max_connections,
      allowed_updates: JSON.stringify(Constants.ALLOWED_UPDATES),
    }
  };
  return Api_(botToken, data)
}

/**
 * Constants used in the Telegram bot library.
 * @namespace Constants
 */
const Constants = {
  /**
   * The base URL for the Telegram API.
   * @type {string}
   * @memberof Constants
   */
  TELEGRAM_API_URL: "https://api.telegram.org/bot",


  /**
  * The value representing the next middleware.
  * @type {number}
  * @memberof Constants
  */
  NEXT_MIDDLEWARE: 1,

  /**
    * The value representing the next middleware.
    * @type {Object}
    * @memberof Constants
    */
  ALLOWED_UPDATES: ["message", "edited_message",
    "channel_post", "edited_channel_post",
    "inline_query", "chosen_inline_result",
    "callback_query", "shipping_query",
    "pre_checkout_query", "poll",
    "poll_answer", "my_chat_member",
    "chat_member", "chat_join_request"],

  /**
    * The value representing the next middleware.
    * @type {number}
    * @memberof Constants
    */
  NEW_REQUEST_UPDATE: -1,
}



function Main_(method, param) {
  // Check if data found and it is object
  let argObj = param || { method: method };
  if (typeof argObj !== "object") {
    throw new Error("Object expected");
  }

  // Modify object values
  for (let key in argObj) {
    if (typeof argObj[key] === "object") {
      argObj[key] = JSON.stringify(argObj[key]);
    }
  }

  if (argObj.chat_id) {
    argObj.chat_id = String(argObj.chat_id);
  }
  if (argObj.user_id) {
    argObj.user_id = String(argObj.user_id);
  }

  argObj.method = method;

  const options = {
    method: "post",
    payload: argObj
  };


  const response = UrlFetchApp.fetch(Constants.TELEGRAM_API_URL + "/", options);


  // Check if response is valid
  if (response.getResponseCode() !== 200) {
    throw new Error("Invalid response from API");
  }

  return JSON.parse(response.getContentText());
}



function rM_(Obj, Param) {
  if (Param) {
    return Object.assign(Param, Obj);
  }
  return Obj;
}


function Middleware_(Function) {
  let Next = false;
  Function(Context, (next) => (Next = true));
  if (!Next) { Constants.NEXT_MIDDLEWARE = 0 }
};



/**
 * Adds values from Array to the last row of the sheet
 * @param {string} sheetId - sheetId from sheet url
 * @param {string} sheetName - unique sheet name
 */
function sheetConnect(sheetId, sheetName) {
  return (SheetDB.connect =
    SpreadsheetApp.openById(sheetId).getSheetByName(sheetName));
};


function GetLatestUpdate_(botToken) {
  const updates = getUpdates(botToken);//returns JSON
  
  if (!updates) {
    return null;
  }

  if (!updates || !updates.result.length) {
    return null;
  }

  const newRequestUpdate = updates.result[0];
  return newRequestUpdate;
}

function Api_(botToken, data) {
  let Url;
  if (Constants.TELEGRAM_API_URL === 'https://api.telegram.org/bot') { Url = Constants.TELEGRAM_API_URL + botToken }
  else { Url = Constants.TELEGRAM_API_URL; }
  return JSON.parse(UrlFetchApp.fetch(Url + "/", data));
}