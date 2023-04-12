/* These are the functions responsible for awnsering for  *
 * the various routes offered by the app                  */


const log = require('pino')();
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const process = require('process');
log.level = process.env.LOG_LEVEL || 'info';

/* the sleep promise */
var sleep = require('sleep-promise');

/* the /health endpoint */
function health(req, res) {
  log.info('/health (' + req.method + ')');
  return res.status(200).send('OK');
}
exports.health = health;

function root(req, res) {
  log.info('/ (' + req.method + ')');
  // TODO: make this print a welcome page
  return res.status(200).send('Welcome to the Parrot Server');
}
exports.root = root;

/* the echo endpoint */
function echo(req, res) {
  let payload;
  let status=200;
  if (req.method == 'POST') {
    payload = JSON.stringify(req.body);
    console.log('MJLERT POST');
  } else if(req.method == 'GET') {
    payload =  JSON.stringify(req.query);
    console.log('MJLERT GET');
  } else {
    console.log('MJLERT DELETE');
    payload = '{"parrot":"not implemented"}';
    status  = 501;
  }
  // TODO: limit the size of the payload being logged
  log.info('/echo (' + req.method + ') and payload ' + payload);
  return res.status(status).send(payload);
}
exports.echo = echo;

/* the pause endpoint */
function pause(req, res) {
  let time_to_sleep = 2;
  let status = 200;
  let payload;
  if (req.method == 'POST' && req.body.seconds) {
    time_to_sleep = req.body.seconds;
  } else if(req.method == 'GET' && req.query.seconds) {
    time_to_sleep = req.query.seconds;
  }
  log.info('/pause (' + req.method + ') for pause of ' + time_to_sleep + 's');

  // multiply by 1000 since sleep is expecting ms
  sleep(time_to_sleep * 1000).then(function() {
    payload = 'Pause complete after ' + time_to_sleep + ' seconds';
    log.info('/pause (' + req.method + ') complete after ' + time_to_sleep + 's');
    return res.status(status).send(payload);
  });
}
exports.pause = pause;

/* the headers endpoint */
function headers(req, res) {
  log.info('/headers (' + req.method + ')');
  return res.status(200).send(JSON.stringify(req.headers, null, 2));
}
exports.headers = headers;

// the upload endpoint
function upload(req, res) {
  let storage_dir = 'uploads/';

  // files live in the `uploads` folder so we need to rebuild the full
  // filename with absolute path
  let base_filename = path.basename(req.url);
  let absolute_filename = path.resolve(storage_dir + base_filename);

  log.info(req);
  // PUT and POST
  if (req.method == 'POST' || req.method == 'PUT' ) {
    let file;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    try {
      // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
      file = req.files.file;
      uploadPath = path.resolve(storage_dir + file.name);

      // Use the mv() method to place the file somewhere on your server
      file.mv(uploadPath).then(function() {
        const fileBuffer = fs.readFileSync(uploadPath);
        const md5sum = crypto.createHash('md5');
        md5sum.update(fileBuffer);
        const sha1sum = crypto.createHash('sha1');
        sha1sum.update(fileBuffer);
        const sha256sum = crypto.createHash('sha256');
        sha256sum.update(fileBuffer);

        const md5hex = md5sum.digest('hex');
        const sha1hex = sha1sum.digest('hex');
        const sha256hex = sha256sum.digest('hex');

        const checksums = {
          'file': '/' + storage_dir + file.name,
          'md5': md5hex,
          'sha1': sha1hex,
          'sha256': sha256hex
        };
        log.debug(md5hex);
        log.debug(sha1hex);
        log.debug(sha256hex);
        log.info('/upload (' + req.method + ') uploaded ' + file.name);
        return res.send(JSON.stringify(Object.assign({}, checksums), null, 2));
      });
    } catch {
      return res.status(500).send('500 upload failure');
    }

  // GET
  } else if(req.method == 'GET' || req.method == 'HEAD') {
    log.debug('/upload is using ' + absolute_filename);
    // directory listing
    if (base_filename == 'upload') {
      let dir = fs.readdirSync('./uploads');
      log.info('/upload (' + req.method + ') directory listing');
      return res.send(JSON.stringify(dir, null, 2));
    } else {
      try {
        fs.statSync(absolute_filename);
        log.info('/upload (' + req.method + ') served: ' + base_filename);
        return res.sendFile(absolute_filename);
      } catch(err) {
        log.debug(err);
        log.info('/upload (' + req.method + ') missing file: ' + base_filename);
        return res.status(404).send(base_filename + ' not found');
      }
    }
  
  // DELETE
  } else if(req.method == 'DELETE') {
    log.info('/upload is using ' + absolute_filename);
    // files live in the `uploads` folder so we need to rebuild the full
    // filename with absolute path
    try {
      fs.unlinkSync(absolute_filename);
      log.info('/upload (' + req.method + ') removed: ' + base_filename);
      return res.send(base_filename + ' has been deleted');
    } catch(err) {
      log.debug(err);
      log.info('/upload (' + req.method + ') unable to delete: ' + base_filename);
      return res.status(404).send(base_filename + ' could not be found for deletion');
    }
  } else {

    // All other methods/verbs
    return res.status(501).send('501 not implemented');
  }
}
exports.upload = upload;
