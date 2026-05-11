const Errors = require('./Errors');
const extractName = require('./extractName');

const Validate = (values = {}, moldes = {}, errors = []) => new Promise(async(res, rej) => {
  try {
    for (const key in moldes) {
      const molde = moldes[key];

      if (molde.type) molde.type = molde.type.toLowerCase();
      if (!values[key] && molde.default) values[key] = molde.default;
      if (!values[key] && molde.required) errors.push(`O campo '${key}' não foi preenchido...`);

      if (values[key] || values[key] === 0) {
        if (typeof values[key] === 'string') values[key] = values[key].trim();

        if (molde.type && Types[molde.type]) {
          await Types[molde.type](key, values, molde.guild)
            .catch((e) => errors.push(e));
        }

        if (molde.replace) {
          await functions.replace(key, values, molde.replace);
        }
        if (molde.equal) {
          await functions.equal(key, values[key], molde.equal, key)
            .catch((e) => errors.push(e));
        }
        if (molde.min || molde.max) {
          await functions.length(key, values[key], molde.min, molde.max)
            .catch((e) => errors.push(e));
        }
      }
    }

    for (const key in values) if (!moldes[key]) delete values[key];

    if (errors) return rej({ errors });

    return res(values);
  } catch(err) {
    return Errors(err, __filename)
      .then(() => 
        Validate(values, moldes)
          .then((r) => res(r))
          .catch((e) => rej(e))
      )
      .catch((e) => e);
  }
});

const functions = {
  replace: async(key, values, list) => {
    for (const item of list) {
      if (item.includes('/')) {
        const [ from, to ] = item.split('/');
        values[key] = values[key].replace(from, to);
      } else values[key] = values[key].replace(item, '');
    }
  },

  equal: async(key, value, list) => new Promise(async(res,rej) => {
    if (!list.includes(value)) return rej(`O campo '${key}' precisa ser igual a um desses: '${list.join(', ')}'`);
    return res();
  }),

  length: async(key, value, min, max) => new Promise(async(res,rej) => {
    if (min && (typeof value === 'number' ? value : value.length) < min) return rej(`O campo '${key}' precisa conter no mínimo '${min}' caracteres.`);
    if (max && (typeof value === 'number' ? value : value.length) > max) return rej(`O campo '${key}' precisa conter no máximo '${max}' caracteres.`);
    return res();
  })
};

