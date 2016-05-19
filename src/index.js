/**
 * ali-dot-md-slash url shortner
 * http://ali.md/git
 */

import http from 'http';
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

serverListener = (request, responce) => {
  log('req!');
}

;main();
