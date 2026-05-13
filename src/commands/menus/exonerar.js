const {
  EmbedBuilder,
  MessageFlags
} = require('discord.js');

const { Errors, Validate } = require('../../../utils/functions');

const config = require('../../../../config.json');
const emojis = require('../../../../emojis.json');

const command = async(client, interaction, args) => {
  try {
    const userId = args.find((r) => r.name === 'Oficial')?.value
      ?.replace('@','')
      .replace('<','')
      .replace('>','');

    const passport = userId;

    const member = await Validate({ userId, passport }, {
      'userId': { required: true, type: 'id' },
      'passport': { required: true, type: 'passport' }
    })
      .then((m) => m.userId?.member || m.passport?.member);

    if (!member) {
      const embed = new EmbedBuilder()
        .setDescription(`${emojis.error} | Não consegui encontrar o oficial que você marcou.`)
        .setColor('#FF0000');

      return interaction.reply({ embeds: [ embed ], flags: MessageFlags.Ephemeral });
    }

    // REMOVER OS CARGOS

    // ENVIAR LOG DE EXONERADO


  } catch(err) {
    return Errors(err, `Command ${__filename}`)
      .then(() => command(client, interaction, args))
      .catch((e) => interaction.reply({ content: `${emojis.error} | ` + e.error, flags: MessageFlags.Ephemeral }));
  }
};

module.exports = { 
  route: command,
  description: '💬 [Menus] 💬 | Comando para gerar a mensagem de novas prisões.',
  options: [
    {
      'name': 'Oficial',
      'description': 'Marque ou coloque o ID de oficial que será exonerado',
      'type': 3,
      'required': true
    }
  ]
};