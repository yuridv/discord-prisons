const { MessageFlags, EmbedBuilder } = require('discord.js');

const { Errors } = require('../../../utils/functions');
const emojis = require('../../../../emojis.json');
const Prison = require('../../../models/prison');

const campsBase = {
  'officers_prison': {
    'users': { type: 'array', max: 1, translate: 'Seleção do Oficial Auxiliar' },
    'id': { type: 'number', translate: 'Passaporte do Oficial Auxiliar' },
    'name': { type: 'text', translate: 'Nome do Oficial Auxiliar' }
  },
  'officers_conduction': {
    'users': { type: 'array', max: 2, translate: 'Seleção dos Oficiais da Condução' },
    'id': { type: 'number', translate: 'Passaporte do Oficial da Condução' },
    'name': { type: 'text', translate: 'Nome do Oficial da Condução' },
    'aux_id': { type: 'number', translate: 'Passaporte do Oficial Auxiliar da Condução' },
    'aux_name': { type: 'text', translate: 'Nome do Oficial Auxiliar da Condução' }
  },
  'attorney': {
    'exemption': { type: 'array', translate: 'Isenção de Fiança' },
    'id': { type: 'number', translate: 'Passaporte do Advogado' },
    'name': { type: 'text', translate: 'Nome do Advogado' }
  },
  'prisoner': {
    'id': { type: 'number', translate: 'Passaporte do Preso' },
    'name': { type: 'text', translate: 'Nome do Preso' },
    'rg_image': { type: 'files', max: 1 }
  },
  'articles': {
    'list1': { type: 'array', translate: 'Seleção dos Artigos [1]' },
    'list2': { type: 'array', translate: 'Seleção dos Artigos [2]' },
    'list3': { type: 'array', translate: 'Seleção dos Artigos [3]' },
    'list4': { type: 'array', translate: 'Seleção dos Artigos [4]' },
    'bag_image': { type: 'files', max: 1, translate: 'Foto da Mochila' }
  },
  'bail_paid': {
    'articles': { type: 'array', translate: 'Artigos Pendentes' }
  },
  'sentence': {
    'months': { type: 'number', translate: 'Tempo Total da Pena' },
    'fine': { type: 'text', translate: 'Multa Total' },
    'reduction': { type: 'array', translate: 'Reduções Aplicadas' },
    'police_report': { type: 'text', translate: 'Número do B.O.' },
    'panel_image': { type: 'files', max: 1, translate: 'Foto do Painel' }
  }
};

/** Helper: unified error embed */
function sendErrorEmbed(modal, messages) {
  if (typeof messages === 'string') messages = [ messages ];

  const embed = new EmbedBuilder()
    .setColor('#FF0000')
    .setDescription(messages.map(m => `${emojis.error} • ${m}`).join('\n'));
  return modal.reply({ content: `<@${modal.user.id}>`, embeds: [ embed ], flags: MessageFlags.Ephemeral });
}

function extractNameId(str) {
  const match =
    typeof str === 'string'
      ? str.match(/^(.*?)\s*(?:[-|/([{]?\s*(\d+)\s*[\])}]?)?\s*$/)
      : null;

  return {
    name: match ? match[1].trim() : str,
    id: match && match[2] ? parseInt(match[2], 10) : null
  };
}

/** Find a guild member whose nickname contains the numeric id */
function findMemberByIdInNickname(guild, id) {
  return guild.members.cache.find(m => new RegExp(`(?:\\D|^)${id}\\D*$`).test(m?.nickname));
}

/** Generic field validation based on configuration */
function validateField(value, cfg, errors) {
  if (cfg.required && (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0))) {
    errors.push(`O campo **${cfg.translate}** é obrigatório.`);
    return false;
  }
  if (cfg.type === 'number' && !Number.isInteger(Number(value))) {
    errors.push(`O campo **${cfg.translate}** deve ser um número inteiro.`);
    return false;
  }
  if (cfg.type === 'array' && !Array.isArray(value)) {
    errors.push(`O campo **${cfg.translate}** deve ser uma lista.`);
    return false;
  }
  if (cfg.min && Array.isArray(value) && value.length < cfg.min) {
    errors.push(`O campo **${cfg.translate}** deve conter ao menos **${cfg.min}** itens/caracteres.`);
    return false;
  }
  if (cfg.max && Array.isArray(value) && value.length > cfg.max) {
    errors.push(`O campo **${cfg.translate}** deve conter no máximo **${cfg.max}** itens/caracteres.`);
    return false;
  }
  return true;
}

