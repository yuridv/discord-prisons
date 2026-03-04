const { MessageFlags, EmbedBuilder, ModalBuilder, UserSelectMenuBuilder, LabelBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

const { Errors } = require('../utils/functions');
const { articles } = require('../utils/bases');
const config = require('../../config.json');

const command = async(client, interaction, args) => {
  try {
    if (!interaction.member.roles.cache.has(config.role_prison)) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription('❌ • *Você não possui o* __***Curso Prisional***__ *para efetuar prisões!*');

      return interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ] });
    }

    const modal = new ModalBuilder()
      .setCustomId('prison')
      .setTitle('Registro de Prisão');

    const usersPrison = new LabelBuilder()
      .setLabel('Oficiais Penitenciários')
      .setDescription('Selecione até 2 oficias responsáveis pelo registro da prisão do réu.')
      .setUserSelectMenuComponent(
        new UserSelectMenuBuilder()
          .setCustomId('users_prison')
          .setPlaceholder('Selecione os até 2 oficiais')
          .setMinValues(1)
          .setRequired(false)
          .setMaxValues(2)
      );

    const nameAttorney = new LabelBuilder()
      .setLabel('Ou Digite os Oficiais Penitenciários')
      .setDescription('Escreva até 2 oficias responsáveis pelo registro da prisão do réu.')
      .setTextInputComponent(
        new TextInputBuilder()
          .setCustomId('list_articles')
          .setRequired(false)
          .setPlaceholder('Exemplo:\n[1001] Dragon Luthor\n[1002] Mel Lysenko')
          .setStyle(TextInputStyle.Paragraph)
      );


    modal.addLabelComponents(
      usersPrison,
      nameAttorney
    );

    // modal.addLabelComponents(
    //   listArticles,
    //   numberMonths,
    //   amountFine,
    //   amountReduction
    // );

    await interaction.showModal(modal);

    return;
  } catch(err) {
    return Errors(err, `Command ${__filename}`)
      .then(() => command(client, interaction))
      .catch((e) => interaction.reply({ content: e.error, flags: MessageFlags.Ephemeral }));
  }
};

module.exports = { 
  route: command
};

const reductions = [
  { name: 'Réu Primário [20%]', percentage: 0.2 },
  { name: 'Presença do Advogado [30%]', percentage: 0.3 },
  { name: 'Colaboração e Confissão [10%]', percentage: 0.1 }
];