const Errors = require('./Errors');

const extractName = (name) => {
  try {
    if (!name) return { name: null, id: null };

    const match =
      typeof name === 'string'
        ? name.trim().match(/^(.*?)\s*(?:[-|/([{]?\s*(\d+)\s*[\])}]?)?\s*$/)
        : null;

    if (match && match[1] && match[1].includes('・')) match[1] = match[1].split('・')[1].trim();

    return {
      passport: match && match[2] ? parseInt(match[2], 10) : null,
      name: match ? match[1].trim() : name
    };
  } catch(err) {
    return Errors(err, __filename)
      .then((r) => r)
      .catch((e) => e);
  }
};

module.exports = extractName;