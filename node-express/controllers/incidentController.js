const incidentController = {};
const notifier = require('../bin/notifier');

const store = [
  {
    "Title": "Need to reboot server",
    "Description": "server is not responding",
    "IncidentID": 3,
    "Solution": "",
    "Update": [],
    "OpenTime": 1610411214817,
    "OpenedBy": "rduran",
    "UpdatedBy": "rduran",
    "UpdatedTime": "",
    "Service": "Middleware applications",
    "Contact": "jsmith",
    "Status": "assigned",
    "AssignmentGroup": "server response team",
    "Impact": "low"
  }
];

incidentController.getAll = (req, res) => {
  res.send(store);
}

incidentController.get = (req, res) => {
  const id = parseInt(req.params.id);
  const found = store.find(e => e.IncidentID == id);
  if (found) return res.send(found);
  res.sendStatus(404);
}

incidentController.create = (req, res) => {
  const incidentObject = req.body;
  incidentIds = store.map(el => el.IncidentID);
  incidentObject.IncidentID = Math.max(...incidentIds) + 1;
  incidentObject.OpenTime = Date.now();
  incidentObject.OpenedBy = 'SYSTEM';
  store.push(incidentObject);
  res.send(incidentObject.IncidentID.toString());
  notifier.emit('store-updated');
}

incidentController.update = (req, res) => {
  const id = req.params.id;
  const found = store.map(el => {
    if (el.IncidentID == id) {
      delete req.body.IncidentID;
      delete req.body.OpenTime;
      req.body.UpdatedTime = Date.now();
      req.body.UpdatedBy = 'kwilliams';
      return Object.assign(el, req.body);
    }
  });
  if (found) {
    notifier.emit('store-updated');
    return res.send();
  }
  res.sendStatus(404);
}

module.exports = incidentController