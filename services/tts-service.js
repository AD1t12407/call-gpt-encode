require('dotenv').config();
const EventEmitter = require('events');
const axios = require('axios');

class TextToSpeechService extends EventEmitter {
  constructor() {
    super();
    if (!process.env.SMALLEST_AI_API_KEY) {
      throw new Error('SMALLEST_AI_API_KEY is not defined in environment variables.');
    }
  }

  async generate(callSid, gptReply, interactionCount) {
    const { partialResponseIndex, partialResponse } = gptReply;
    if (!partialResponse) return;

    try {
      const response = await axios.post(
        'https://api.smallest.ai/tts',
        { text: partialResponse, voice: 'en-US' }, // Adjust voice dynamically if needed
        { headers: { Authorization: `Bearer ${process.env.SMALLEST_AI_API_KEY}` } }
      );

      const base64Audio = response.data.audio;
      this.emit('speech', callSid, partialResponseIndex, base64Audio, partialResponse, interactionCount);
    } catch (error) {
      console.error('Error in TTS generation:', error.response?.data || error.message);
    }
  }
}

module.exports = { TextToSpeechService };
