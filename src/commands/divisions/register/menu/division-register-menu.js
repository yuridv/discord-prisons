const {
  EmbedBuilder,
  ButtonStyle,
  MessageFlags,
  PermissionFlagsBits
} = require('discord.js');

const { Errors, Container } = require('../../../../utils/functions');

const config = require('../../../../../config.json');
const emojis = require('../../../../../emojis.json');

const command = async(client, interaction, args) => {
  try {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emojis.error} • *Você não possui permissão de* __***ADMINISTRADOR***__ *para utilizar esse comando!*`);

      return interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ] });
    }

    const items = [
      {
        type: 'textDisplay',
        title: `# ${emojis.clipboard} ・ *Registros de Divisões*`,
        description: '*Esse registro reúne os dados do oficial, para que seja setado em sua respectiva divisão.*'
      },
      { type: 'separator' },
      {
        type: 'textDisplay',
        description:
          '\n\n> ### ***Como se registrar?***' +
          '\n***1º*** *Clique no botão abaixo* ***"Fazer Registro"***' +
          '\n***2º*** *Irá abrir um menu para você preencher os dados*' +
          '\n***3º*** *Você precisará informar o seu* ***Passaporte*** *da cidade*' +
          '\n***4º*** *Você precisará informar o seu* ***Nome e Sobrenome*** *da cidade*' +
          '\n***5º*** *Você precisará informar qual a sua* ***Divisão***' +
          '\n***6º*** *Você precisará informar qual a sua* ***Guarnição***' +
          '\n***7º*** *Você precisará informar o passaporte de quem te* ***recrutou***' +

          '\n\n> ### ***Informações:***' +
          '\n• *Após fazer o seu registro, você precisa aguardar até que um dos nossos* ***__Instrutores__*** *possa aprovar o seu registro!*' +

          `\n\n*__Atenciosamente ${client.user.username}__*`
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
            id: 'divisions/register/create',
            emoji: emojis.clipboard,
            label: 'Fazer Registro',
            style: ButtonStyle.Primary
          }
        ]
      }
    ];

    const container = await Container(items);

    await interaction.channel.send({
      components: [ container ], flags: MessageFlags.IsComponentsV2
    });

    const embedSuccess = new EmbedBuilder()
      .setColor('#00FF00')
      .setDescription(`${emojis.success} • *Mensagem de menu enviada com sucesso!*`);

    return interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [ embedSuccess ] });
  } catch(err) {
    return Errors(err, `Command ${__filename}`)
      .then(() => command(client, interaction, args))
      .catch((e) => interaction.reply({ content: `${emojis.error} | ` + e.error, flags: MessageFlags.Ephemeral }));
  }
};

module.exports = { 
  route: command,
  description: '💬 [Menus] 💬 | Comando para gerar a mensagem de registro das divisões.'
};