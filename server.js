// Requiring module
const express = require('express');
const app = express();
const cors = require('cors');

const { connectDb } = require("./services/db/db");

const { checkUser } = require("./middlewares/authMiddleware")
const { checkPermission, isAdmin } = require('./middlewares/checkPermission');

// ROUTERS
const { userRouter } = require('./routers/userRouter');
const { authRouter } = require('./routers/authRouter');
const { cardOfHomeRouter } = require('./routers/cardOfHomeRouter');
const { wareHouseRouter } = require('./routers/wareHouseRouter');
const { tradingPointRouter } = require('./routers/tradingPointRouter');
const { lendDebtRouter } = require('./routers/lendDebtRouter');
const { bazaarRouter } = require('./routers/bazaarRouter');

const logger = require('./utils/logger');


app.use(cors());
require("dotenv").config();
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ extended: true })) // if json come backend then it convert to obj in req.body

app.use('/api/auth', authRouter);
// app.use('/api/user', userRouter);
app.use('/api/cardhome', checkUser, cardOfHomeRouter);
app.use('/api/warehouse', checkUser, wareHouseRouter);
app.use('/api/trading', checkUser, tradingPointRouter);
app.use('/api/lend', checkUser, lendDebtRouter);
app.use('/api/bazaar', checkUser, bazaarRouter);



app.use(express.static('routes'));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('API Not Found. Please check it and try again.');
    err.status = 404;
    next(err);
});

// Error handle
app.use((err, req, res, next) => {
    console.log("[Global error middleware]", err.message);
    res.status(500).send({
        message: err.message
    })
    next();
})


const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => { logger.info(`Server is running on ${PORT}`); connectDb(); });