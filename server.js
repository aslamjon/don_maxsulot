// Requiring module
const express = require('express');
const app = express();
const cors = require('cors');

const { connectDb } = require("./services/db/db");
const { checkUser } = require("./middlewares/authMiddleware")
const { checkPermission, isAdmin } = require('./middlewares/checkPermission');
const { userRouter } = require('./routers/userRouter');
const { authRouter } = require('./routers/authRouter');
const { cardOfHomeRouter } = require('./routers/cardOfHomeRouter');



app.use(cors());
require("dotenv").config();
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ extended: true })) // if json come backend then it convert to obj in req.body

app.use('/auth', authRouter);
app.use('/api/user', checkUser, userRouter);
app.use('/api/cardhome', checkUser, cardOfHomeRouter);



// Error handle
app.use(function (err, req, res, next) {
    console.log("[Global error middleware]", err.message);
    res.status(500).send({
        message: err.message
    })
    next();
})


const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => { console.log(`Server is running on ${PORT}`); connectDb(); });