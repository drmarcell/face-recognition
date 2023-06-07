const express = require('express');
const { login, register } = require('../../controllers/user.controller');
const { handleApiCall, handleImage } = require('../../controllers/image.controller');

const userRouter = express.Router();

userRouter.use((req, res, next) => {
    next();
});

userRouter.post('/login', login);
userRouter.post('/register', register);
userRouter.post('/imageurl', handleApiCall);
userRouter.put('/image', handleImage);

module.exports = userRouter