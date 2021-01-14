const incidentController = {};
const notifier = require('../bin/notifier');
const tools = require('../bin/tools');
const http = require('http');
const { openStdin } = require('process');

let _unityId = 0;
const ids = []; // contains ids of incidents created in app through unity interface 
const store = []; // { legacyId: 200, unityId: 2, appId: 7}

const httpOpts = {
  hostname: 'onportal.net',
  port:3000,
  path: '/incidents',
  method: 'get'
}

function getHttpClientConfigById(id) {
  const opts = tools.clone(httpOpts);
  let opts2 = undefined;
  for (let i = 0; i < store.length; i++) {
    if (id == e.unityId) {
      opts2 = tools.clone(httpOpts);
      opts.path = `/incidents/${e.appId}`;
      opts2.path = `/incidents/${e.legacyAppId}`;
      opts.port = 4000;
      opts2.port = 3000;
      break;
    } else if (id == e.appId) {
      opts.path = `/incidents/${e.appId}`;
      opts.port = 4000;
      break;
    } else if (id == e.legacyId) {
      opts.path = `/incidents/${e.legacyId}`;
      opts.port = 3000;
      break;
    }
  }
  return opts2 ? [opts, opts2] : opts;
}

incidentController.getAll = async (req, res) => {
  const opts = tools.clone(httpOpts);
  opts.port = 3000;
  const legacyAppIncidents = JSON.parse(await tools.asyncHttp(opts));
  opts.port = 4000;
  const AppRequest = JSON.parse(await tools.asyncHttp(opts));

  const response = [];
  // filter out incidents created through unity interface
  appIncidents = AppRequest.filter(el => !ids.includes(el.IncidentID));
  response.push(...legacyAppIncidents, ...appIncidents)
  res.send(JSON.stringify(response));
}

incidentController.get = async (req, res) => {
  const id = parseInt(req.params.id);
  const _opts = getHttpClientConfigById(id);
  const opts = _opts.length > 1 ? _opts[0] : _opts;
  found = await tools.asyncHttp(opts);
  if (found) return res.send(found);
  res.sendStatus(404);
}

incidentController.create = async (req, res) => {
  const incidentObject = req.body;
  const opts = tools.clone(httpOpts);
  opts.port = 3000;
  opts.method = 'post';
  const legacyId = await tools.asyncHttp(opts);
  opts.port = 4000;
  const appId = await tools.asyncHttp(opts);
  const unityId = _unityId + 1;
  const obj = { legacyId, unityId, appId }
  store.push(obj);
  res.send(unityId.toString());
  notifier.emit('store-updated');
}

incidentController.update = async (req, res) => {
  const id = req.params.id;
  const _opts = getHttpClientConfigById(id);
  if (_opts.length > 1) { // Need to update legacy and new app
    const opts1 = _opts[0];
    const opts2 = _opts[1];
    opts1.method = 'put';
    opts2.method = 'put';
    await tools.asyncHttp(opts1);
    await tools.asyncHttp(opts2);
    notifier.emit('store-updated');
    return res.send();
  } else {
    _opts.method = 'put';
    await tools.asyncHttp(_opts);
    notifier.emit('store-updated');
    return res.send();
  }
}

module.exports = incidentController