const Types = {
  passport: async(key, values, guild) => new Promise(async(res,rej) => {
    if (!guild) return rej('Não foi passado o objeto do servidor. Reporte ao meu desenvolvedor!');

    values[key] = String(values[key]).replace(',', '.').replace(/[^\d.]/g, '');
    if (!Number(values[key]) || isNaN(Number(values[key]))) return rej(`O campo '${key}' precisa conter apenas números.`);

    const user = guild.members.cache.find(m => new RegExp(`(?:\\D|^)${values[key]}\\D*$`).test(m?.nickname));
    if (!user) return rej(`Não encontrei nenhum usuário com o passaporte '${values[key]}' no servidor.`);

    const { passport, name } = extractName(user.nickname);
    if (!passport || !name) return rej(`O usuário '${user.nickname}[${values[key]}]' não possui um passaporte/nome valido.`); 

    values[key] = {
      passport,
      name,
      member: user
    };

    return res();
  }),

  id: async(key, values, guild) => new Promise(async(res,rej) => {
    if (!guild) return rej('Não foi passado o objeto do servidor. Reporte ao meu desenvolvedor!');

    const user = await guild.members.fetch(values[key]);
    if (!user) return rej(`Não encontrei nenhum usuário com o id '${values[key]}' no servidor.`);

    const { passport, name } = extractName(user.nickname);
    if (!passport || !name) return rej(`O usuário '${user.nickname}[${values[key]}]' não possui um passaporte/nome valido.`); 

    values[key] = {
      passport,
      name,
      member: user
    };

    values[key] = String(values[key]).replace(/\D/g, '');
    if (values[key].length > 3) return rej(`O campo '${key}' não é um passaporte valido.`);
    return res();
  }),

  string: async(key, values) => new Promise(async(res,rej) => {
    values[key] = String(values[key]);
    if (values[key] === '[object Object]') return rej(`O campo '${key}' precisa ser um texto.`);
    return res();
  }),

  number: async(key, values) => new Promise(async(res,rej) => {
    values[key] = String(values[key]).replace(',', '.').replace(/[^\d.]/g, '');
    if (!Number(values[key]) || isNaN(Number(values[key]))) return rej(`O campo '${key}' precisa conter apenas números.`);
    return res();
  }),

  array: async(key, values) => new Promise(async(res,rej) => {
    if (typeof values[key] === 'string') values[key] = values[key].split(/[,;|+\-_]/);
    if (!Array.isArray(values[key]) || !values[key].length) return rej(`O campo '${key}' precisa ser uma lista.`);
    return res();
  }),

  cpf: async(key, values) => new Promise(async(res,rej) => {
    values[key] = values[key].replace(/\D/g, '').padStart(11, '0');
    if (values[key].length !== 11) return rej(`O campo '${key}' não é um cpf valido.`);
    // values[key] = values[key].replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    return res();
  }),

  phone: async(key, values) => new Promise(async(res,rej) => {
    values[key] = values[key].replace(/\D/g, '');
    if (values[key].length !== 11) return rej(`O campo '${key}' não é um telefone valido.`);
    // values[key] = values[key].replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
    return res();
  }),

  cep: async(key, values) => new Promise(async(res,rej) => {
    values[key] = values[key].replace(/\D/g, '');
    if (values[key].length !== 8) return rej(`O campo '${key}' não é um CEP valido.`);
    // values[key] = values[key].replace(/(\d{5})(\d{3})/, '$1-$2');
    return res();
  }),

  email: async(key, values) => new Promise(async(res,rej) => {
    values[key] = values[key].toLowerCase().trim();
    if (!values[key].includes('@') || !values[key].includes('.')) return rej(`O campo '${key}' não é um e-mail valido.`);
    return res();
  }),

  date: async(key, values) => new Promise((res, rej) => {
    let value = values[key];

    if (typeof value === 'string') {
      if (value.length === 10) {
        value = new Date(value);
        if (isNaN(value.getTime())) return rej(`O campo '${key}' não é uma data valida.`);
        value.setHours(value.getHours() + 3);
      } else if (value.includes('T')) {
        value = new Date(value);
        if (isNaN(value.getTime())) return rej(`O campo '${key}' não é uma data valida.`);
      } else {
        value = value.replace(/[^\d]/g, '').padEnd(14, '0');
        const date = value.slice(4, 8) + '-' + value.slice(2, 4) + '-' + value.slice(0, 2);
        const time = value.slice(8, 10) + ':' + value.slice(10, 12) + ':' + value.slice(12, 14);
        value = new Date(date + 'T' + time);
        if (isNaN(value.getTime())) return rej(`O campo '${key}' não é uma data valida.`);
      }
    }

    if (value instanceof Date && !isNaN(value.getTime())) {
      value.setHours(value.getHours() - 3);
      values[key] = value.toISOString();
      return res();
    } else if (values[key] instanceof Date && !isNaN(values[key].getTime())) {
      values[key].setHours(values[key].getHours() - 3);
      values[key] = values[key].toISOString();
      return res();
    }

    return rej(`O campo '${key}' não é uma data valida.`);
  }),

  pix: async(key, values) => new Promise(async(res,rej) => {
    values[key] = values[key].includes('@') ? values[key].toLowerCase() : values[key].replace(/\D/g, '');
    if (!values[key]) return rej(`O campo '${key}' não é um PIX valido.`);
    return res();
  })
};

module.exports = Validate;