const {
  ContainerBuilder,
  ButtonBuilder
} = require('discord.js');

const config = require('../../../config.json');

const Container = (items, color) => {
  const container = new ContainerBuilder()
    .setAccentColor(parseInt((color || config.color).replace('#', ''), 16));

  for (const item of items) {
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
    } else if (item.type === 'image') {
      container.addMediaGalleryComponents((media) => media.addItems((image) => image.setURL(item.image)));
    } else if (item.type === 'buttons') {
      container.addActionRowComponents((row) =>
        row.addComponents(
          item.buttons.map((button) =>
            new ButtonBuilder()
              .setCustomId(button.id)
              .setEmoji(button.emoji?.match(/\d{15,}/)[0])
              .setLabel(button.label)
              .setStyle(button.style)
          )
        )
      );
    }
  }

  return container;
};

module.exports = Container;