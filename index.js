const { Client, GatewayIntentBits } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const express = require("express");

const app = express();
app.get("/", (req, res) => res.send("Bots are online"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Web server running on port " + PORT));

const bots = [
  { token: process.env.TOKEN1, channel: process.env.CHANNEL1 },
  { token: process.env.TOKEN2, channel: process.env.CHANNEL2 },
  { token: process.env.TOKEN3, channel: process.env.CHANNEL3 },
  { token: process.env.TOKEN4, channel: process.env.CHANNEL4 },
  { token: process.env.TOKEN5, channel: process.env.CHANNEL5 },
  { token: process.env.TOKEN6, channel: process.env.CHANNEL6 },
  { token: process.env.TOKEN7, channel: process.env.CHANNEL7 },
  { token: process.env.TOKEN8, channel: process.env.CHANNEL8 },
  { token: process.env.TOKEN9, channel: process.env.CHANNEL9 },
  { token: process.env.TOKEN10, channel: process.env.CHANNEL10 },
  { token: process.env.TOKEN11, channel: process.env.CHANNEL11 },
];

const GUILD_ID = process.env.GUILD_ID;

bots.forEach(({ token, channel }) => {
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
        selfDeaf: true,
        selfMute: false,
      });

      console.log(`${client.user.username} دخل الروم`);
    } catch (err) {
      console.log(`خطأ: ${err.message}`);
      setTimeout(joinChannel, 5000);
    }
  }

  client.on("voiceStateUpdate", async (oldState, newState) => {
    if (oldState.member?.id === client.user.id && !newState.channelId) {
      joinChannel();
    }
  });

  await client.login(TOKEN);
}
