const {
  EmbedBuilder,
  MessageFlags,
  PermissionFlagsBits
} = require('discord.js');

const { Errors, Validate, Container, extractName } = require('../../../utils/functions');

const config = require('../../../../config.json');
const emojis = require('../../../../emojis.json');

const command = async(client, interaction, args) => {
  try {
    const channel = interaction.guild.channels.cache.get(config.divisions.channels.register.exoneration);
    if (!channel) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emojis.error} • *${interaction.author || interaction.user}, O canal de aprovação configurado não foi encontrado!*`);

      return interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ] });
    }

    const userId = args.find((r) => r.name === 'oficial')?.value
      ?.replace('@','')
      .replace('<','')
      .replace('>','');

    const user = await Validate({ userId }, {
      'userId': { type: 'id', guild: interaction.guild }
    })
      .then((m) => m.userId)
      .catch(() => {});

    if (!user?.member) {
      const embed = new EmbedBuilder()
        .setDescription(`${emojis.error} • Não consegui encontrar o oficial selecionado.`)
        .setColor('#FF0000');

      return interaction.reply({ embeds: [ embed ], flags: MessageFlags.Ephemeral });
    }

    const division = args.find((r) => r.name === 'divisão')?.value;
    const roles_division = config.divisions.roles.register.unidades[division];

    if (!user.member.roles.cache.has(roles_division[0])) {
      const embed = new EmbedBuilder()
        .setDescription(`${emojis.error} • O oficial selecionado não faz parte da divisão selecionada.`)
        .setColor('#FF0000');

      return interaction.reply({ embeds: [ embed ], flags: MessageFlags.Ephemeral });
    }

    if (
      !interaction.member.permissions.has(PermissionFlagsBits.Administrator) &&
      ![
        roles_division[roles_division.length - 1], // COMANDO
        roles_division[roles_division.length - 2], // SUB-COMANDO
        roles_division[roles_division.length - 3]  // INSTRUTOR
      ]
        .some((role) => interaction.member.roles.cache.has(role))
    ) {
      const embed = new EmbedBuilder()
        .setDescription(`${emojis.error} • Você não tem permissão para exonerar um oficial desta divisão.`)
        .setColor('#FF0000');

      return interaction.reply({ embeds: [ embed ], flags: MessageFlags.Ephemeral });
    }

    // Hierarquia: COMANDO (3) > SUB-COMANDO (2) > INSTRUTOR (1) > sem cargo (0)
    const hierarchy = [
      roles_division[roles_division.length - 3], // INSTRUTOR  = index 0 -> nível 1
      roles_division[roles_division.length - 2], // SUB-COMANDO = index 1 -> nível 2
      roles_division[roles_division.length - 1]  // COMANDO     = index 2 -> nível 3
    ];

    const getLevel = (m) => {
      for (let i = hierarchy.length - 1; i >= 0; i--) {
        if (m.roles.cache.has(hierarchy[i])) return i + 1;
      }
      return 0;
    };

    const authorLevel = getLevel(interaction.member);
    const memberLevel = getLevel(user.member);

    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator) && memberLevel >= authorLevel) {
      const embed = new EmbedBuilder()
        .setDescription(`${emojis.error} • Você não tem permissão para exonerar um oficial com patente igual ou superior à sua.`)
        .setColor('#FF0000');

      return interaction.reply({ embeds: [ embed ], flags: MessageFlags.Ephemeral });
    }

    for (const role of roles_division) {
      await user.member.roles.remove(role).catch(() => {});
    }

    await user.member.roles.remove(config.divisions.roles.register.category[division]).catch(() => {});

    const motivo = args.find((r) => r.name === 'motivo')?.value;
    const { passport, name } = extractName(interaction.member.nickname);

    const container = await Container([
      {
        type: 'textDisplay',
        title: `# ${emojis.clipboard} ・ *Oficial Exonerado*`,
        description: '*Nesse registro contem os dados do oficial que foi exonerado.*'
      },
      { type: 'separator' },
      {
        type: 'textDisplay',
        description:
          `\n\n> ### ${emojis.handcuffs} ・ ***Informações do Exonerado:***` +
          `\n ・ **Usuário:** <@${user.member.id}>` +
          `\n ・ **Nome:** ${user?.name}` +
          `\n ・ **Passaporte:** ${user?.passport}`
      },
      { type: 'separator' },
      {
        type: 'textDisplay',
        description:
          `\n\n> ### ${emojis.pencil} ・ ***Informações do Responsável:***` +
          `\n ・ **Usuário:** <@${interaction.member.id}>` +
          `\n ・ **Nome:** ${name}` +
          `\n ・ **Passaporte:** ${passport}`
      },
      { type: 'separator' },
      {
        type: 'textDisplay',
        description:
          `\n\n> ### ${emojis.folder} ・ ***Informações Extras:***` +
          `\n ・ **Divisão:** <@&${roles_division[0]}>` +
          `\n ・ **Motivo:** ${motivo}`
      },
      { type: 'separator' },
      {
        type: 'image',
        image: config.banner_city
      }
    ], '#FF0000');

    channel.send({ components: [ container ], flags: MessageFlags.IsComponentsV2 });

    const embedSuccess = new EmbedBuilder()
      .setColor('#00FF00')
      .setDescription(`${emojis.success} • *O oficial* ***${user.name} [${user.passport}]*** *foi exonerado da divisão* ***${division.toUpperCase()}*** *com sucesso!*`);

    return interaction.reply({ embeds: [ embedSuccess ], flags: MessageFlags.Ephemeral });
  } catch(err) {
    return Errors(err, `Command ${__filename}`)
      .then(() => command(client, interaction, args))
      .catch((e) => interaction.reply({ content: `${emojis.error} | ` + e.error, flags: MessageFlags.Ephemeral }));
  }
};

module.exports = { 
  route: command,
  description: '📝 [Register] 📝 | Comando para exonerar um oficial da sua divisão.',
  options: [
    {
      'name': 'oficial',
      'description': 'Marque ou coloque o ID de oficial que será exonerado',
      'type': 6,
      'required': true
    },
    {
      'name': 'divisão',
      'description': 'Selecione a divisão que o oficial será exonerado.',
      'type': 3,
      'required': true,
      'choices': [
        { 'name': 'GRAER', 'value': 'graer' },
        { 'name': 'SPEED', 'value': 'speed' },
        { 'name': 'GTM', 'value': 'gtm' }
      ]
    },
    {
      'name': 'motivo',
      'description': 'Coloque o motivo da exoneração do oficial.',
      'type': 3,
      'required': true
    }
  ]
};