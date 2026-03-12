const { Errors } = require('../../utils/functions');
const { articles } = require('../../utils/bases');

const config = require('../../../config.json');
const Prison = require('../../models/prison');

const event = async(client, message) => {
  try {
    if (message.channel.id !== config.channels.logs) return;
    if (!message.embeds || !message.embeds[0] || !message.embeds[0].fields) return;

    const embed = message.embeds[0];

    const officials = [ ...embed.fields[0].value.matchAll(/\[(\d+)]\s*([^`\n]+)/g) ]
      .map(([ , id, name ]) => ({ id: +id, name: name.trim() }));

    const prisoner = [ ...embed.fields[1].value.matchAll(/\[(\d+)]\s*([^`\n]+)/g) ]
      .map(([ , id, name ]) => ({ id: +id, name: name.trim() }))[0];

    const articles_selected = [ ...embed.fields[2].value.matchAll(/Artigo\s+(\d+)\s*-\s*(.+?)(?=,\s*Artigo|$)/g) ]
      .map(([ , code, name ]) => (
        articles.find((i) => i.article === Number(code.trim())) || 
        { article: code.trim(), name: name.trim() }
      ));

    const months = parseInt(embed.fields[3].value);

    const fine = parseInt(embed.fields[4].value.replace(/\D/g, ''));

    const prison = new Prison({
      status: 'pending',
      officers_prison: officials.filter((_, i) => i < 2),
      prisoner: {
        id: prisoner.id,
        name: prisoner.name
      },
      articles: articles_selected,
      months: months,
      fine: fine,
      evidences: [
        {
          type: 'rg',
          url: embed.image.url
        }
      ]
    });

    await prison.save();
    
  } catch(err) {
    return Errors(err, `Event ${__filename}`)
      .then(() => event(client, message))
      .catch((e) => e);
  }
};

module.exports = event;