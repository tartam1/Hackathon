const incidentController = {};
const notifier = require('../bin/notifier');
const tools = require('../bin/tools');
const http = require('http');

let _unityId = 0;
const store = []; // { legacyId: 200, unityId: 2, appId: 7}

const httpOpts = {
  hostname: '50.62.30.167',
  port:3000,
  path: '/incidents',
  method: 'get'
}

const removeDuplicateIncidents = tools.removeDuplicateIncidents(store);
const getUpdateConfig = tools.getUpdateConfig(store);

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
  const id = req.params.id;
  const opts = tools.clone(httpOpts);
  if (id.includes('legacy')) {
    opts.port = 3000;
    opts.path = `/incidents/${id.replace(':legacy','')}`;
  } else {
    opts.port = 4000;
    opts.path = `/incidents/${id.replace(':app','')}`;
  }
  found = await tools.asyncHttp(opts);
  if (found) {
    found.IncidentID = id.includes('legacy') ? `${found.IncidentID}:legacy` : `${found.IncidentID}:app`;
    return res.send(found);
  }
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
  const cfg = getUpdateConfig(id, req.body);
  for (let i = 0; i < cfg.length; i++) {
    await tools.asyncHttp(cfg[i]);
  }
  notifier.emit('store-updated');
  return res.send();
}

incidentController.getCsv = async (req, res) => {
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
  const data = [];
  const headers = Object.keys(response[0]).join('","');
  data.push(`"${headers}"`);
  response.forEach(e => {
    let row = Object.values(e).join('","');
    data.push(`"${row}"`);
  });
  const resultset = data.join('\r\n');
  res.send(resultset);
}

module.exports = incidentController;