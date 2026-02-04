import { Client, GatewayIntentBits } from "discord.js";
import { joinVoiceChannel } from "@discordjs/voice";

// توكنات البوتات (تحطهم في Railway Variables)
const TOKENS = [
  process.env.TOKEN_1,
  process.env.TOKEN_2,
  process.env.TOKEN_3,
  process.env.TOKEN_4,
  process.env.TOKEN_5,
  process.env.TOKEN_6,
  process.env.TOKEN_7,
  process.env.TOKEN_8,
  process.env.TOKEN_9,
  process.env.TOKEN_10,
  process.env.TOKEN_11
];

// ترتيب الرومات
// أول 6 بوتات يدخلون روم واحد
const MAIN_VOICE_CHANNEL_ID = process.env.MAIN_VOICE_CHANNEL_ID;

// آخر 5 بوتات كل واحد بروم
const INDIVIDUAL_CHANNEL_IDS = [
  process.env.VOICE_CHANNEL_7,
  process.env.VOICE_CHANNEL_8,
  process.env.VOICE_CHANNEL_9,
  process.env.VOICE_CHANNEL_10,
  process.env.VOICE_CHANNEL_11
];

const GUILD_ID = process.env.GUILD_ID;

TOKENS.forEach(async (token, index) => {
  if (!token) return;

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildVoiceStates
    ]
  });

  client.once("ready", async () => {
    console.log(`🤖 Bot ${index + 1} جاهز: ${client.user.tag}`);
    const guild = await client.guilds.fetch(GUILD_ID);

    let channelId;

    if (index < 6) {
      // أول 6 بوتات يدخلون روم واحد
      channelId = MAIN_VOICE_CHANNEL_ID;
    } else {
      // آخر 5 بوتات كل واحد بروم
      channelId = INDIVIDUAL_CHANNEL_IDS[index - 6];
    }

    const channel = await guild.channels.fetch(channelId);

    joinVoiceChannel({
      channelId: channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfMute: false,   // ❌ بدون ميوت
      selfDeaf: true     // ✅ عليه دفن
    });

    console.log(`🔊 Bot ${index + 1} دخل القناة (Deafened)`);
  });

  client.login(token);
});
