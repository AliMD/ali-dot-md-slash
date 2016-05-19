/**
 * ali-dot-md-slash url shortner
 * http://ali.md/git
 */

import http from 'http';
import URL from 'url';
import debug from 'debug';

const

log = debug('ali-dot-md-slash:index'),

config = {
  host: process.env.host || '0.0.0.0',
  port: process.env.port || '8080',
  googleApiKey: process.env.googleApiKey
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
  let path = parseUrl(req.url);
  res.end(JSON.stringify({url: req.url, path: path}, null, 2));
},

parseUrl = (url) => {
  let path = URL.parse(url).pathname.toLowerCase().trim();
  if (path.indexOf('/') === 0) path = path.substr(1);
  if (path.lastIndexOf('/') === path.length-1) path = path.substr(0, path.length-1);
  return path;
}

;main();
