const {
  EmbedBuilder,
  MessageFlags,
  ContainerBuilder,
  ButtonStyle
} = require('discord.js');

const { Errors } = require('../../utils/functions');
const Prison = require('../../models/prison');

const emojis = require('../../../emojis.json');
const config = require('../../../config.json');

const command = async(client, interaction, args) => {
  try {
    const channel = interaction.guild.channels.cache.get(config?.channels?.prisons);
    if (!channel) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emojis.error} • *${interaction.author || interaction.user}, O canal de prisões configurado não foi encontrado!*`);

      return interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ], content: `${interaction.author || interaction.user}` });
    }

    if (!args || !args[0]) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emojis.error} • *${interaction.author || interaction.user}, você não informou o* __***ID***__ *da prisão!*`);

      return interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ], content: `${interaction.author || interaction.user}` });
    }

    const prison = await Prison.findOne({ _id: args[0] });
    if (!prison) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emojis.error} • *${interaction.author || interaction.user}, não encontrei o registro da prisão selecionada!*`);
              
      return interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ], content: `${interaction.author || interaction.user}` });
    }

    const container = new ContainerBuilder()
      .setAccentColor(parseInt(config.color.replace('#', ''), 16))

      .addSectionComponents((section) =>
        section
          .addTextDisplayComponents((text) => 
            text.setContent(
              `# ${emojis.folder} ・ *Registro Penitenciário*` +
              '\n*Esse registro penitenciário reúne os dados da prisão, incluindo informações do detido, pena aplicada e oficiais responsáveis.*\n'  
            )
          )
          .setButtonAccessory((button) =>
            button.setCustomId('prison').setEmoji({ id: emojis.plus.match(/\d{15,}/)[0] }).setStyle(ButtonStyle.Secondary)
          )
      )

      .addSeparatorComponents((separator) => separator.setSpacing(1))

      .addTextDisplayComponents((text) => 
        text.setContent(`## ${emojis.tools} ***Informações dos Envolvidos***`)
      )
      .addSectionComponents((section) =>
        section
          .addTextDisplayComponents((text) => 
            text.setContent(`${emojis.arrow_right_animated} **Oficiais Penitenciários:** \`\`\`ini\n${prison.officers_prison.map((office) => `[${office.id}] ${office.name}`).join('\n')}\`\`\``)
          )
          .setButtonAccessory((button) =>
            button.setCustomId('prison/edit-offices_prison').setEmoji({ id: emojis.pencil.match(/\d{15,}/)[0] }).setStyle(ButtonStyle.Secondary)
          )
      )

    ;

    await channel.send({ components: [ container ], flags: MessageFlags.IsComponentsV2 });
  } catch(err) {
    return Errors(err, `Command ${__filename}`)
      .then(() => command(client, interaction))
      .catch((e) => interaction.reply({ content: e.error, flags: MessageFlags.Ephemeral }));
  }
};

module.exports = { 
  route: command
};