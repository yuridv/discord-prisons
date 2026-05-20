const { readdirSync } = require('fs');

const files = (dir, options = {}) => {
  if (dir.endsWith('/')) dir = dir.slice(0, -1);

  if (options.list) return filesArray(dir, options);
  return filesObj(dir, options);
};

const filesArray = (dir, options = {}, path = '', result = []) => {
  for (const file of readdirSync(dir + path)) {
    if ([ 'index.js' ].includes(file)) continue;

    if (file.includes('.js')) {
      const load = require(`../../../${dir}/${path}/${file}`);

      const name = file.split('.')[0];
      let pathname, method;
      
      if ([ 'GET', 'POST', 'PUT', 'PATCH', 'DELETE' ].includes(name.toUpperCase())) {
        pathname = dir + path;
        method = name.toLowerCase();
      } else {
        if (load?.method && [ 'GET', 'POST', 'PUT', 'PATCH', 'DELETE' ].includes(load.method.toUpperCase())) {
          method = load?.method?.toLowerCase();
        }
        pathname = dir + path + '/' + name;
      }

      if (options.lower) pathname = pathname.toLowerCase();
      if (options.removeDir) pathname = pathname.replace(dir, '');
      if (options.method && !method) continue;

      result.push({
        path: pathname,
        method,
        route: load?.route || load
      });
    } else {
      filesArray(dir, options, path + '/' + file, result);
    }
  }

  return result;
};

const filesObj = (dir, options = {}, path = '', result = {}) => {
  for (const file of readdirSync(dir + path)) {
    if ([ 'index.js' ].includes(file)) continue;

    let name = file.split('.')[0];
    if (path && options.path) {
      name = path + '/' + name;
      if (name.startsWith('/')) name = name.slice(1);
    }

    if (options.lower) name = name.toLowerCase();

    if (file.includes('.js')) {
      const load = require(`../../../${dir}/${path}/${file}`);

      if ([ 'GET', 'POST', 'PUT', 'PATCH', 'DELETE' ].includes(name.toUpperCase())) {
        result[name] = load?.route;
      } else if (load?.method && [ 'GET', 'POST', 'PUT', 'PATCH', 'DELETE' ].includes(load.method.toUpperCase())) {
        result[name] = { [ load?.method ]: load?.route };
      } else {
        result[name] = load;
      }
    } else {
      if (!options.removeDir) result[name] = {};
      filesObj(dir, options, path + '/' + file, options.removeDir ? result : result[name]);
    }
  }

  return result;
};

module.exports = files;