const { UserModel } = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { isEmpty } = require("lodash");

async function createUser(req, res) {
    const { username, password, role } = req.body;

    const usernameExists = await UserModel.findOne({ username });
    if (usernameExists) {
        res.status(400).send({
            message: "Username is already exists",
        });
    } else {
        const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));
        const newUser = new UserModel({
            username,
            role,
            password: hashedPassword
        })
        try {
            await newUser.save();
            res.status(200).send({
                message: 'User has been created'
            })
        } catch (error) {
            throw error;
        }
    }
}

async function getMe(req, res) {
    try {
        const { userId } = req.user;
        const user = await UserModel.findById(userId);
        res.send(user);
    } catch (err) {
        throw err.message;
    }
}

async function isThere(req, res) {
    try {
        const { username } = req.body;
        const user = await UserModel.find({ username });
        if (!isEmpty(user)) res.send({ registered: true, hasPassword: true });
        else res.send({ registered: false, hasPassword: false });
    } catch (err) {
        throw err.message;
    }
}

module.exports = {
    createUser,
    getMe,
    isThere
}