/**
 * ali-dot-md-slash url shortner
 * http://ali.md/git
 */

import http from 'http';
import debug from 'debug';
import * as shortener from './shortener.js';
import URL from 'url';

const

log = debug('ali-dot-md-slash:server'),

config = {
  host: process.env.alimd_host || '0.0.0.0',
  port: process.env.alimd_port || '8080',
  googleApiKey: process.env.googleApiKey,
  not_found: process.env.alimd_notfound || '/404'
},

main = () => {
  log('App start');
  makeServer();
},

makeServer = () => {
  http
  .createServer(serverListener)
  .listen(config.port, config.host)
  ;
  log(`Server start on http://${config.host}:${config.port}/`);
},

serverListener = (req, res) => {
  log(`New request: ${req.url}`);
  req.url = URL.parse(req.url);

  if (!checkInternalRouters(req, res)) {
    redirect();
  }

  res.end();
},

checkInternalRouters = (req, res) => {
  let ret = true;
  switch (req.url.path) {
    case config.not_found:
      page404();
    default:
      ret = false;
  }
  return ret;
},

page404 = (req, res) => {
  res.writeHead(404, {
    'Content-Type': 'text/html'
  });
  res.write('<h1 style="text-align: \'center\'; margin-top: 2em;">Not found!</h1>');
},

redirect = (req, res) => {
  let expanded = shortener.find(req.url.pathname) || {url: config.not_found};
  res.writeHead(expanded.mode === 'permanently' ? 301 : 302, {
    Location: expanded.url
  });
}

;main();
