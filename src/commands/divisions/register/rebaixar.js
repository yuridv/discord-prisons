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
    const channel = interaction.guild.channels.cache.get(config.divisions.channels.register.promotions);
    if (!channel) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emojis.error} • *${interaction.author || interaction.user}, O canal de rebaixamentos configurado não foi encontrado!*`);

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
        .setDescription(`${emojis.error} • Você não tem permissão para rebaixar um oficial desta divisão.`)
        .setColor('#FF0000');

      return interaction.reply({ embeds: [ embed ], flags: MessageFlags.Ephemeral });
    }

    // Encontrar o cargo atual do membro (índice mais alto que ele possui, de 1 até length-1)
    const getCurrentRankIndex = (m) => {
      for (let i = roles_division.length - 1; i >= 1; i--) {
        if (m.roles.cache.has(roles_division[i])) return i;
      }
      return 0;
    };

    const memberRankIndex = getCurrentRankIndex(user.member);

    if (memberRankIndex === 0) {
      const embed = new EmbedBuilder()
        .setDescription(`${emojis.error} • O oficial selecionado não possui nenhum cargo nesta divisão.`)
        .setColor('#FF0000');

      return interaction.reply({ embeds: [ embed ], flags: MessageFlags.Ephemeral });
    }

    const prevRankIndex = memberRankIndex - 1;

    // Não pode rebaixar abaixo do Probatório (índice 1)
    if (prevRankIndex < 1) {
      const embed = new EmbedBuilder()
        .setDescription(`${emojis.error} • O oficial selecionado já está no cargo mais baixo da divisão.`)
        .setColor('#FF0000');

      return interaction.reply({ embeds: [ embed ], flags: MessageFlags.Ephemeral });
    }

    // O autor precisa ter patente SUPERIOR ao cargo atual do membro
    const authorRankIndex = getCurrentRankIndex(interaction.member);

    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator) && authorRankIndex <= memberRankIndex) {
      const embed = new EmbedBuilder()
        .setDescription(`${emojis.error} • Você não tem permissão para rebaixar um oficial com patente igual ou superior à sua.`)
        .setColor('#FF0000');

      return interaction.reply({ embeds: [ embed ], flags: MessageFlags.Ephemeral });
    }

    // Remover cargo atual e adicionar o anterior
    await user.member.roles.remove(roles_division[memberRankIndex]);
    await user.member.roles.add(roles_division[prevRankIndex]);

    const motivo = args.find((r) => r.name === 'motivo')?.value;

    const embedSuccess = new EmbedBuilder()
      .setColor('#00FF00')
      .setDescription(
        `${emojis.success} • *O oficial* ***${user.name} [${user.passport}]*** *foi rebaixado para* <@&${roles_division[prevRankIndex]}> *na divisão* ***${division.toUpperCase()}*** *com sucesso!*`
      );

    await interaction.reply({ embeds: [ embedSuccess ], flags: MessageFlags.Ephemeral }).catch(() => {});

    const { passport, name } = extractName(interaction.member.nickname);

    const container = await Container([
      {
        type: 'textDisplay',
        title: `# ${emojis.clipboard} ・ *Oficial Rebaixado*`,
        description: '*Nesse registro contem os dados do oficial que foi rebaixado.*'
      },
      { type: 'separator' },
      {
        type: 'textDisplay',
        description:
          `\n\n> ### ${emojis.handcuffs} ・ ***Informações do Rebaixado:***` +
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
          `\n ・ **Patente Anterior:** <@&${roles_division[memberRankIndex]}>` +
          `\n ・ **Patente Nova:** <@&${roles_division[prevRankIndex]}>` +
          `\n ・ **Motivo:** ${motivo}`
      },
      { type: 'separator' },
      {
        type: 'image',
        image: config.banner_city
      }
    ], '#FF8C00');

    return channel.send({ components: [ container ], flags: MessageFlags.IsComponentsV2 });
  } catch(err) {
    return Errors(err, `Command ${__filename}`)
      .then(() => command(client, interaction, args))
      .catch((e) => interaction.reply({ content: `${emojis.error} | ` + e.error, flags: MessageFlags.Ephemeral }));
  }
};

module.exports = { 
  route: command,
  description: '📝 [Register] 📝 | Comando para rebaixar um oficial da sua divisão.',
  options: [
    {
      'name': 'oficial',
      'description': 'Marque ou coloque o ID do oficial que será rebaixado',
      'type': 6,
      'required': true
    },
    {
      'name': 'divisão',
      'description': 'Selecione a divisão que o oficial será rebaixado.',
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
      'description': 'Coloque o motivo do rebaixamento do oficial.',
      'type': 3,
      'required': true
    }
  ]
};
