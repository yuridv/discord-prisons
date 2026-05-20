const { MessageFlags } = require('discord.js');

const { Errors } = require('../../../../utils/functions');
const emoji = require('../../../../../emojis.json');

const command = async(client, interaction, args) => {
  try {
    return require('../../../buttons/divisions/prison/message')
      .route(client, interaction, [ '69bc0f3e568e72cfdd640e40' ]);
  } catch (err) {
    return Errors(err, `Command ${__filename}`)
      .then(() => command(client, interaction, args))
      .catch((e) => interaction.reply({ content: `${emoji.error} | ` + e.error, flags: MessageFlags.Ephemeral }));
  }
};

module.exports = {
  route: command,
  description: '🐛 [Debug] 🐛 | Comando para simular uma log de prisão.'
};