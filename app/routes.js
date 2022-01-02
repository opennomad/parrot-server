/* These are the functions responsible for awnsering for  *
 * the various routes offered by the app                  */


const log = require('pino')();
const crypto = require('crypto');
const fs = require('fs');
const process = require('process');
log.level = process.env.LOG_LEVEL || 'info';

/* the sleep promise */
var sleep = require('sleep-promise');

/* the /health endpoint */
function health(req, res) {
  log.info('/health accessed via ' + req.method);
  return res.status(200).send('OK');
}
exports.health = health;

function root(req, res) {
  log.info('/ accessed via ' + req.method);
  // TODO: make this print a welcome page
  return res.status(200).send('Try passing a JSON payload with the sleep period defined in ms:\n{sleep: 2000}\nOther parameters may be added and will be echoed back, but are not used.');
}
exports.root = root;

/* the debug endpoint */
function echo(req, res) {
  let payload;
  if (req.method == 'POST') {
    payload = JSON.stringify(req.body);
  } else if(req.method == 'GET') {
    payload =  JSON.stringify(req.query);
  }
  // TODO: limit the size of the payload being logged
  log.info('/debug: ' + req.method + ' and payload ' + payload);
  return res.status(200).send(payload);
}
exports.echo = echo;

/* the pause endpoint */
function pause(req, res) {
  let time_to_sleep = 2;
  if (req.method == 'POST' && req.body.seconds) {
    time_to_sleep = req.body.seconds;
  } else if(req.method == 'GET' && req.query.seconds) {
    time_to_sleep = req.query.seconds;
  }
  log.info('/pause accessed via ' + req.method + ' for pause of ' + time_to_sleep + 's');

  // multiply by 1000 since sleep is expecting ms
  sleep(time_to_sleep * 1000).then(function() {
    log.info('/pause complete after ' + time_to_sleep + 's');
    return res.status(200).send('Pause complete after ' + time_to_sleep + ' seconds');
  });
}
exports.pause = pause;

/* the headers endpoint */
function headers(req, res) {
  log.info('/headers accessed via ' + req.method);
  return res.status(200).send(req.headers);
}
exports.headers = headers;

// the upload endpoint
function upload(req, res) {
  let file = req.file;

  const fileBuffer = fs.readFileSync(file.destination + file.filename);

  const md5sum = crypto.createHash('md5');
  md5sum.update(fileBuffer);
  const sha1sum = crypto.createHash('sha1');
  sha1sum.update(fileBuffer);
  const sha256sum = crypto.createHash('sha256');
  sha256sum.update(fileBuffer);

  const md5hex = md5sum.digest('hex');
  const sha1hex = sha1sum.digest('hex');
  const sha256hex = sha256sum.digest('hex');

  console.log(md5hex);
  console.log(sha1hex);
  console.log(sha256hex);
  log.info('/upload accessed via ' + req.method);
  return res.send(req.file);
}
exports.upload = upload;
