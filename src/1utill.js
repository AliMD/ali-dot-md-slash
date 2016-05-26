import debug from 'debug';
const log = debug('1utill');

import xpath from 'path';
import fs from 'fs';

const _0777 = parseInt('0777', 8);

export function getEnv (name) {
  log(`getEnv: ${name}`);
  if (!name) {
    log('getEnv: env name is empty !');
    return '';
  }

  let env = process.env[name];
  if (typeof env === 'string') {
    env = env.replace(/\$([^/$]+)/g, (_, n) => {
      return process.env[n] || ('$'+n);
    });
  }
  return env;
}

export function mkdirSync (path, mode = _0777) {
  log(`mkdirSync: ${path}`);
  path = xpath.resolve(path);
  try {
    return fs.mkdirSync(path, mode);
  }
  catch (err) {
    if (err.code === 'ENOENT') {
      mkdirSync(xpath.dirname(path), mode);
      return mkdirSync(path, mode);
    }

    if (!fs.statSync(path).isDirectory()) throw err;
    return true;
  }
}
