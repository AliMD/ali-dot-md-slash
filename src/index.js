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
  not_found: process.env.alimd_notfound || '/404/',
  addurl: '/addurl'
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
  req.url = URL.parse(req.url, true);

  if (!checkInternalRouters(req, res)) {
    redirect(req, res);
  }

  res.end();
},

checkInternalRouters = (req, res) => {
  log('checkInternalRouters');
  let ret = true;
  switch (req.url.pathname) {
    case config.not_found:
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
  <p style="text-align: center; margin-top: 1.5em; font-size: 1.2em;">If you want to add this just tell me <a href="https://github.com/AliMD/ali-dot-md-slash/issues/new">here</a></p>
  </body></html>`);
},

addurl = (req, res) => {
  log('addurl');
  log(req.url.query);
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });

  if (shortener.addurl(req.url.query.short || '', req.url.query.url || '')) {
    res.write(`<!DOCTYPE html><html><body>
    <p style="text-align: center; margin-top: 1em; font-size: 1.2em;">
      Success.<br/>
      <a href="/${req.url.query.short}">ali.md/${req.url.query.short}</a> =&gt; ${req.url.query.url}
    </p>
    </body></html>`);
  } else {
    res.write(`<!DOCTYPE html><html><body>
    <form action="http://go.ali.md${config.addurl}" target="_blank">
      <input type="text" name="short" value="" />
      <input type="text" name="url" value="http://" />
      <input type="submit" value="Send" />
    </form>
    </body></html>`);
  }
},

redirect = (req, res) => {
  log('redirect');
  let expanded = shortener.find(req.url.pathname) || {url: config.not_found};
  res.writeHead(expanded.mode === 'permanently' ? 301 : 302, {
    Location: expanded.url
  });
}

;main();
