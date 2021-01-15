const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Micro Services Unified Interface' });
});

router.get('/incidents/:id', incidentController.get);
router.get('/incidents', incidentController.getAll);
router.post('/incidents', incidentController.create);
router.put('/incidents/:id', incidentController.update);

router.get('/reports/csv', incidentController.getCsv);

module.exports = router;
