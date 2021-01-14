const http = require('http');
const tools = {};

tools.asyncHttp = options => new Promise((resolve, reject) => {
  let data = '';
  const opts = tools.clone(options);
  const body = opts.body || undefined;
  delete opts.body;
  const request = http.request(opts, res => {
    res.on('data', (chunk) => {
      data = data + chunk.toString();
    });
    res.on('end', () => {
      resolve(data);
    });
  });
  if (body) {
    request.end(body);
  } else {
    request.end();
  }
});

tools.clone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

tools.removeDuplicateIncidents = (store) => {
  return function(incident) {
    if (store.length === 0) return true;
    const incidentIdsCreatedThroughUnity = store.map(e => {
      if (e.unityId > 0) return e.legacyId;
    });
    return !incidentIdsCreatedThroughUnity.includes(incident.IncidentID)
  }
};

module.exports = tools;