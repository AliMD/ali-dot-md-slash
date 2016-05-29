/**
 * alimd website and url shortner
 * http://ali.md/git
 */

import http from 'http';
import debug from 'debug';
import URL from 'url';
import querystring from 'querystring';


import * as urlShortener from './shortener-url.js';
import * as regexpShortener from './shortener-regexp.js';
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

  let postData = '';
  if (req.method == 'POST') {
    req.on('data', (data) => {
      postData += data;
    });
    req.on('end', () => {
      req.url.post = querystring.parse(postData);
      roating(req, res);
    });
  }

  else {
    req.url.post = {};
    roating(req, res);
  }

},

roating = (req, res) => {
  log('roating');

  switch (req.url.pathname) {
    case config.notFound:
      page404(req, res);
      break;

    case config.addurl:
      addurlPage(req, res);
      break;

    default:
      findPage(req, res)
  }

  res.end();
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

addurlPage = (req, res) => {
  log('addurlPage');

  log(req.url.query);
  log(req.url.post);

  res.writeHead(200, {
    'Content-Type': 'text/html'
  });

  if (req.url.post.pass !== config.adminPass) {
    if (req.url.post.pass && !req.url.query.msg) req.url.query.msg = 'Wrong pass.';
    res.write(`<!DOCTYPE html><html><head><style type="text/css">
    input, select {
      font-size: 1.2em;
      display: block;
      margin-top: 0.2em;
      padding: 0.2em 0.3em;
      box-sizing: border-box;
    }
    input[type="text"] {
      width: 100%;
    }
    </style></head><body>
    <form action="${config.addurl}" method="post">
      <h2>${req.url.query.msg || 'Add new url'}</h2>
      <select name="type">
        <option value="string" selected="true">String URL</option>
        <option value="regexp">ReqExp URL</option>
      </select>
      <input type="text" name="short" value="${req.url.post.short || ''}" placeholder="short" />
      <input type="text" name="url" value="${req.url.post.url || ''}" placeholder="url" />
      <input type="password" name="pass" value="" placeholder="password" />
      <input type="submit" value="Save ..." />
    </form>
    </body></html>`);
  }

  else if (addurl(req.url.post.type, req.url.post.short, req.url.post.url)) {
    let link = req.url.post.type === 'string' ?
      `<a href="/${req.url.post.short}">ali.md/${req.url.post.short}</a> =&gt; ${req.url.post.url}`
      : `${req.url.post.short} =&gt; ${req.url.post.url}`;

    res.write(`<!DOCTYPE html><html><body>
    <p style="text-align: center; margin-top: 1em; font-size: 1.2em;">
      Success.<br/>${link}<br/><a href="${config.addurl}">Add another</a>
    </p>
    </body></html>`);
  }

  else {
    redirectTo(`${config.addurl}?msg=Please+fill+all+fields+and+try+again.`, req, res);
  }
},

addurl = (type, short, url) => {
  log('addurl');
  if (!short || !url) return false;
  if (type == 'string') {
    urlShortener.addurl(short, url);
    return true;
  }
  else if (type == 'regexp') {
    regexpShortener.addurl(short, url);
    return true;
  }
  else {
    return false;
  }
},

findPage = (req, res) => {
  let expanded = urlShortener.find(req.url.pathname) || regexpShortener.find(req.url.pathname) || {url: config.notFound};
  log(`redirect to ${expanded.url}`);
  redirectTo(expanded.url, req, res, expanded.mode === 'permanently' ? 301 : 302);
},

redirectTo = (url, req, res, mode = 302) => {
  res.writeHead(mode, {
    Location: url
  });
}

;main();
