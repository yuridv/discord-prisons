const { MessageFlags } = require('discord.js');

const { Errors } = require('../../utils/functions');

const camps = [
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
    console.log('COMPONENTS => ', args, modal.components);
    console.log('COMPONENTS FIND', modal.components.find((r) => r.component.customId === 'office_aux_prison_select')?.component?.values);

    for (const camp of camps) {
      console.log(camp);
    }

    const office_aux_prison = modal.fields.getSelectMenuValue('office_aux_prison_select');
    console.log(office_aux_prison);
    

    // modal.fields.getUploadedFiles('ID') // GET FILE
    // modal.fields.getTextInputValue('ID') // GET TEXT
    // modal.fields.getStringSelectValues('ID') // GET SELECT
    // modal.fields.getUserSelectValues('ID') // GET USER

  } catch(err) {
    return Errors(err, `Command ${__filename}`)
      .then(() => command(client, modal))
      .catch((e) => modal.reply({ content: e.error, flags: MessageFlags.Ephemeral }));
  }
};

module.exports = { 
  route: command
};