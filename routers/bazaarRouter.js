const { Router } = require("express");
const { createBazaar, getBazaars, getBazaar, updateBazaar, deleteBazaar } = require("../controllers/bazaarController");

const router = Router();

router.post('/', createBazaar);
router.get('/', getBazaars);
router.get('/:id', getBazaar);
router.put('/:id', updateBazaar);
router.delete('/:id', deleteBazaar);

module.exports = {
    bazaarRouter: router
}