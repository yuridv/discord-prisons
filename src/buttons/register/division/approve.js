const {
  MessageFlags,
  EmbedBuilder,
  SeparatorBuilder,
  TextDisplayBuilder
} = require('discord.js');

const { Errors, extractName } = require('../../../utils/functions');

const config = require('../../../../config.json');
const emojis = require('../../../../emojis.json');

const button = async(client, interaction, args) => {
  try {
    const [ userId, division, battalion, userName, userPassport ] = args;
    if (!userId || !division) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emojis.error} • *Não foi passado os dados obrigatórios para efetuar essa ação. Reporte ao meu desenvolvedor!*`);

      return interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ], content: `<@${interaction.member.id}>` });
    }

    const role_battalion = config.roles.battalions[battalion.toLowerCase()];
    if (!role_battalion) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emojis.error} • *O cargo do batalhão ***'${battalion.toUpperCase()}'*** não foi configurado!*`);

      return interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ], content: `<@${interaction.member.id}>` });
    }

    const roles_division = config.roles.divisions[division.toLowerCase()];
    if (
      ![ roles_division.comando, roles_division.subcomando, roles_division.instrutor ]
        .some((role) => interaction.member.roles.cache.has(role))
    ) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emojis.error} • *Você não tem permissão para aprovar esse registro!*`);

      return interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ], content: `<@${interaction.member.id}>` });
    }

    const { passport, name } = extractName(interaction.member.nickname);
    if (!passport || !name) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emojis.error} • *O seu nome não possui um passaporte valido para efetuar essa ação.*`);

      return interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ], content: `<@${interaction.member.id}>` });
    }

    const container = interaction.message.components[0];

    container.data.accent_color = parseInt(('#00FF00').replace('#', ''), 16);
    container.components[0].data.content = `# ${emojis.success} ・ *Registro Aprovado*\n*Nesse registro contem os dados do oficial que foi recrutado.*`;

    container.components.splice(7, 0,
      new SeparatorBuilder(),
      new TextDisplayBuilder()
        .setContent(
          `\n\n> ### ${emojis.success} ・ ***Aprovado por:***` +
          `\n ・ **Usuário:** <@${interaction.user.id}>` +
          `\n ・ **Nome:** ${name}` +
          `\n ・ **Passaporte:** ${passport}`
        )
    );

    container.components.pop();
    container.components.pop();

    const user = interaction.guild.members.cache.get(userId);
    if (user) {
      await user.roles.remove([
        config.roles.register.random,
        config.roles.register.waiting
      ]).catch(() => {});

      await user.roles.add([
        config.roles.divisions.category.battalion,
        role_battalion,

        config.roles.divisions.category.unidade,
        roles_division.unidade,

        config.roles.divisions.category.probatorio,
        roles_division.probatorio
      ]).catch(() => {});

      await user.setNickname(`${division.toUpperCase()}・${userName} [${userPassport}]`).catch(() => {});
    }

    return interaction.message.edit({ components: [ container ] });
  } catch(err) {
    return Errors(err, `Button ${__filename}`)
      .then(() => button(client, interaction))
      .catch((e) => interaction.reply({ content: e.error, flags: MessageFlags.Ephemeral }));
  }
};

module.exports = { route: button };