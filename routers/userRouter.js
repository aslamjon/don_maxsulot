const { Router } = require("express");

const { createUser, getMe, isThere } = require("../controllers/userController");
const { isAdmin } = require("../middlewares/checkPermission");
const { checkUser } = require("../middlewares/authMiddleware")
const router = Router();

router.post('/create', isAdmin, createUser);
router.get('/', checkUser, getMe);
router.post('/isthere', isThere);

module.exports = {
    userRouter: router
}