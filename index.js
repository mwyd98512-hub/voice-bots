const { Client, GatewayIntentBits } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const express = require("express");

const app = express();
app.get("/", (req, res) => res.send("Bots are online"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Web server running on port " + PORT));

// معرف السيرفر
const GUILD_ID = process.env.GUILD_ID;

// القناة المشتركة للـ 6 بوتات
const SHARED_CHANNEL = process.env.SHARED_CHANNEL;

// القنوات الفردية للـ 5 بوتات
const OTHER_CHANNELS = [
  process.env.CHANNEL1,
  process.env.CHANNEL2,
  process.env.CHANNEL3,
  process.env.CHANNEL4,
  process.env.CHANNEL5,
];

// التوكنات لكل بوت
const TOKENS = [
  process.env.TOKEN1,
  process.env.TOKEN2,
  process.env.TOKEN3,
  process.env.TOKEN4,
  process.env.TOKEN5,
  process.env.TOKEN6,
  process.env.TOKEN7,
  process.env.TOKEN8,
  process.env.TOKEN9,
  process.env.TOKEN10,
  process.env.TOKEN11,
];

// إعداد البوتات حسب القناة
const botsConfig = [
  { token: TOKENS[0], channel: SHARED_CHANNEL },
  { token: TOKENS[1], channel: SHARED_CHANNEL },
  { token: TOKENS[2], channel: SHARED_CHANNEL },
  { token: TOKENS[3], channel: SHARED_CHANNEL },
  { token: TOKENS[4], channel: SHARED_CHANNEL },
  { token: TOKENS[5], channel: SHARED_CHANNEL },
  { token: TOKENS[6], channel: OTHER_CHANNELS[0] },
  { token: TOKENS[7], channel: OTHER_CHANNELS[1] },
  { token: TOKENS[8], channel: OTHER_CHANNELS[2] },
  { token: TOKENS[9], channel: OTHER_CHANNELS[3] },
  { token: TOKENS[10], channel: OTHER_CHANNELS[4] },
];

// تشغيل كل بوت
botsConfig.forEach(({ token, channel }) => {
  if (token && channel) startBot(token, channel);
});

async function startBot(TOKEN, CHANNEL_ID) {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
  });

  client.once("clientReady", async () => {
    console.log(`${client.user.username} online`);
    joinChannel();
  });

  async function joinChannel() {
    try {
      const guild = await client.guilds.fetch(GUILD_ID);
      const voiceChannel = await guild.channels.fetch(CHANNEL_ID);

      joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: true,   // يسمعون القناة
        selfMute: false,   // مايك مفتوح بصريًا
        preferredEncryptionMode: "aead_aes256_gcm_rtpsize", // لتجنب DAVE
      });

      console.log(`${client.user.username} دخل الروم`);
    } catch (err) {
      console.log(`خطأ: ${err.message}`);
      setTimeout(joinChannel, 5000); // إعادة محاولة إذا فشل
    }
  }

  client.on("voiceStateUpdate", async (oldState, newState) => {
    if (oldState.member?.id === client.user.id && !newState.channelId) {
      joinChannel();
    }
  });

  await client.login(TOKEN);
}
