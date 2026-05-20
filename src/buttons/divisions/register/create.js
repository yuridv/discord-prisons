const {
  MessageFlags,
  EmbedBuilder,
  ModalBuilder
} = require('discord.js');

const { Errors, ModalTypes } = require('../../../utils/functions');

const config = require('../../../../config.json');
const emojis = require('../../../../emojis.json');

const button = async(client, interaction) => {
  try {
    // if (!interaction.member.roles.cache.has(config.divisions.roles.register.unregistered)) {
    //   const embed = new EmbedBuilder()
    //     .setColor('#FF0000')
    //     .setDescription(`${emojis.error} • *Você precisa ter o cargo* __***<@&${config.roles.register.unregistered}>***__ *para efetuar o seu registro!*`);

    //   return interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ] });
    // }

    if (interaction.member.roles.cache.has(config.divisions.roles.register.waiting)) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emojis.error} • *Você já efetuou está com um* __***Registro***__ *pendente, aguarde até aprovarem!*`);

      return interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ] });
    }

    const modal = new ModalBuilder()
      .setCustomId('divisions/register/create')
      .setTitle('Dados do Registro');

    modal.addLabelComponents(
      camps.map((c) => ModalTypes[c.type](c))
    );

    return interaction.showModal(modal);
  } catch(err) {
    return Errors(err, `Button ${__filename}`)
      .then(() => button(client, interaction))
      .catch((e) => interaction.reply({ content: e.error, flags: MessageFlags.Ephemeral }));
  }
};

module.exports = { route: button };

const camps = [
  { 
    id: 'passport', 
    type: 'text',
    type_text: 'Short', 
    title: 'Passaporte', 
    description: 'Escreva o número do seu passaporte dentro da cidade', 
    placeholder: '344',
    required: true
  },
  {
    id: 'name',
    type: 'text',
    type_text: 'Short', 
    title: 'Nome e Sobrenome',
    description: 'Escreva o seu nome e sobrenome dentro da cidade',
    placeholder: 'Dragon Luthor',
    required: true
  },
  {
    id: 'division', 
    type: 'select', 
    title: 'Divisão', 
    description: 'Selecione a divisão que você pertence.', 
    placeholder: 'Selecione a divisão', 
    options: [
      { label: '・SPEED', value: 'speed', emoji: '🚓' },
      { label: '・GRAER', value: 'graer', emoji: '🚁' },
      { label: '・GTM', value: 'gtm', emoji: '🏍️' }
    ],
    max: 1,
    min: 1,
    required: true
  },
  {
    id: 'battalion', 
    type: 'select', 
    title: 'Guarnição', 
    description: 'Selecione a guarnição que você pertence.', 
    placeholder: 'Selecione a guarnição', 
    options: [
      { label: '・Militar', value: 'militar', emoji: '🚨' },
      { label: '・Civil', value: 'civil', emoji: '🕵️‍♀️' },
      { label: '・Exército', value: 'exercito', emoji: '🪂' }
    ],
    max: 1,
    min: 1,
    required: true
  },
  {
    id: 'recruiter',
    type: 'text',
    type_text: 'Short', 
    title: 'Passaporte do Recrutador',
    description: 'Escreva o passaporte do oficial responsável por recrutar você.',
    placeholder: '344',
    required: true
  }
];