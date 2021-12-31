const { Router } = require("express");
const path = require("path");
const multer = require("multer");

const { createHomeCard, getCards, getCard, updateCard, deleteCard } = require("../controllers/homeController");
const { route } = require("express/lib/application");

const router = Router();

// you might also want to set some limits: https://github.com/expressjs/multer#limits
const upload = multer({
    dest: path.join(__dirname, `./../data/cache`)
});
/* name attribute of <file> element in your form */
const nameOfFileFromFrontend = upload.any();

router.get('/', getCards);
router.get('/:id', getCard);
router.post('/', nameOfFileFromFrontend, createHomeCard);
router.put('/:id', updateCard);
router.delete('/:id', deleteCard);

module.exports = {
    cardOfHomeRouter: router
}

