const { Router } = require("express");
const { createWareHouse, getAllWareHouses, getAllWareHousesByIds, updateWareHouse, deleteWareHouse } = require("../controllers/warehouseController");

const router = Router();

router.get('/', getAllWareHouses);
router.post('/branch', getAllWareHousesByIds);
router.post('/', createWareHouse);
router.put('/', updateWareHouse);
router.delete('/:id', deleteWareHouse);

module.exports = {
    wareHouseRouter: router
}