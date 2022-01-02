const { Router } = require("express");
const {
    lendDebtWareHouse,
    lendDebtTradingPoint,
    getLendDebt
} = require('./../controllers/lendDebtController');
const router = Router();

router.post('/', getLendDebt);
router.post('/warehouse', lendDebtWareHouse);
router.post('/tradingpoint', lendDebtTradingPoint);

module.exports = {
    lendDebtRouter: router
}