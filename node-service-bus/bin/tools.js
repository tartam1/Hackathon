const http = require('http');
const { Http2ServerRequest } = require('http2');
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
      if (e.unityId > 0) return parseInt(e.legacyId);
    });
    return !incidentIdsCreatedThroughUnity.includes(incident.IncidentID)
  }
};

tools.getUpdateConfig = (store) => {
  // returns one or two httpOpts depending on which envs need to be updated
  const httpOpts = {
    hostname: '50.62.30.167',
    method: 'put',
    headers: {
      "Content-type": "application/json"
    }
  }

  return function(id, body) {
    const opts = [];
    httpOpts.headers["Content-Length"] = JSON.stringify(body).length; // Might have to convert object to string here
    httpOpts.body = JSON.stringify(body);
    const storeCopy = tools.clone(store);

    const incidentCreatedThroughUnity = storeCopy.filter(e => {
      if (id.includes(':legacy')) {
        return e.legacyId === id.replace(':legacy','');
      } else if (id.includes(':app')) {
        return e.appId === id.replace(':app','');
      }
    });

    if (incidentCreatedThroughUnity.length > 0) {
      const opts1 = tools.clone(httpOpts);
      opts1.port = 3000;
      opts1.path = `/incidents/${incidentCreatedThroughUnity[0].legacyId}`;

      const opts2 = tools.clone(httpOpts);
      opts2.port = 4000;
      opts2.path = `/incidents/${incidentCreatedThroughUnity[0].appId}`;

      opts.push(opts1, opts2);
    } else {
      id.includes(':legacy') ? httpOpts.port = 3000 : httpOpts.port = 4000;
      httpOpts.path = `/incidents/${id.replace(':legacy','').replace(':app','')}`;
      opts.push(httpOpts);
    }
    return opts;
  }
};

module.exports = tools;