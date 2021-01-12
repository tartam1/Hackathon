const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Legacy ITSM' });
});

router.get('/incidents/:id', incidentController.get);
router.get('/incidents', incidentController.getAll);
router.post('/incidents', incidentController.create);
router.put('/incidents/:id', incidentController.update);

module.exports = router;
