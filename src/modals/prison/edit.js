const { MessageFlags } = require('discord.js');

const { Errors } = require('../../utils/functions');

const campsBase = [
  { 'id': 'office_aux_prison_select', 'type': 'user_select' },
  { 'id': 'office_aux_prison_id', 'type': 'text' },
  { 'id': 'office_aux_prison_name', 'type': 'text' },

  { 'id': 'offices_conduction_select', 'type': 'user_select' },
  { 'id': 'office_conduction_id', 'type': 'text' },
  { 'id': 'office_conduction_name', 'type': 'text' },
  { 'id': 'office_aux_conduction_id', 'type': 'text' },
  { 'id': 'office_aux_conduction_name', 'type': 'text' },

  { 'id': 'office_attorney_select', 'type': 'select' },
  { 'id': 'office_attorney_id', 'type': 'text' },
  { 'id': 'office_attorney_name', 'type': 'text' },

  { 'id': 'prisoner_id', 'type': 'text' },
  { 'id': 'prisoner_name', 'type': 'text' },
  { 'id': 'prisoner_file', 'type': 'files' },

  { 'id': 'articles1_select', 'type': 'select' },
  { 'id': 'articles2_select', 'type': 'select' },
  { 'id': 'articles3_select', 'type': 'select' },
  { 'id': 'articles4_select', 'type': 'select' },
  { 'id': 'articles_file', 'type': 'files' },

  { 'id': 'bail_paid_select', 'type': 'select' },

  { 'id': 'sentence_months', 'type': 'text' },
  { 'id': 'sentence_fine', 'type': 'text' },
  { 'id': 'sentence_reduction', 'type': 'select' },
  { 'id': 'sentence_file', 'type': 'files' }
];

const command = async(client, modal, args) => {
  try {
    const camps = {};
    for (const camp of campsBase) {
      const component = modal.components.find((r) => r?.component?.customId === camp.id)?.component;
      camps[camp.id] = component?.values || component?.value;
      if (camp.type === 'files' && component) camps[camp.id] = component.attachments?.first()?.url;
    }



    console.log(camps);
    

    // modal.fields.getUploadedFiles('ID') // GET FILE
    // modal.fields.getTextInputValue('ID') // GET TEXT
    // modal.fields.getStringSelectValues('ID') // GET SELECT

  } catch(err) {
    return Errors(err, `Command ${__filename}`)
      .then(() => command(client, modal))
      .catch((e) => modal.reply({ content: e.error, flags: MessageFlags.Ephemeral }));
  }
};

module.exports = { 
  route: command
};