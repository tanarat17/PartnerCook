// src\api\linebotService\lineBot.js
const axios = require('axios');

module.exports = {
  sendMessageCreateProduct: async (userId, message) => {
    const LineBotAPIEndPoint = 'https://api.line.me/v2/bot/message/push';
    const LineBotToken = process.env.VITE_TOKEN_TEST;

    if (!LineBotAPIEndPoint) {
      throw new Error('LINE Bot API endpoint is not defined');
    }
    if (!LineBotToken) {
      throw new Error('LINE Bot token is not defined');
    }

    const body = {
      to: userId,
      messages: [
        {
          type: 'text',
          text: message,
        },
      ],
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${LineBotToken}`,
    };

    try {
      const response = await axios.post(LineBotAPIEndPoint, body, { headers });
      return {
        message: 'Message sent successfully',
        data: response.data,
      };
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
      throw new Error(`Failed to send message: ${error.response?.data?.message || error.message}`);
    }
  },
};
