const { MessageFlags, EmbedBuilder, ModalBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, LabelBuilder } = require('discord.js');

const { Errors } = require('../utils/functions');
const config = require('../../config.json');

const command = async(client, interaction, args) => {
  try {
    if (!interaction.member.roles.cache.has(config.role_prison)) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription('❌ • *Você não possui o* __***Curso Prisional***__ *para efetuar prisões!*');

      return interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ] });
    }

    const members = await interaction.guild.members.fetch();

    const modal = new ModalBuilder()
      .setCustomId('prison')
      .setTitle('Registrar Prisão');

    const favoriteStarterSelect = new StringSelectMenuBuilder()
      .setCustomId('prison-penal')
      .setPlaceholder('Selecione os oficias da Penal!')
      .setMinValues(1)
      .setMaxValues(2)
      .setRequired(true)
      .addOptions(
        new StringSelectMenuOptionBuilder()
          // Label displayed to user
          .setLabel('Bulbasaur')
          // Description of option
          .setDescription('The dual-type Grass/Poison Seed Pokémon.')
          // Value returned to you in modal submission
          .setValue('bulbasaur'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Charmander')
          .setDescription('The Fire-type Lizard Pokémon.')
          .setValue('charmander'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Squirtle')
          .setDescription('The Water-type Tiny Turtle Pokémon.')
          .setValue('squirtle')
      );

    const favoriteStarterLabel = new LabelBuilder()
      .setLabel('Whatz\'s your favorite Gen 1 Pokémon starter?')
      .setStringSelectMenuComponent(favoriteStarterSelect);

    modal.addLabelComponents(favoriteStarterLabel); 

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