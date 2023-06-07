const { registerUser, checkExistingUser } = require('../models/users.model');
const bcrypt = require("bcrypt")

async function login(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const user = await checkExistingUser(email);
    let isSamePassword = false;
    if (user) {
        isSamePassword = await checkPassword(password, user.password);
    }
    if (user && isSamePassword) {
        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                entries: user.entries
            }
        })
    } else {
        res.json({
            success: false,
        })
    }
}

async function register(req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const encryptedPass = await encryptPassword(password);
    console.log('encryptedPass: ', encryptedPass);

    if (encryptedPass) {
        const registerSuccess = await registerUser(name, email, encryptedPass);
        if (registerSuccess.success) {
            res.status(200).send({
                success: true,
                user: registerSuccess.user
            });
        } else {
            res.send({
                success: false,
                error: registerSuccess.error
            })
        }
    } else {
        res.send({
            success: false
        })
    }

}

async function encryptPassword(password) {
    const salt = 12;
    let hashedEmail = null;
    await bcrypt.hash(password, salt)
        .then(hash => {
            hashedEmail = hash
        })
        .catch(err => console.error('password encription failed: ', err));
    return hashedEmail;
}

async function checkPassword(formPassword, storedPassword) {
    return await bcrypt.compare(formPassword, storedPassword)
        .then(response => response)
        .catch(err => console.error('password cannot checked: ', err));
}

module.exports = {
    login,
    register
}