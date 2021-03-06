/**
 * slash internal url shortener by regexp
 */

import debug from 'debug';
import _ from 'lodash';
import filedb from './1db.js';
import {getEnv} from './1utill.js';

const

log = debug('alimd:shortener:regexp'),

dbPath = getEnv('AliMD_HOME') || process.env.HOME + '/ali.md.db',

db = new filedb(`${dbPath}/regexp.json`)
;

export function find (url) {
  log(`find url`);

  var item;
  _.each(db.data, (val, short) => {
    // log(val, short);
    if (typeof short === 'string' && short.length) {
      let regexp = new RegExp(short, 'i');
      if (url.match(regexp)) {
        item = {
          url: val,
          // short: short,
          shortRegexp: regexp
        };
        return false; // break each
      }
    }
  });

  log(item);

  if (item) {
    let newurl = url.replace(item.shortRegexp, item.url);
    log(newurl);
    return {url: newurl};
  }
  else {
    return false;
  }
}

export function addurl(short, url) {
  log(`addurl ${short} => ${url}`);
  if (!short.length || !url.length) return false;
  db.insert(short, url);
  return true;
}
