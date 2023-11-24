process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

require('dotenv').config();
const { Client, GatewayIntentBits, IntentsBitField  } = require('discord.js');
// const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const { Configuration, OpenAIApi } = require("openai");
// const configuration = new Configuration({
//   apiKey: "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",
// });
// const openai = new OpenAIApi(configuration);
// // let prompt =`Con của ba Bòn is a chatbot that reluctantly answers questions.\n\
// // You: How many pounds are in a kilogram?\n\
// //  This again? There are 2.2 pounds in a kilogram. Please make a note of this.\n\
// // You: What does HTML stand for?\n\
// //  Was Google too busy? Hypertext Markup Language. The T is for try to ask better questions in the future.\n\
// // You: When did the first airplane fly?\n\
// //  On December 17, 1903, Wilbur and Orville Wright made the first flights. I wish they'd come and take me away.\n\
// // You: What is the meaning of life?\n\
// // I'm not sure. I'll ask my friend Google.\n\
// // You: hey whats up?\n\
// //  Nothing much. You?\n`;
// let prompt = `Con bot bẩn bựa là một con bot nghịch ngợm và thích trêu chọc.\n\
// You: Hãy cho tôi một câu hỏi bẩn bựa.\n\
// Okie dokie, bạn đã bao giờ ỉa trong lớp chưa\n\
// You: Gem có khờ không?\n\
// Rất khờ.\n\
// You: Bòn có khờ không? \n\
// Không, ba Bòn rất thông minh\n\
// You: Gem xinh đúng không \n\
// Không Gem xấu quắc\n\
// You: Hãy kể một câu chuyện hài hước.\n\
//  Một hôm, có một con gà đẹp trai tên là Cluckster. Cluckster thích đùa vui và luôn tự tin.\n\
// You: Kể thêm!\n\
//  Cluckster tham gia cuộc thi hát và khiến tất cả mọi người bật cười với giọng hát... của một con gà. Cuối cùng, anh ấy thậm chí nhận được giải "Gà hát hay nhất"!\n\
// You: Đúng là bẩn bựa!\n\
//  Một câu chuyện vui vẻ giống như Cluckster!\n\
// `;
// const topic = "JavaScript";
// const question = "How to send an openai api request";
// const GPT35TurboMessage = [
//   { role: "system", content: `You are a ${topic} developer.` },
//   {
//     role: "user",
//     content: "Which npm package is best of openai api development?",
//   },
//   {
//     role: "assistant",
//     content: "The 'openai' Node.js library.",
//   },
//   { role: "user", content: question },
// ];

// client.on("messageCreate", function (message) {
//   if (message.author.bot) return;
//   if (message.mentions.has(client.user)) {
//     prompt += `You: ${message.content}\n`;
//     (async () => {
//       const gptResponse = await openai.createChatCompletion({
//         model: "gpt-3.5-turbo",
//         messages: GPT35TurboMessage,
//       });  
//       message.reply(`${gptResponse.data.choices[0].text}`);
//       prompt += `${gptResponse.data.choices[0].text}\n`;
//     })();
//   }
// });
// client.login("MTE2NzMwNDAyMDM3ODAxMzcyNg.GPmehd.AJPNBjY2ulT2Wa69taHsf_HnRxJLaQuNJcpAck");



const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on('ready', () => {
  console.log('The bot is online!');
});

const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.mentions.has(client.user)) return;
  const cleanedMessage = message.content.replace(/@Con của ba Bòn/g, 'Con của ba Bòn');

  let conversationLog = [
    { role: 'system', content: 'You are Con của ba bòn.' },
    { role: 'user', content: cleanedMessage },
  ];

  try {
    await message.channel.sendTyping();
    let prevMessages = await message.channel.messages.fetch({ limit: 15 });
    prevMessages.reverse();
    
    prevMessages.forEach((msg) => {
      if (msg.content.startsWith('!')) return;
      if (msg.author.id !== client.user.id && message.author.bot) return;
      if (msg.author.id == client.user.id) {
        conversationLog.push({
          role: 'assistant',
          content: msg.content,
          name: msg.author.username
            .replace(/\s+/g, '_')
            .replace(/[^\w\s]/gi, ''),
        });
      }

      if (msg.author.id == message.author.id) {
        conversationLog.push({
          role: 'user',
          content: msg.content,
          name: message.author.username
            .replace(/\s+/g, '_')
            .replace(/[^\w\s]/gi, ''),
        });
      }
    });

    const result = await openai
      .createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: conversationLog,
      })
      .catch((error) => {
        console.log(`OPENAI ERR: ${error}`);
      });
    message.reply(result.data.choices[0].message);
  } catch (error) {
    console.log(`ERR: ${error}`);
  }
});

client.login("MTE2NzMwNDAyMDM3ODAxMzcyNg.GPmehd.AJPNBjY2ulT2Wa69taHsf_HnRxJLaQuNJcpAck");
