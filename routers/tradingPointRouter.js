const { Router } = require("express");
const {
    createTradingPoint,
    getTradingPoints,
    getTradingPoint,
    updateTradingPoint,
    deleteTradingPoint
} = require('./../controllers/tradingPointController');
const router = Router();

router.get('/', getTradingPoints);
router.get('/:id', getTradingPoint);
router.post('/', createTradingPoint);
router.put('/:id', updateTradingPoint);
router.delete('/:id', deleteTradingPoint);

module.exports = {
    tradingPointRouter: router
}