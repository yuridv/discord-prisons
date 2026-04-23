const {
  MessageFlags,
  EmbedBuilder,
  ModalBuilder,
  UserSelectMenuBuilder,
  LabelBuilder,
  TextInputBuilder,
  TextInputStyle,
  StringSelectMenuBuilder,
  FileUploadBuilder
} = require('discord.js');

const { Errors } = require('../../utils/functions');
const Prison = require('../../models/prison');

const config = require('../../../config.json');
const emojis = require('../../../emojis.json');

const Articles = require('../../../articles.json');
const Reductions = require('../../../reductions.json');

const command = async(client, interaction, args) => {
  try {
    const camp = args[0];
    const id = args[1];

    if (!camp || !id) return;

    const camps = JSON.parse(JSON.stringify(campsBase));
    if (!camps[camp]) return;

    if (!interaction.member.roles.cache.has(config.roles.prison)) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription('❌ • *Você não possui o* __***Curso Prisional***__ *para efetuar prisões!*');

      return interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ] });
    }

    const prison = await Prison.findOne({ _id: id });
    if (!prison) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emojis.error} • *${interaction.author || interaction.user}, não encontrei o registro da prisão selecionada!*`);

      return interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ], content: `${interaction.author || interaction.user}` });
    }

    if (prison.articles.length >= 1) {
      camps.bail_paid[0].options = prison.articles
        .map((article) => (
          { label: `Art. ${article.article} - ` + article.name, value: String(article.article) }
        ));
    }
    
    const modal = new ModalBuilder()
      .setCustomId(`prison/edit-${id}`)
      .setTitle('Registro de Prisão');

    modal.addLabelComponents(
      camps[camp].map((c) => Types[c.type](c))
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
          .setMinValues(camp.min || 0)
          .setMaxValues(camp.max || 10)
          .setRequired(camp.required ? true : false)
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
  select: (camp) =>
    new LabelBuilder()
      .setLabel(camp.title)
      .setDescription(camp.description)
      .setStringSelectMenuComponent(
        new StringSelectMenuBuilder()
          .setCustomId(camp.id)
          .setPlaceholder(camp.placeholder)
          .setMinValues(camp.min || 0)
          .setMaxValues(camp.max || camp.options.length)
          .setRequired(camp.required ? true : false)
          .addOptions(
            camp.options.map((option) => ({
              label: option.label,
              value: String(option.value)
            }))
          )
      ),
  files: (camp) =>
    new LabelBuilder()
      .setLabel(camp.title)
      .setDescription(camp.description)
      .setFileUploadComponent(
        new FileUploadBuilder()
          .setCustomId(camp.id)
          .setRequired(camp.required ? true : false)
          .setMinValues(camp.min || 0)
          .setMaxValues(camp.max || 10)
      )
};

const campsBase = {
  offices_prison: [
    { 
      id: 'office_aux_prison_select', 
      type: 'users',
      title: 'Oficial Auxiliar', 
      description: 'Selecione o oficial auxiliar responsável pelo registro da prisão do detento.', 
      placeholder: 'Selecione o oficial auxiliar',
      max: 1
    },
    { 
      id: 'office_aux_prison_id', 
      type: 'text', 
      type_text: 'Short', 
      title: 'Passaporte do Oficial Auxiliar', 
      description: 'Escreva o passaporte do oficial auxiliar responsável pelo registro prisão do detento.', 
      placeholder: '344'
    },
    { 
      id: 'office_aux_prison_name', 
      type: 'text', 
      type_text: 'Short', 
      title: 'Nome do Oficial Auxiliar', 
      description: 'Escreva o nome do oficial auxiliar responsável pelo registro prisão do detento.', 
      placeholder: 'Dragon Luthor'
    }
  ],
  offices_conduction: [
    { 
      id: 'offices_conduction_select', 
      type: 'users', 
      title: 'Oficiais Condução', 
      description: 'Selecione até 2 oficias responsáveis pela condução da prisão do detento.', 
      placeholder: 'Selecione até 2 oficiais',
      max: 2 
    },
    { 
      id: 'office_conduction_id', 
      type: 'text', 
      type_text: 'Short', 
      title: 'Passaporte do Oficial', 
      description: 'Escreva o passaporte do oficial responsável pela condução da prisão do detento.', 
      placeholder: '344'
    },
    { 
      id: 'office_conduction_name', 
      type: 'text', 
      type_text: 'Short', 
      title: 'Nome do Oficial', 
      description: 'Escreva o nome do oficial responsável pela condução da prisão do detento.', 
      placeholder: 'Dragon Luthor'
    },
    { 
      id: 'office_aux_conduction_id', 
      type: 'text', 
      type_text: 'Short', 
      title: 'Passaporte do Oficial Auxiliar', 
      description: 'Escreva o passaporte do oficial auxiliar responsável pela condução da prisão do detento.', 
      placeholder: '345'
    },
    { 
      id: 'office_aux_conduction_name', 
      type: 'text', 
      type_text: 'Short', 
      title: 'Nome do Oficial Auxiliar', 
      description: 'Escreva o nome do oficial auxiliar responsável pela condução da prisão do detento.', 
      placeholder: 'Mel Luthor'
    }
  ],
  attorney: [
    { 
      id: 'office_attorney_select', 
      type: 'select', 
      title: 'Ausência de Advogado', 
      description: 'Selecione o motivo da ausência do advogado.', 
      placeholder: 'Selecione o motivo', 
      options: [
        { label: 'O réu dispensou a presença de um advogado', value: '1' },
        { label: 'O serviço de advogado está indisponível', value: '2' },
        { label: 'Nenhum advogado aceitou o chamado', value: '3' }
      ],
      max: 1
    },
    { 
      id: 'office_attorney_id', 
      type: 'text', 
      type_text: 'Short', 
      title: 'Passaporte do Oficial', 
      description: 'Escreva o passaporte do advogado responsável pela defesa do réu.', 
      placeholder: '344'
    },
    { 
      id: 'office_attorney_name', 
      type: 'text', 
      type_text: 'Short', 
      title: 'Nome do Oficial', 
      description: 'Escreva o nome do advogado responsável pela defesa do réu.', 
      placeholder: 'Dragon Luthor'
    }
  ],
  prisoner: [
    { 
      id: 'prisoner_id', 
      type: 'text', 
      type_text: 'Short',
      title: 'Passaporte do Detento', 
      description: 'Escreva o passaporte do detento.', 
      placeholder: '533'
    },
    { 
      id: 'prisoner_name', 
      type: 'text', 
      type_text: 'Short', 
      title: 'Nome do Detento', 
      description: 'Escreva o nome do detento.', 
      placeholder: 'Lian Ragnar'
    },
    {
      id: 'prisoner_file', 
      type: 'files',
      title: 'Foto do Detento', 
      description: 'Anexe a foto do detento com o RG visível.',
      min: 1,
      max: 1
    }
  ],
  articles: [
    { 
      id: 'articles1_select', 
      type: 'select', 
      title: 'Artigos [1 - 25]', 
      description: 'Selecione os artigos de crimes cometido pelo detento.', 
      placeholder: 'Selecione os artigos da lista 1', 
      options: Articles.filter((_, i) => i < 25).map((article) => ({ label: `Art. ${article.article} - ` + article.name, value: article.article }))
    },
    { 
      id: 'articles2_select', 
      type: 'select', 
      title: 'Lista de Artigos [26 - 50]', 
      description: 'Selecione os artigos de crimes cometido pelo detento.', 
      placeholder: 'Selecione os artigos da lista 2', 
      options: Articles.filter((_, i) => i >= 25 && i < 50).map((article) => ({ label: `Art. ${article.article} - ` + article.name, value: article.article }))
    },
    { 
      id: 'articles3_select', 
      type: 'select', 
      title: 'Lista de Artigos [51 - 75]', 
      description: 'Selecione os artigos de crimes cometido pelo detento.', 
      placeholder: 'Selecione os artigos da lista 3', 
      options: Articles.filter((_, i) => i >= 50 && i < 75).map((article) => ({ label: `Art. ${article.article} - ` + article.name, value: article.article }))
    },
    { 
      id: 'articles4_select', 
      type: 'select', 
      title: 'Lista de Artigos [76 - 100]', 
      description: 'Selecione os artigos de crimes cometido pelo detento.', 
      placeholder: 'Selecione os artigos da lista 4',
      options: Articles.filter((_, i) => i >= 75 && i < 100).map((article) => ({ label: `Art. ${article.article} - ` + article.name, value: article.article }))
    },
    {
      id: 'articles_file', 
      type: 'files',
      title: 'Foto da Mochila', 
      description: 'Anexe a foto da mochila do detento.',
      min: 1,
      max: 1
    }
  ],
  bail_paid: [
    { 
      id: 'bail_paid_select', 
      type: 'select', 
      title: 'Artigos Cometidos', 
      description: 'Selecione os artigos cometido pelo detento e que foi paga a fiança.', 
      placeholder: 'Selecione os artigos que foi pago a fiança', 
      options: [
        { label: 'Selecione os artigos que o réu está sendo acusado antes', value: '0' }
      ]
    }
  ],
  sentence: [
    { 
      id: 'sentence_months', 
      type: 'text', 
      type_text: 'Short', 
      title: 'Tempo da Pena', 
      description: 'Escreva o tempo da pena em meses em que o detento ficará preso.', 
      placeholder: '100'
    },
    { 
      id: 'sentence_fine', 
      type: 'text', 
      type_text: 'Short', 
      title: 'Multa', 
      description: 'Escreva o valor da multa em que o detento deverá pagar.', 
      placeholder: '100000'
    },
    { 
      id: 'sentence_reduction', 
      type: 'select', 
      title: 'Reduções', 
      description: 'Selecione as reduções que o detento teve.', 
      placeholder: 'Selecione as reduções', 
      options: Reductions.map((reduction) => ({ label: reduction.name, value: String(reduction.percentage) }))
    },
    {
      id: 'sentence_file', 
      type: 'files',
      title: 'Foto do Painel', 
      description: 'Anexe a foto do painel com o resultado da prisão do detento.',
      min: 1,
      max: 1
    }
  ]
};

module.exports = { 
  route: command
};