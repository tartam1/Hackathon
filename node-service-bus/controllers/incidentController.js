const incidentController = {};
const notifier = require('../bin/notifier');
const tools = require('../bin/tools');
const http = require('http');

let _unityId = 0;
const store = []; // { legacyId: 200, unityId: 2, appId: 7}

const httpOpts = {
  hostname: 'onportal.net',
  port:3000,
  path: '/incidents',
  method: 'get'
}

const removeDuplicateIncidents = tools.removeDuplicateIncidents(store);

function getHttpClientConfigById(id) {
  const opts = tools.clone(httpOpts);
  let opts2 = undefined;
  for (let i = 0; i < store.length; i++) {
    if (id == store[i].unityId) {
      opts2 = tools.clone(httpOpts);
      opts.path = `/incidents/${store[i].appId}`;
      opts2.path = `/incidents/${store[i].legacyAppId}`;
      opts.port = 4000;
      opts2.port = 3000;
      break;
    } else if (id == store[i].appId) {
      opts.path = `/incidents/${store[i].appId}`;
      opts.port = 4000;
      break;
    } else if (id == store[i].legacyId) {
      opts.path = `/incidents/${store[i].legacyId}`;
      opts.port = 3000;
      break;
    }
  }
  return opts2 ? [opts, opts2] : opts;
}

incidentController.getAll = async (req, res) => {
  const opts = tools.clone(httpOpts);
  opts.port = 3000;
  let legacyAppIncidents = JSON.parse(await tools.asyncHttp(opts));
  opts.port = 4000;
  const appIncidents = JSON.parse(await tools.asyncHttp(opts));

  // filter out duplicate incidents that result from creating through unity interface in two applications
  legacyAppIncidents = legacyAppIncidents.filter(removeDuplicateIncidents);
  // Add identifiers to incident ID so we know what env the id came from
  legacyAppIncidents.forEach(e => e.IncidentID = `${e.IncidentID}:legacy`);
  appIncidents.forEach(e => e.IncidentID = `${e.IncidentID}:app`);

  const response = [];
  response.push(...legacyAppIncidents, ...appIncidents)
  res.send(JSON.stringify(response));
}

incidentController.get = async (req, res) => {
  const id = parseInt(req.params.id);
  const _opts = getHttpClientConfigById(id);
  console.log(_opts);
  const opts = _opts.length > 1 ? _opts[0] : _opts;
  found = await tools.asyncHttp(opts);
  if (found) return res.send(found);
  res.sendStatus(404);
}

incidentController.create = async (req, res) => {
  const opts = tools.clone(httpOpts);
  opts.body = JSON.stringify(req.body);
  opts.port = 3000;
  opts.method = 'post';
  opts.headers = {
    "Content-type": "application/json",
    "Content-Length": opts.body.length
  };
  const legacyId = await tools.asyncHttp(opts);
  opts.port = 4000;
  const appId = await tools.asyncHttp(opts);
  const unityId = ++_unityId;
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