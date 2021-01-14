const http = require('http');
const tools = {};

tools.asyncHttp = options => new Promise((resolve, reject) => {
  let data = '';
  const opts = tools.clone(options);
  const body = opts.body || undefined;
  delete opts.body;
  const request = http.request(opts, res => {
    res.on('data', (chunk) => {
      data = data + chunk;
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

module.exports = tools;