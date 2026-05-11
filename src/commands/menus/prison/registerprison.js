const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, MessageFlags, PermissionFlagsBits } = require('discord.js');

const { Errors } = require('../../../utils/functions');
const config = require('../../../../config.json');
const emoji = require('../../../../emojis.json');

const command = async(client, interaction, args) => {
  try {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ADMINISTRATOR)) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emoji.error} • *Você não possui permissão de* __***ADMINISTRADOR***__ *para utilizar esse comando!*`);

      return interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ] });
    }

    const newPrison = new ButtonBuilder()
      .setCustomId('prison')
      .setEmoji('🚨')
      .setLabel('Registrar Prisão')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder()
      .addComponents(newPrison);

    const embed = new EmbedBuilder()
      .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
      .setThumbnail(config.avatar)
      .setColor(config.color)
      .setDescription(
        `*Seja bem vindo ao nosso canal de * ***Prisões*** *da cidade* ***${config.city}***!` +
        '\n*Aqui você pode efetuar o registro de uma nova prisão!*' +
        
        '\n\n> **Como registrar uma nova prisão?**' +
        '\n1º Clique no botão abaixo **"Registrar Prisão"**' +
        '\n2º Será aberto um formulário para você preencher os dados da prisão!' +

        '\n\n> **Informações**' +
        '\n• *Após efetuar o registro da prisão, ele ficará salvo no canal de prisões!*' +

        `\n\n*__Atenciosamente ${client.user.username}__*`
      );

    await interaction.channel.send({
      embeds: [ embed ],
      components: [ row ]
    });

    const embedSuccess = new EmbedBuilder()
      .setColor('#00FF00')
      .setDescription(`${emoji.success} • *Mensagem de menu enviada com sucesso!*`);

    return interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [ embedSuccess ] });
  } catch(err) {
    return Errors(err, `Command ${__filename}`)
      .then(() => command(client, interaction, args))
      .catch((e) => interaction.reply({ content: `${emoji.error} | ` + e.error, flags: MessageFlags.Ephemeral }));
  }
};

module.exports = { 
  route: command,
  description: '💬 [Menus] 💬 | Comando para gerar a mensagem de novas prisões.'
};