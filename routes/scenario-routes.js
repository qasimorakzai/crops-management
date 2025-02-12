const express = require('express');
const { createScenario, getScenarios, getScenarioById, updateScenario, deleteScenario } = require('../controllers/scenario-controller');
const authMiddleware = require('../middlewares/auth-middleware');
const router = express.Router();

router.post('/',authMiddleware, createScenario);       
router.get('/',authMiddleware, getScenarios);               
router.put('/:id',authMiddleware, updateScenario);     
router.delete('/:id',authMiddleware, deleteScenario);   

module.exports = router;
