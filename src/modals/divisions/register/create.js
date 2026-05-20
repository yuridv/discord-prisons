const { MessageFlags, EmbedBuilder, ButtonStyle } = require('discord.js');

const { Errors, Validate, Container } = require('../../../utils/functions');
const emojis = require('../../../../emojis.json');
const config = require('../../../../config.json');

const Modal = async(client, modal) => {
  try {
    const channel = modal.guild.channels.cache.get(config.divisions.channels.register.approve);
    if (!channel) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emojis.error} • *${modal.author || modal.user}, O canal de aprovação configurado não foi encontrado!*`);

      return modal.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ], content: `${modal.author || modal.user}` });
    }

    const camps = {
      'passport': { type: 'number', required: true, guild: modal.guild },
      'name': { type: 'string', required: true },
      'division': { type: 'string', required: true },
      'battalion': { type: 'string', required: true },
      'recruiter': { type: 'passport', required: true, guild: modal.guild }
    };

    const values = {};
    for (const id in camps) {
      const component = modal.components.find(c => c?.component?.customId === id)?.component;
      if (!component) continue;

      if (component.attachments?.first()?.url) {
        values[id] = component.attachments?.first()?.url;
      } else if (component.values) {
        values[id] = component.values[0];
      } else {
        values[id] = component.value;
      }
    }

    const validate = await Validate(values, camps)
      .catch((e) => e);

    if (validate?.errors?.length >= 1) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(validate.errors.map((e) => `${emojis.error} • ${e}`).join('\n'));

      return modal.reply({ content: `<@${modal.user.id}>`, embeds: [ embed ], flags: MessageFlags.Ephemeral });
    }

    const roles_division = config.divisions.roles.register.unidades[values.division];
    if (
      ![
        roles_division[roles_division.length - 1], // COMANDO
        roles_division[roles_division.length - 2], // SUB-COMANDO
        roles_division[roles_division.length - 3] // INSTRUTOR
      ]
        .some((role) => values.recruiter.member.roles.cache.has(role))
    ) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emojis.error} • *O recrutador selecionado não tem* ***permissão*** *para efetuar recrutamentos para essa* ***divisão!***`);

      return modal.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ], content: `<@${modal.member.id}>` });
    }

    if (
      [ roles_division[0] ]
        .some((role) => modal.member.roles.cache.has(role))
    ) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emojis.error} • *Você já faz parte da* ***Unidade*** *selecionada!*`);

      return modal.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ], content: `<@${modal.member.id}>` });
    }

    const role_battalion = config.divisions.roles.register.battalions[values.battalion];
    if (!role_battalion) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emojis.error} • *Não foi possível encontrar o cargo do batalhão* __***${values.battalion.toUpperCase()}***__ *na configuração!*`);

      return modal.reply({ content: `<@${modal.user.id}>`, embeds: [ embed ], flags: MessageFlags.Ephemeral });
    }

    const items = [
      {
        type: 'textDisplay',
        title: `# ${emojis.clipboard} ・ *Solicitação de Registro*`,
        description: '*Nesse registro contem os dados do oficial que foi recrutado.*'
      },
      { type: 'separator' },
      {
        type: 'textDisplay',
        description:
          `\n\n> ### ${emojis.pencil} ・ ***Informações do Solicitante:***` +
          `\n ・ **Usuário:** <@${modal.user.id}>` +
          `\n ・ **Nome:** ${values?.name}` +
          `\n ・ **Passaporte:** ${values?.passport}`
      },
      { type: 'separator' },
      {
        type: 'textDisplay',
        description:
          `\n\n> ### ${emojis.handcuffs} ・ ***Informações da Divisão:***` +
          `\n ・ **Divisão:** <@&${roles_division[0]}>` +
          `\n ・ **Batalhão:** ${values?.battalion.toUpperCase()}`
          // `\n ・ **Batalhão:** <@&${role_battalion}>`
      },
      { type: 'separator' },
      {
        type: 'textDisplay',
        description:
          `\n\n> ### ${emojis.folder} ・ ***Informações do Recrutador:***` +
          `\n ・ **Usuário:** <@${values.recruiter.member.id}>` +
          `\n ・ **Nome:** ${values.recruiter.name}` +
          `\n ・ **Passaporte:** ${values.recruiter.passport}`
      },
      { type: 'separator' },
      {
        type: 'image',
        image: config.banner_city
      },
      { type: 'separator' },
      {
        type: 'buttons',
        buttons: [
          {
            id: `divisions/register/approve-${modal.user.id}-${values.division}-${values.battalion}-${values.name}-${values.passport}`,
            emoji: emojis.success,
            label: 'Aprovar',
            style: ButtonStyle.Success
          },
          {
            id: `divisions/register/deny-${modal.user.id}-${values.division}`,
            emoji: emojis.error,
            label: 'Reprovar',
            style: ButtonStyle.Danger
          }
        ]
      }
    ];

    const container = await Container(items, '#FFFF00');

    await channel.send({ components: [ container ], flags: MessageFlags.IsComponentsV2 });

    await modal.member.roles.add(config.divisions.roles.register.waiting).catch(() => {});

    const embedSuccess = new EmbedBuilder()
      .setColor('#00FF00')
      .setDescription(`${emojis.success} • *O seu registro foi enviado com sucesso para* ***aprovação!***\n> *Aguarde até que um de nossos instrutores possa aprovar o seu registro!*`);

    return modal.reply({ flags: MessageFlags.Ephemeral, embeds: [ embedSuccess ], content: `${modal.author || modal.user}` });
  } catch (err) {
    return Errors(err, `Modal ${__filename}`)
      .then(() => Modal(client, modal))
      .catch(e => modal.reply({ content: e.error, flags: MessageFlags.Ephemeral }));
  }
};

module.exports = { route: Modal };