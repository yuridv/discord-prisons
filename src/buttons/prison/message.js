const {
  EmbedBuilder,
  MessageFlags,
  ContainerBuilder,
  ButtonStyle
} = require('discord.js');

const { Errors } = require('../../utils/functions');
const Prison = require('../../models/prison');

const emojis = require('../../../emojis.json');
const config = require('../../../config.json');

const command = async(client, interaction, args) => {
  try {
    const channel = interaction.guild.channels.cache.get(config?.channels?.prisons);
    if (!channel) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emojis.error} • *${interaction.author || interaction.user}, O canal de prisões configurado não foi encontrado!*`);

      return interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ], content: `${interaction.author || interaction.user}` });
    }

    if (!args || !args[0]) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emojis.error} • *${interaction.author || interaction.user}, você não informou o* __***ID***__ *da prisão!*`);

      return interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ], content: `${interaction.author || interaction.user}` });
    }

    const prison = await Prison.findOne({ _id: args[0] });
    if (!prison) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emojis.error} • *${interaction.author || interaction.user}, não encontrei o registro da prisão selecionada!*`);

      return interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ], content: `${interaction.author || interaction.user}` });
    }

    const menu_officials = [
      {
        type: 'section',
        title: `# ${emojis.folder} ・ *Registro Penitenciário*`,
        description: '*Esse registro penitenciário reúne os dados da prisão, incluindo informações do detido, pena aplicada e oficiais responsáveis.*',
        button: {
          id: 'prison',
          emoji: emojis.plus,
          style: ButtonStyle.Secondary
        }
      },

      { type: 'separator' },

      { 
        type: 'textDisplay',
        title: `## ${emojis.tools} ・ ***Informações dos Envolvidos***`
      },
      {
        type: 'section',
        title: `${emojis.arrow_right_animated} **Oficiais Penitenciários:**`,
        description: `\`\`\`ini\n${prison.officers_prison.map((office) => `[${office.id}] ${office.name}`).join('\n') || 'Não Definido'}\`\`\``,
        button: {
          id: `prison/edit-offices_prison-${args[0]}`,
          emoji: emojis.pencil,
          style: ButtonStyle.Secondary
        }
      },
      {
        type: 'section',
        title: `${emojis.arrow_right_animated} **Oficiais da Primária:**`,
        description: `\`\`\`ini\n${prison.officers_conduction.map((office) => `[${office.id}] ${office.name}`).join('\n') || 'Não Definido'}\`\`\``,
        button: {
          id: `prison/edit-offices_conduction-${args[0]}`,
          emoji: emojis.pencil,
          style: ButtonStyle.Secondary
        }
      },
      {
        type: 'section',
        title: `${emojis.arrow_right_animated} **Advogado da Defesa:**`,
        description: prison.attorney?.id && prison.attorney?.name &&
          `\`\`\`ini\n[${prison.attorney.id}] ${prison.attorney.name}\`\`\``
        || prison.attorney?.exemption &&
          `\`\`\`ini\n${prison.attorney?.exemption}\`\`\``
        || '```ini\nNão Definido```',
        button: {
          id: `prison/edit-attorney-${args[0]}`,
          emoji: emojis.pencil,
          style: ButtonStyle.Secondary
        }
      }
    ];

    const menu_prisoner = [
      {
        type: 'section',
        title: `## ${emojis.handcuffs} ・ **Informações do Detento:**`,
        button: {
          id: `prison/edit-prisoner-${args[0]}`,
          emoji: emojis.pencil,
          style: ButtonStyle.Secondary
        }
      },
      {
        type: 'section',
        title: `${emojis.invisible}\n${emojis.arrow_right_animated} **Nome do Detento:**`,
        description: `\`\`\`ini\n[${prison.prisoner.id}] ${prison.prisoner.name}\`\`\``,
        image: prison.evidences.find((evidence) => evidence.type === 'rg')?.url
      }
    ];

    const menu_articles = [
      {
        type: 'section',
        title: `## ${emojis.clipboard} ・ **Crimes Cometidos:**`,
        button: {
          id: `prison/edit-articles-${args[0]}`,
          emoji: emojis.pencil,
          style: ButtonStyle.Secondary
        }
      },
      {
        type: 'section',
        title: `${emojis.arrow_right_animated} **Artigos dos Crimes:**`,
        description: `\`\`\`ini\n${
          prison.articles
            .map((article) => `Art. ${article.article} - ${article.name}`).join('\n') || 'Não Definido'
        }\`\`\``,
        image: prison.evidences.find((evidence) => evidence.type === 'rg')?.url
      },
      {
        type: 'section',
        title: `${emojis.arrow_right_animated} **Fianças Pagas:**`,
        description: `\`\`\`ini\n${
          prison.articles
            .filter((article) => article.bail_paid)
            .map((article) => `Art. ${article.article} - ${article.name}`).join('\n') || 'Não Definido'
        }\`\`\``,
        button: {
          id: `prison/edit-bail_paid-${args[0]}`,
          emoji: emojis.pencil,
          style: ButtonStyle.Secondary
        }
      }
    ];

    const menu_sentence = [
      {
        type: 'section',
        title: `## ${emojis.pencil} ・ **Informações da Condenação:**`,
        button: {
          id: `prison/edit-sentence-${args[0]}`,
          emoji: emojis.pencil,
          style: ButtonStyle.Secondary
        }
      },
      {
        type: 'section',
        title: emojis.invisible,
        description: `${emojis.arrow_right_animated} **Pena:** *${prison.months} meses*` +
          `\n${emojis.arrow_right_animated} **Multa:** *R$ ${prison.fine}*` +
          `\n${emojis.arrow_right_animated} **Redução:** *${prison.reduction.map((reduction) => `${reduction.name} [${reduction.percentage}]`).join(', ') || '0%'}*`,
        image: prison.evidences.find((evidence) => evidence.type === 'rg')?.url
      }
    ];

    const items = [
      ...menu_officials,
      { type: 'separator' },
      ...menu_prisoner, 
      { type: 'separator' },
      ...menu_articles,
      { type: 'separator' },
      ...menu_sentence
    ];

    const container = newContainer(items);

    await channel.send({ components: [ container ], flags: MessageFlags.IsComponentsV2 });
  } catch(err) {
    return Errors(err, `Command ${__filename}`)
      .then(() => command(client, interaction))
      .catch((e) => interaction.reply({ content: e.error, flags: MessageFlags.Ephemeral }));
  }
};

const newContainer = (items) => {
  const container = new ContainerBuilder()
    .setAccentColor(parseInt(config.color.replace('#', ''), 16));

  for (let item of items) {
    if (item.type === 'textDisplay') {
      container.addTextDisplayComponents((text) => text.setContent((item.title || '') + '\n' + (item.description || '')));
    } else if (item.type === 'section' && item.button) {
      container.addSectionComponents((section) =>
        section
          .addTextDisplayComponents((text) => 
            text.setContent((item.title || '') + '\n' + (item.description || ''))
          )
          .setButtonAccessory((button) =>
            button
              .setCustomId(item.button.id)
              .setEmoji({ id: item.button.emoji?.match(/\d{15,}/)[0] })
              .setStyle(item.button.style)
          )
      );
    } else if (item.type === 'section' && item.image) {
      container.addSectionComponents((section) =>
        section
          .addTextDisplayComponents((text) => 
            text.setContent((item.title || '') + '\n' + (item.description || ''))
          )
          .setThumbnailAccessory((thumbnail) => 
            thumbnail.setURL(item.image)
          )
      );
    } else if (item.type === 'separator') {
      container.addSeparatorComponents((separator) => separator);
    }
  }

  return container;
}

module.exports = { 
  route: command
};