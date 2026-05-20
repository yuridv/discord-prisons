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
    if (!userId || !division || !battalion || !userName || !userPassport) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emojis.error} • *Não foi passado os dados obrigatórios para efetuar essa ação. Reporte ao meu desenvolvedor!*`);

      return interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ], content: `<@${interaction.member.id}>` });
    }

    const role_battalion = config.divisions.roles.register.battalions[battalion];
    if (!role_battalion) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emojis.error} • *O cargo do batalhão ***'${battalion.toUpperCase()}'*** não foi configurado!*`);

      return interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ], content: `<@${interaction.member.id}>` });
    }

    const roles_division = config.divisions.roles.register.unidades[division];
    if (
      ![
        roles_division[roles_division.length - 1], // COMANDO
        roles_division[roles_division.length - 2], // SUB-COMANDO
        roles_division[roles_division.length - 3]  // INSTRUTOR
      ]
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
      await user.roles.remove(config.divisions.roles.register.unregistered).catch(() => {});
      await user.roles.remove(config.divisions.roles.register.waiting).catch(() => {});

      await user.roles.remove(config.divisions.roles.register.battalions.militar).catch(() => {});
      await user.roles.remove(config.divisions.roles.register.battalions.civil).catch(() => {});
      await user.roles.remove(config.divisions.roles.register.battalions.exercito).catch(() => {});

      await user.roles.add([
        config.divisions.roles.register.category.battalions, // Categoria Batalhões
        role_battalion, // Batalhão

        config.divisions.roles.register.category[division], // Categoria Divisões
        roles_division[0], // Unidade da Divisão
        roles_division[1] // Probatório da Divisão
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