const { Router } = require("express");
const { createWareHouse, getWareHouses, getWareHouse, updateWareHouse, deleteWareHouse, lendDebt } = require("../controllers/warehouseController");

const router = Router();

router.get('/', getWareHouses);
router.get('/:id', getWareHouse);
router.post('/', createWareHouse);
router.put('/:id', updateWareHouse);
router.put('/lend/:id', lendDebt);
router.delete('/:id', deleteWareHouse);

module.exports = {
    wareHouseRouter: router
}