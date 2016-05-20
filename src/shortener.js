
/**
 * slash internal url shortener
 */

import URL from 'url';

import debug from 'debug';
const log = debug('ali-dot-md-slash:shortener');

import filedb from './1db.js';
const db = new filedb('urls.json');

export function cleanUrl (url) {
  let path = URL.parse(url).pathname.toLowerCase().trim();
  if (path.indexOf('/') === 0) path = path.substr(1);
  if (path.lastIndexOf('/') === path.length-1) path = path.substr(0, path.length-1);
  log(`${url} => ${path}`);
  return path;
}

export function find (url) {
  log(`find url`);
  url = cleanUrl(url);
  let item = db.query({short: url});
  return item || false
}

