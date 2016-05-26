/**
 * alimd website and url shortner
 * http://ali.md/git
 */

import http from 'http';
import debug from 'debug';
import URL from 'url';

import * as shortener from './shortener.js';
import {getEnv} from './1utill.js'

const

log = debug('alimd:server'),

config = {
  host: getEnv('AliMD_HOST') || '0.0.0.0',
  port: getEnv('AliMD_PORT') || '8080',
  notFound: getEnv('AliMD_NOTFOUND') || '/404/',
  addurl: getEnv('AliMD_ADDURL') || '/addurl',
  adminPass: getEnv('AliMD_ADMIN_PASS') || 'pass',
  userNewRequestUrl: getEnv('AliMD_USER_NEW_REQUEST_URL') || 'https://github.com/AliMD/alimd/issues/new'
},

main = () => {
  log('App start');
  log(config);
  makeServer();
},

makeServer = () => {
  http
  .createServer(serverListener)
  .listen(config.port, config.host)
  ;
  console.log(`Server start on http://${config.host}:${config.port}/`);
},

serverListener = (req, res) => {
  log(`New request: ${req.url}`);
  req.url = URL.parse(req.url, true);

  log(req.url);

  if (!checkInternalRouters(req, res)) {
    redirect(req, res);
  }

  res.end();
},

checkInternalRouters = (req, res) => {
  log('checkInternalRouters');
  let ret = true;
  switch (req.url.pathname) {
    case config.notFound:
      page404(req, res);
      break;

    case config.addurl:
      addurl(req, res);
      break;

    default:
      ret = false;
  }
  return ret;
},

page404 = (req, res) => {
  log('page404');
  res.writeHead(404, {
    'Content-Type': 'text/html'
  });
  res.write(`<!DOCTYPE html><html><body>
  <h1 style="text-align: center; margin-top: 1em; font-size: 7em;">404</h1>
  <p style="text-align: center; margin-top: 1.5em; font-size: 1.2em;">If you want to add this just tell me <a href="${config.userNewRequestUrl}">here</a></p>
  </body></html>`);
},

addurl = (req, res) => {
  log('addurl');
  log(req.url.query);
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });

  if(req.url.query.pass !== config.adminPass) {
    res.write(`<!DOCTYPE html><html><body>
    <form action="${config.addurl}" target="_blank" method="post">
      <input type="text" name="short" value="${req.url.query.short}" placeholder="short" />
      <input type="text" name="url" value="${req.url.query.url}" placeholder="url" />
      <input type="password" name="pass" value="" placeholder="password" />
      <input type="submit" value="Send" />
    </form>
    </body></html>`);
  }

  else if (shortener.addurl(req.url.query.short || '', req.url.query.url || '')) {
    res.write(`<!DOCTYPE html><html><body>
    <p style="text-align: center; margin-top: 1em; font-size: 1.2em;">
      Success.<br/>
      <a href="/${req.url.query.short}">ali.md/${req.url.query.short}</a> =&gt; ${req.url.query.url}
    </p>
    </body></html>`);
  }

  else {
    redirectTo(config.addurl);
  }
},

redirect = (req, res) => {
  let expanded = shortener.find(req.url.pathname) || {url: config.notFound};
  log(`redirect to ${expanded.url}`);
  redirectTo(expanded.url, req, res, expanded.mode === 'permanently' ? 301 : 302);
},

redirectTo = (url, req, res, mode = 302) => {
  res.writeHead(mode, {
    Location: url
  });
}

;main();
