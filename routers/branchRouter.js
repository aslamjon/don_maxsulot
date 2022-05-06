const { Router } = require('express');
const {createBranch, getAllBranches, updateBranch, deleteBranch, getBranch} = require("../controllers/branchController");

const router = Router();

router.post('/v1/branch', createBranch);
router.get('/v1/branch', getAllBranches);
router.get('/v1/branch/:id', getBranch);
router.put('/v1/branch/:id', updateBranch);
router.delete('/v1/branch/:id', deleteBranch);

module.exports = {
    branchRouter: router
}