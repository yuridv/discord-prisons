const { Errors } = require('../../utils/functions');

const event = async(client, interaction) => {
  try {
    // Interações em forma de comandos
    if (interaction.isChatInputCommand()) {
      const command = client.commands.find(r => r.name === interaction.commandName);
      if (!command?.route) return;

      const args = interaction.options._hoistedOptions;
      await command.route(client, interaction, args);
    }

    // Interações em forma de botões
    else if (interaction.isButton()) {
      const id = interaction.customId.split('-')[0];
      const args = interaction.customId.split('-').filter((r, i) => i !== 0);

      const button = client.buttons.find(r => r.name === id);
      if (!button || !button.route) return;

      await button.route(client, interaction, args);
    }

    // Interações em forma de formulários / modals
    else if (interaction.isModalSubmit()) {
      const id = interaction.customId.split('-')[0];
      const args = interaction.customId.split('-').filter((r, i) => i !== 0);

      const modal = client.modals.find(r => r.name === id);
      if (!modal || !modal.route) return;

      await modal.route(client, interaction, args);
    }
  } catch(err) {
    return Errors(err, `Event ${__filename}`)
      .then(() => event(client, interaction))
      .catch((e) => e);
  }
};

module.exports = event;