const command = async(client, modal, args) => {
  try {
    const [ menu, prisonId ] = args;
    if (!menu || !prisonId) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emojis.error} • *O menu ou o id da prisão não foram informados.*`);
      return modal.reply({ content: `<@${modal.user.id}>`, embeds: [ embed ], flags: MessageFlags.Ephemeral });
    }

    const prison = await Prison.findById(prisonId);
    if (!prison) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emojis.error} • *O registro da prisão não foi encontrado.*`);
      return modal.reply({ content: `<@${modal.user.id}>`, embeds: [ embed ], flags: MessageFlags.Ephemeral });
    }

    const values = {};
    const errors = [];

    for (const id in campsBase[menu]) {
      const cfg = campsBase[menu][id];
      const component = modal.components.find(c => c?.component?.customId === id)?.component;
      if (!component) continue;

      // ----- gather raw value -----
      if (cfg.type === 'files') {
        const url = component?.attachments?.first()?.url;
        if (!url) {
          errors.push(`*O campo* ***${cfg.title}*** *não foi enviado.*`);
          continue;
        }
        if (!values[id]) values[id] = url;
      } else {
        if (!values[id]) values[id] = component?.values || component?.value;
      }

      // ----- generic validation -----
      if (!validateField(values[id], cfg, errors)) continue;

      // ----- special handling for user list -----
      if (id === 'users') {
        if (!Array.isArray(values[id])) {
          errors.push(`*O campo* ***${cfg.title}*** *deve ser uma lista.*`);
          continue;
        }

        for (let i = 0; i < values[id].length; i++) {
          const member = await modal.guild.members.fetch(values[id][i]);
          if (!member) {
            errors.push(`*O usuário selecionado* ***"${values[id][i]}"*** *não foi encontrado.*`);
            continue;
          }

          const { name, id: extractedID } = extractNameId(member.nickname);
          if (!extractedID || !name) {
            errors.push(`*O usuário selecionado* ***"${member?.nickname || member?.user?.username}"*** *não possui um passaporte e nome válidos.*`);
            continue;
          }

          if (!values.id || !values.name) {
            values.id = extractedID;
            values.name = name;
          } else {
            values.aux_id = extractedID;
            values.aux_name = name;
          }
        }
      }

      // ----- extract official name/id from nickname -----
      if (id === 'id' || id === 'aux_id') {
        const member = findMemberByIdInNickname(modal.guild, values[id]);
        if (member && member.nickname) {
          const { name } = extractNameId(member.nickname);
          if (id === 'id') values['name'] = name;
          if (id === 'aux_id') values['aux_name'] = name;
        }
      }
    }

    console.log(values);

    // ----- post‑loop validations -----
    if (errors.length) return sendErrorEmbed(modal, errors);

    const result = {};

    if (menu === 'officers_prison') {
      if (!values.id || !values.name) {
        return sendErrorEmbed(modal, '*Você precisa selecionar ou preencher o* ***passaporte*** *e o* ***nome*** *do* ***oficial auxiliar*** *da prisão.*');
      }

      const { name, id } = extractNameId(modal.member?.nickname);
      if (!name || !id) return sendErrorEmbed(modal, '*O* ***seu nome*** *não possui um* ***passaporte*** *e* ***nome*** *válidos.*');
      if (id === values.id || name === values.name) return sendErrorEmbed(modal, '*Você não pode se selecionar como* ***oficial auxiliar***.');

      result.officers_prison = [
        { name, id },
        { name: values.name, id: values.id }
      ];
    }

    if (menu === 'officers_conduction') {
      if (!values.id || !values.name) {
        return sendErrorEmbed(modal, '*Você precisa selecionar ou preencher o* ***passaporte*** *e o* ***nome*** *do* ***oficial condutor*** *da prisão.*');
      }

      if (!values.aux_id || !values.aux_name) {
        return sendErrorEmbed(modal, '*Você precisa selecionar ou preencher o* ***passaporte*** *e o* ***nome*** *do* ***oficial condutor auxiliar*** *da prisão.*');
      }

      result.officers_conduction = [
        { name: values.name, id: values.id },
        { name: values.aux_name, id: values.aux_id }
      ];
    }

    prison.set({ ...result });

    await prison.save();

    await modal.reply({ content: '✅ • *Prisão atualizada com sucesso!*', flags: MessageFlags.Ephemeral });

    return require('../../../buttons/prison/message').route(client, modal, [ prisonId ]);
  } catch (err) {
    return Errors(err, `Command ${__filename}`)
      .then(() => command(client, modal))
      .catch(e => modal.reply({ content: e.error, flags: MessageFlags.Ephemeral }));
  }
};

module.exports = { route: command };