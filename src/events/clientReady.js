const { colors } = require('../utils/bases');
const { Errors } = require('../utils/functions');
const { ActivityType } = require('discord.js');

const event = (client) => {
  try {
    console.log(colors.GREEN + colors.BOLD + '[Discord]=> Started successfully!' + colors.RESET);

    client.user.setPresence({
      status: 'dnd',
      activities: [
        {
          name: 'Created by MrDragon',
          type: ActivityType.Streaming,
          url: 'https://twitch.tv/mrdragonzin'
        }
      ]
    });
  } catch(err) {
    return Errors(err, `Event ${__filename}`)
      .then(() => event(client))
      .catch((e) => e);
  }
};

module.exports = event;