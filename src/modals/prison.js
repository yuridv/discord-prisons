const { MessageFlags, EmbedBuilder, ModalBuilder, UserSelectMenuBuilder, LabelBuilder, TextInputBuilder, TextInputStyle, FileUploadBuilder } = require('discord.js');

const { Errors } = require('../utils/functions');
const config = require('../../config.json');

const command = async(client, modal, args) => {
  try {
    console.log(modal.fields.getUploadedFiles('offices_prison_file'))
  } catch(err) {
    return Errors(err, `Command ${__filename}`)
      .then(() => command(client, modal))
      .catch((e) => modal.reply({ content: e.error, flags: MessageFlags.Ephemeral }));
  }
};

module.exports = { 
  route: command
};