const { PermissionFlagsBits, EmbedBuilder, MessageFlags, ContainerBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const { Errors } = require('../../utils/functions');
const config = require('../../../config.json');
const emoji = require('../../../emojis.json');

const command = async(client, interaction, args) => {
  try {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ADMINISTRATOR)) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emoji.error} • *Você não possui permissão de* __***ADMINISTRADOR***__ *para utilizar esse comando!*`);

      return interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ] });
    }

    const container = new ContainerBuilder()
      .setAccentColor(parseInt(config.color.replace('#', ''), 16))

      // .addActionRowComponents((action) => 
      //   action.addComponents(
      //     new ButtonBuilder()
      //       .setDisabled(true)
      //       .setCustomId('block')
      //       .setLabel('Registro Penitenciário: [1006]')
      //       .setEmoji({ id: emoji.handcuffs.match(/\d{15,}/)[0] })
      //       .setStyle(ButtonStyle.Secondary),
      //     new ButtonBuilder()
      //       .setCustomId('left')
      //       .setEmoji({ id: emoji.arrow_left.match(/\d{15,}/)[0] })
      //       .setStyle(ButtonStyle.Secondary),
      //     new ButtonBuilder()
      //       .setCustomId('home')
      //       .setEmoji({ id: emoji.home.match(/\d{15,}/)[0] })
      //       .setStyle(ButtonStyle.Secondary),
      //     new ButtonBuilder()
      //       .setCustomId('right')
      //       .setEmoji({ id: emoji.arrow_right.match(/\d{15,}/)[0] })
      //       .setStyle(ButtonStyle.Secondary),
      //     new ButtonBuilder()
      //       .setCustomId('prison')
      //       .setEmoji({ id: emoji.plus.match(/\d{15,}/)[0] })
      //       .setStyle(ButtonStyle.Primary)
      //   )
      // )
      .addSectionComponents((section) =>
        section
          .addTextDisplayComponents((text) => 
            text.setContent(
              `# ${emoji.folder} ・ *Registro Penitenciário*` +
              '\n*Esse registro penitenciário reúne os dados da prisão, incluindo informações do detido, pena aplicada e oficiais responsáveis.*\n'  
            )
          )
          .setButtonAccessory((button) =>
            button.setCustomId('prison').setEmoji({ id: emoji.plus.match(/\d{15,}/)[0] }).setStyle(ButtonStyle.Secondary)
          )
      )

      .addSeparatorComponents((separator) => separator.setSpacing(1))
      .addTextDisplayComponents((text) => 
        text.setContent(`## ${emoji.tools} ***Informações dos Envolvidos***`)
      )
      .addSectionComponents((section) =>
        section
          .addTextDisplayComponents((text) => 
            text.setContent(`${emoji.arrow_right_animated} **Oficiais Penitenciários:** \`\`\`ini\n[1001] Dragon Luthor\n[1002] Mel Lysenko\`\`\``)
          )
          .setButtonAccessory((button) =>
            button.setCustomId('prison_edit-offices_prison').setEmoji({ id: emoji.pencil.match(/\d{15,}/)[0] }).setStyle(ButtonStyle.Secondary)
          )
      )
      .addSectionComponents((section) =>
        section
          .addTextDisplayComponents((text) => 
            text.setContent(`${emoji.arrow_right_animated} **Oficiais Primária:** \`\`\`ini\n[1003] João Fulano\n[1004] Maria Fulana\`\`\``)
          )
          .setButtonAccessory((button) =>
            button.setCustomId('prison_edit-offices_primary').setEmoji({ id: emoji.pencil.match(/\d{15,}/)[0] }).setStyle(ButtonStyle.Secondary)
          )
      )
      .addSectionComponents((section) =>
        section
          .addTextDisplayComponents((text) => 
            text.setContent(`${emoji.arrow_right_animated} **Advogado da Defesa:** \`\`\`ini\n❌ O réu dispensou a presença de um advogado ❌\`\`\``)
          )
          .setButtonAccessory((button) =>
            button.setCustomId('prison_edit-attorney').setEmoji({ id: emoji.pencil.match(/\d{15,}/)[0] }).setStyle(ButtonStyle.Secondary)
          )
      )

      .addSeparatorComponents((separator) => separator)

      .addSectionComponents((section) =>
        section
          .addTextDisplayComponents((text) => 
            text.setContent(`## ${emoji.handcuffs} ***Informações do Detido***`)
          )
          .setButtonAccessory((button) =>
            button.setCustomId('edit_reu').setEmoji({ id: emoji.pencil.match(/\d{15,}/)[0] }).setStyle(ButtonStyle.Secondary)
          )
      )
      .addSectionComponents((section) =>
        section
          .addTextDisplayComponents((text) => 
            text.setContent(`${emoji.invisible}\n${emoji.arrow_right_animated} **Nome do Réu:** \`\`\`ini\n[1006] Fulana Silva\`\`\``)
          )
          .setThumbnailAccessory((thumbnail) => thumbnail.setURL('https://media.discordapp.net/attachments/1382899414288433193/1477853988329099335/image.png?ex=69a84088&is=69a6ef08&hm=f620725ba28ef69521e7896b4e5009315ee74f3876d17d2af34f94f7a80cdcf2&=&format=webp'))
      )

      .addSeparatorComponents((separator) => separator)

      .addSectionComponents((section) =>
        section
          .addTextDisplayComponents((text) => 
            text.setContent(`## ${emoji.clipboard} ***Crimes Cometidos***`)
          )
          .setButtonAccessory((button) =>
            button.setCustomId('edit_crimes').setEmoji({ id: emoji.pencil.match(/\d{15,}/)[0] }).setStyle(ButtonStyle.Secondary)
          )
      )
      .addSectionComponents((section) =>
        section
          .addTextDisplayComponents((text) => 
            text.setContent(
              `${emoji.arrow_right_animated} **Artigos dos Crimes:** \`\`\`ini\nArtigo 142 - Corrida Ilegal\nArtigo 157 - Posse Ilegal de Arma Longa\nArtigo 171 - Posse de Dinheiro Sujo (acima de 250K)\`\`\`` +
              `\n${emoji.arrow_right_animated} **Fianças Pagas:** \`\`\`ini\nArtigo 142 - Corrida Ilegal [R$ 50.000,00]\`\`\``
            )
          )
          .setThumbnailAccessory((thumbnail) => thumbnail.setURL('https://media.discordapp.net/attachments/1449501267880710298/1477854665638154342/image.png?ex=69a8e9e9&is=69a79869&hm=f5027fda4c5e277bc063074cdda997e0fbd6b65be5ba523cae2d41089154da29&=&format=webp'))
      )

      .addSeparatorComponents((separator) => separator)

      .addSectionComponents((section) =>
        section
          .addTextDisplayComponents((text) => 
            text.setContent(`## ${emoji.clipboard} ***Informações da Condenação***`)
          )
          .setButtonAccessory((button) =>
            button.setCustomId('edit_condenacao').setEmoji({ id: emoji.pencil.match(/\d{15,}/)[0] }).setStyle(ButtonStyle.Secondary)
          )
      )
      .addSectionComponents((section) =>
        section
          .addTextDisplayComponents((text) => 
            text.setContent(
              `${emoji.invisible}\n${emoji.arrow_right_animated} **Meses:** *240 meses*` +
              `\n${emoji.arrow_right_animated} **Multa:** *R$ 330.000,00*` +
              `\n${emoji.arrow_right_animated} **Redução de Pena:** *Réu Primário [20%]*`
            )
          )
          .setThumbnailAccessory((thumbnail) => thumbnail.setURL('https://media.discordapp.net/attachments/1449501267880710298/1477854665986019418/image.png?ex=69a8e9e9&is=69a79869&hm=22e8957ff001853b4036c12e0f59a5eb3e633bf8359b04cc74fae71c18e42d67&=&format=webp'))
      )

    // .addMediaGalleryComponents((mediaGallery) => 
    //   mediaGallery.addItems((item) => item.setDescription('alt text displaying on the image').setURL('https://media.discordapp.net/attachments/1382899414288433193/1477853988329099335/image.png?ex=69a84088&is=69a6ef08&hm=f620725ba28ef69521e7896b4e5009315ee74f3876d17d2af34f94f7a80cdcf2&=&format=webp&width=1024&height=1024'))
    // )


    /* .addSectionComponents((section) =>
      section
        .addTextDisplayComponents((text) => 
          text
            .setContent(
              `## ${emoji.tools} ***Identidade dos Envolvidos:***` +

              '\n\n\n> **Oficiais Penitenciários:**' + 
              '\n*Oficias responsáveis pelo registro da prisão do réu.*' +
              '\n```ini\n[1001] Dragon Luthor\n[1002] Mel Lysenko```' +

              '\n> **Oficiais da Primária:**' + 
              '\n*Oficias responsáveis pela prisão do réu.*' +
              '\n```ini\n[1003] João Fulano\n[1004] Maria Fulana```' +

              '\n> **Nome do Advogado:**' + 
              '\n*Nome e o passaporte do advogado responsável pela defesa do réu.*' +
              '\n```ini\n[1005] Pedro Fulano```' +

              '\n> **Nome do Prisioneiro:**' + 
              '\n*Nome e o passaporte do réu.*' +
              '\n```ini\n[1006] James Fulano```\n'
            )
        )
        .setButtonAccessory((button) =>
          button
            .setCustomId('edit_offices')
            .setEmoji({ id: emoji.pencil.match(/\d{15,}/)[0] })
            .setStyle(ButtonStyle.Secondary)
        )
    )
    .addSeparatorComponents((separator) => separator)
    .addSectionComponents((section) =>
      section
        .addTextDisplayComponents((text) => 
          text
            .setContent(
              `\n## ${emoji.handcuffs} ***Pena do Prisioneiro:***` +

              '\n\n\n> **Artigos:**' + 
              '\n*Lista dos artigos atribuídos ao prisioneiro.*' +
              '\n```ini\nArtigo 142 - Corrida Ilegal\nArtigo 157 - Posse Ilegal de Arma Longa\nArtigo 171 - Posse de Dinheiro Sujo (acima de 250K)```' +

              '\n> **Tempo de Prisão (Meses)**' + 
              '\n*Número total de meses que o prisioneiro deverá cumprir.*' +
              '\n```ini\n240```' +

              '\n> **Valor da Multa:**' + 
              '\n*Valor total da multa aplicada ao réu.*' +
              '\n```ini\nR$ 250.000,00```'
            )
        )
        .setButtonAccessory((button) =>
          button
            .setCustomId('edit_reu')
            .setEmoji({ id: emoji.pencil.match(/\d{15,}/)[0] })
            .setStyle(ButtonStyle.Secondary)
        )
    )
    */


    // .addActionRowComponents((actionRow) =>
    //   actionRow.addComponents(
    //     new ButtonBuilder()
    //       .setCustomId('prison')
    //       .setEmoji('🚨')
    //       .setLabel('Registrar Prisão')
    //       .setStyle(ButtonStyle.Primary)
    //   )
    // )
    // .addSeparatorComponents((separator) => separator)
    // .addSectionComponents((section) =>
    //   section
    //     .addTextDisplayComponents((text) => text.setContent('Selecione um usuário'))
    //     .setButtonAccessory((button) =>
    //       button.setCustomId('back-prison2').setEmoji({ id: '1240480606417195018' }).setStyle(ButtonStyle.Secondary)
    //     )
        
    // );

    await interaction.reply({ components: [ container ], flags: MessageFlags.IsComponentsV2 });
  } catch (err) {
    return Errors(err, `Command ${__filename}`)
      .then(() => command(client, interaction, args))
      .catch((e) => interaction.reply({ content: `${emoji.error} | ` + e.error, flags: MessageFlags.Ephemeral }));
  }
};

module.exports = {
  route: command,
  description: '🐛 [Debug] 🐛 | Comando para simular uma log de prisão.'
};