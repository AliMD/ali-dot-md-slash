/**
 * ali-dot-md-slash url shortner
 * http://ali.md/git
 */

import http from 'http';
import debug from 'debug';
import * as shortener from './shortener.js';

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

  if (req.url === config.not_found) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not Found !');
    return;
  }

  let expanded = shortener.find(req.url) || {url: config.not_found};
  res.writeHead(expanded.mode === 'permanently' ? 301 : 302, {
    Location: expanded.url
  });
  res.end();
}

;main();
