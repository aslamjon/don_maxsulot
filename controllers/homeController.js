const { isEmpty } = require("lodash");
const path = require("path");
const { CardOfHomeModel } = require("../models/cardOfHomeModel");
const { saveImgs, errorHandle, unlink } = require('./../utiles');

async function createHomeCard(req, res) {
    const { title, description, price, showToAgent } = req.body;
    if (!title && !description && !price) res.status(400).send(`Bad request: please send title, description and price`);
    else {
        try {
            const result = await saveImgs(req, res, ['img']);
            if (isEmpty(result)) {
                // console.log(isEmpty(result), result)
            } else {
                const newCard = CardOfHomeModel({
                    img: `/api/files/${result.img}`,
                    title,
                    description,
                    price,
                    showToAgent
                })
                await newCard.save();
                res.send({ message: "Card has been saved", uz: "Card muvofiqlik saqlandi" });
            }
        } catch (e) {
            errorHandle(res, e.message);
        }
    }
}

async function getCards(req, res) {
    try {
        let { skip, limit } = req.query;
        skip = Number(skip);
        limit = Number(limit);
        let result = {}
        if (skip <= limit) {
            result.cards = await CardOfHomeModel.find().skip(skip).limit(limit);
            result.count = await CardOfHomeModel.find().count();
            res.send(result);
        } else {
            const cards = await CardOfHomeModel.find();
            res.send(cards);
        }
    } catch (e) {
        errorHandle(res, e.message);
    }
}

async function getCard(req, res) {
    try {
        const { id } = req.params;
        const card = await CardOfHomeModel.findById(id);
        res.send(card);
    } catch (e) {
        errorHandle(res, e.message);
    }
}

async function updateCard(req, res) {
    try {
        const { id } = req.params;
        const { title, description, price, showToAgent } = req.body;
        const card = await CardOfHomeModel.findById(id);
        if (isEmpty(card)) res.statsu(404).send({ message: "card not found", uz: "Card topilmadi" });
        else {
            const updateCard = await CardOfHomeModel.findByIdAndUpdate(id, {
                title: title || card.title,
                description: description || card.description,
                price: price || card.price,
                showToAgent: showToAgent || card.showToAgent
            });
            res.send({ message: "card has been updated", uz: "Card muvofiqlik yanqilandi" });
        }
    } catch (e) {
        errorHandle(res, e.message);
    }
}

async function deleteCard(req, res) {
    try {
        const { id } = req.params;
        let card = await CardOfHomeModel.findByIdAndDelete(id);
        if (!card) res.status(404).send({ message: "a card not found", uz: "Card topilmadi" });
        else {
            let filePath = path.join(__dirname, `./../data/images/${card.img.replace('/api/files/', '')}`);
            let file = await unlink(filePath);
            res.send({ message: "a card has been deleted", uz: "Card o'chirildi" });
        }
    } catch (e) {
        errorHandle(res, e.message);
    }
}

module.exports = {
    createHomeCard,
    getCards,
    getCard,
    updateCard,
    deleteCard
}