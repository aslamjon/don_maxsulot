const { Router } = require("express");

const { createUser, getMe } = require("../controllers/userController");
const { isAdmin } = require("../middlewares/checkPermission");

const router = Router();

router.post('/create', isAdmin, createUser)
router.get('/', getMe)

module.exports = {
    userRouter: router
}