const { MessageFlags, EmbedBuilder, ModalBuilder, UserSelectMenuBuilder, LabelBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

const { Errors } = require('../utils/functions');
const { articles } = require('../utils/bases');
const config = require('../../config.json');

const command = async(client, interaction, args) => {
  try {
    if (!interaction.member.roles.cache.has(config.roles.prison)) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription('❌ • *Você não possui o* __***Curso Prisional***__ *para efetuar prisões!*');

      return interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ] });
    }

    const modal = new ModalBuilder()
      .setCustomId('prison')
      .setTitle('Registro de Prisão');

    const usersPrison = new LabelBuilder()
      .setLabel('Oficiais da Prisão')
      .setDescription('Selecione até 2 oficias responsáveis pelo registro da prisão do réu.')
      .setUserSelectMenuComponent(
        new UserSelectMenuBuilder()
          .setCustomId('users_prison')
          .setPlaceholder('Selecione os até 2 oficiais')
          .setMinValues(1)
          .setMaxValues(2)
      );

    const usersPrimary = new LabelBuilder()
      .setLabel('Oficiais da Primaria')
      .setDescription('Selecione até 2 oficias responsáveis pela prisão do réu.')
      .setUserSelectMenuComponent(
        new UserSelectMenuBuilder()
          .setCustomId('users_primary')
          .setPlaceholder('Selecione os até 2 oficias')
          .setMinValues(1)
          .setMaxValues(2)
      );

    const nameAttorney = new LabelBuilder()
      .setLabel('Identidade do Advogado')
      .setDescription('Escreva o nome e o passaporte do advogado responsável pela defesa do réu.')
      .setTextInputComponent(
        new TextInputBuilder()
          .setCustomId('name_attorney')
          .setPlaceholder('Exemplo: Fulano Fulano [123]')
          .setStyle(TextInputStyle.Short)
          .setRequired(false)
      );

    const namePrisoner = new LabelBuilder()
      .setLabel('Identidade do Réu')
      .setDescription('Escreva o nome e o passaporte do réu que está sendo conduzido réu.')
      .setTextInputComponent(
        new TextInputBuilder()
          .setCustomId('name_prisoner')
          .setPlaceholder('Exemplo: Fulano Fulano [123]')
          .setStyle(TextInputStyle.Short)
      );

    const listArticles = new LabelBuilder()
      .setLabel('Artigos Atribuídos')
      .setDescription('Escreva a lista dos artigos atribuídos ao réu.')
      .setTextInputComponent(
        new TextInputBuilder()
          .setCustomId('list_articles')
          .setPlaceholder('Exemplo:\nTrafico de Drogas,\nPosse de Dinheiro Sujo (100K),\nTentativa de Fuga')
          .setStyle(TextInputStyle.Paragraph)
      );

    const numberMonths = new LabelBuilder()
      .setLabel('Tempo de Prisão (Meses)')
      .setDescription('Digite o número total de meses que o réu deverá cumprir.')
      .setTextInputComponent(
        new TextInputBuilder()
          .setCustomId('number_months')
          .setPlaceholder('Exemplo: 100')
          .setStyle(TextInputStyle.Short)
      );

    const amountFine = new LabelBuilder()
      .setLabel('Valor da Multa')
      .setDescription('Informe o valor total da multa aplicada ao réu.')
      .setTextInputComponent(
        new TextInputBuilder()
          .setCustomId('amount_fine')
          .setPlaceholder('Exemplo: 100')
          .setStyle(TextInputStyle.Short)
      );

    const amountReduction = new LabelBuilder()
      .setLabel('Redução da Pena')
      .setDescription('Selecione as reduções aplicada na pena do réu.')
      .setStringSelectMenuComponent(
        new StringSelectMenuBuilder()
          .setCustomId('amount_reduction')
          .setPlaceholder('Selecione as reduções aplicada na pena do réu')
          .addOptions( // No máximo 25 opções
            reductions.map((reduction) => 
              new StringSelectMenuOptionBuilder()
                .setLabel(reduction.name)
                .setValue(`${reduction.percentage}`)
            )
          )
      );

    modal.addLabelComponents(
      usersPrison,
      usersPrimary,
      nameAttorney,
      namePrisoner
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