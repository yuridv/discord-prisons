const { MessageFlags, EmbedBuilder, ModalBuilder, UserSelectMenuBuilder, LabelBuilder, TextInputBuilder, TextInputStyle, FileUploadBuilder } = require('discord.js');

const { Errors } = require('../../utils/functions');
const config = require('../../../config.json');

const command = async(client, interaction, args) => {
  try {
    if (!camps[args[0]]) return;

    if (!interaction.member.roles.cache.has(config.roles.prison)) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription('❌ • *Você não possui o* __***Curso Prisional***__ *para efetuar prisões!*');

      return interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ] });
    }

    const modal = new ModalBuilder()
      .setCustomId('prison')
      .setTitle('Registro de Prisão');

    modal.addLabelComponents(
      camps[args[0]].map((camp) => Types[camp.type](camp))
    );

    await interaction.showModal(modal);

    return;
  } catch(err) {
    return Errors(err, `Command ${__filename}`)
      .then(() => command(client, interaction))
      .catch((e) => interaction.reply({ content: e.error, flags: MessageFlags.Ephemeral }));
  }
};

const Types = {
  users: (camp) => 
    new LabelBuilder()
      .setLabel(camp.title)
      .setDescription(camp.description)
      .setUserSelectMenuComponent(
        new UserSelectMenuBuilder()
          .setCustomId(camp.id)
          .setPlaceholder(camp.placeholder)
          .setMinValues(camp.min)
          .setRequired(camp.required ? true : false)
          .setMaxValues(camp.max)
      ),
  text: (camp) =>
    new LabelBuilder()
      .setLabel(camp.title)
      .setDescription(camp.description)
      .setTextInputComponent(
        new TextInputBuilder()
          .setCustomId(camp.id)
          .setPlaceholder(camp.placeholder)
          .setRequired(camp.required ? true : false)
          .setStyle(TextInputStyle[camp.type_text])
      ),
  files: (camp) =>
    new LabelBuilder()
      .setLabel(camp.title)
      .setDescription(camp.description)
      .setFileUploadComponent(
        new FileUploadBuilder()
          .setCustomId(camp.id)
          .setRequired(camp.required ? true : false)
          .setMinValues(camp.min)
          .setMaxValues(camp.max)
      )
};

const camps = {
  offices_prison: [
    { 
      id: 'offices_prison_select', 
      type: 'users', title: 'Oficiais Penitenciários', 
      description: 'Selecione até 2 oficias responsáveis pelo registro da prisão do detento.', 
      placeholder: 'Selecione até 2 oficiais', 
      min: 1, 
      max: 2
    },
    { 
      id: 'offices_prison_text', 
      type: 'text', 
      type_text: 'Paragraph', 
      title: 'Ou Escreva', 
      description: 'Escreva o passaporte e o nome dos oficiais caso não encontre na lista acima.', 
      placeholder: 'Exemplo:\n[1000] Dragon Luthor\n[2000] Mel Lysenko'
    },
    { 
      id: 'offices_prison_file', 
      type: 'files',
      title: 'Anexe as evidencias', 
      description: 'Anexe as imagem como provas para flagrantes.'
    }
  ],
  offices_primary: [
    { 
      id: 'offices_primary_select', 
      type: 'users', 
      title: 'Oficiais Primária', 
      description: 'Selecione até 2 oficias responsáveis pela prisão do detento.', 
      placeholder: 'Selecione até 2 oficiais', 
      min: 1, 
      max: 2 
    },
    { 
      id: 'offices_primary_text', 
      type: 'text', 
      type_text: 'Paragraph', 
      title: 'Ou Escreva', 
      description: 'Escreva o passaporte e o nome dos oficiais caso não encontre na lista acima.', 
      placeholder: 'Exemplo:\n[1000] Dragon Luthor\n[2000] Mel Lysenko' 
    }
  ],
  attorney: [
    { 
      id: 'attorney', 
      type: 'text', 
      type_text: 'Short', 
      title: 'Advogado de Defesa', 
      description: 'Escreva o passaporte e o nome do advogado responsável pela defesa do detento.', 
      placeholder: 'Exemplo: [1000] Dragon Luthor' 
    }
  ]
};

module.exports = { 
  route: command
};