require('dotenv-safe').config();

const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');

const { base, colors } = require('./src/utils/bases');
const { Files, MongoDB } = require('./src/utils/functions');

console.log(colors.YELLOW + '[Discord]=> Starting...' + colors.RESET);

base.client = new Client({
  status: 'online',
  autoReconnect: true,
  interval: 60,
  retryLimit: 35,
  afk: false,
  compress: true,
  intents: [ 
    GatewayIntentBits.MessageContent, // INTENT PRIVADA - GET MESSAGES
    GatewayIntentBits.GuildPresences, // INTENT PRIVADA - GET MEMBERS
    GatewayIntentBits.Guilds, // INTENT PRIVADA - GET GUILDS DADOS
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration
  ]
});

const Events = Files('./src/events/', { removeDir: 1 });
for (const e in Events) base.client.on(e, Events[e].bind(null, base.client));

base.client.commands = [];
const Commands = Files('./src/commands/', { removeDir: 1 });
for (const c in Commands) base.client.commands.push({ name: c, ...Commands[c] });

base.client.buttons = [];
const Buttons = Files('./src/buttons/', { removeDir: 1, path: 1 });
for (const b in Buttons) base.client.buttons.push({ name: b, ...Buttons[b] });

base.client.modals = [];
const Modals = Files('./src/modals/', { removeDir: 1, path: 1 });
for (const m in Modals) base.client.modals.push({ name: m, ...Modals[m] });

MongoDB()
  .then(() => 
    base.client.login(process.env.BOT_TOKEN)
      .then(() => {
        const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
        rest.put(Routes.applicationCommands(base.client.user.id), { body: base.client.commands });
      })
      .catch((err) => console.log(`${colors.RED}[Discord Error]=> ${colors.RESET}`, err))
  )
  .catch((err) => console.log(`${colors.RED}[Discord Error]=> ${colors.RESET}`, err));