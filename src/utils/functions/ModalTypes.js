const {
  UserSelectMenuBuilder,
  LabelBuilder,
  TextInputBuilder,
  TextInputStyle,
  StringSelectMenuBuilder,
  FileUploadBuilder
} = require('discord.js');

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
              value: String(option.value),
              emoji: option.emoji ? option.emoji : undefined
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

module.exports = Types;