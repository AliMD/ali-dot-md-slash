
/**
 * slash internal url shortener
 */

import debug from 'debug';
const log = debug('ali-dot-md-slash:shortener');

import filedb from './1db.js';
const db = new filedb('urls.json');

export function cleanUrl (path) {
  path = path.toLowerCase().trim();
  if (path.indexOf('/') === 0) path = path.substr(1);
  if (path.lastIndexOf('/') === path.length-1) path = path.substr(0, path.length-1);
  if (path.trim().length === 0) path = '/';
  return path;
}

export function find (url) {
  log(`find url`);
  let curl = cleanUrl(url);
  log(`clean url ${url} => ${curl}`);
  let item = db.query(curl);
  if (typeof item === 'string') item = {url: item};
  return item || false
}

export function addurl(short, url) {
  log(`addurl ${short} => ${url}`);
  short = cleanUrl(short);
  db.insert(short, url);
}
