const http = require('http');
const tools = {};

tools.asyncHttp = options => new Promise((resolve, reject) => {
  let data = '';
  const request = http.request(options, res => {
    res.on('data', (chunk) => {
      data = data + chunk;
    });
    res.on('end', () => {
      resolve(data);
    });
  });
  request.end();
});

tools.clone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

module.exports = tools;