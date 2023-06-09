const { registerUser, checkExistingUser } = require('../models/users.model');
const bcrypt = require("bcrypt")

async function login(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const validationResult = validateForm(null, email, password);

    if (!validationResult.isValid) {
      return res.json({
        success: false,
        error: validationResult.formError
      })
    }

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
    const validationResult = validateForm(name, email, password);
    if (!validationResult.isValid) {
      return res.json({
        success: false,
        error: validationResult.formError
      })
    }

    const encryptedPass = await encryptPassword(password);
    console.log('encryptedPass: ', encryptedPass);

    if (encryptedPass) {
        const registerSuccess = await registerUser(name, email, encryptedPass);
        if (registerSuccess.success) {
            res.status(200).json({
                success: true,
                user: registerSuccess.user
            });
        } else {
            res.json({
                success: false,
                error: registerSuccess.error
            })
        }
    } else {
        res.json({
            success: false
        })
    }

}

function validateForm(name, email, password) {
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  let isValid = true;
  let formError = {
    name: null,
    email: null,
    password: null
  }

  if (name) {
    if (name === '' || name.length < 3 || name.includes('  ') || name.includes('<') || name.includes('>')) {
      formError.name = 'invalid';
      isValid = false;
    } else {
      formError.name = null;
    }
  }

  if (!email.match(emailRegex)) {
    formError.email = 'invalid';
    isValid = false;
  } else if (email === '') {
    formError.email = 'empty';
  } else {
    formError.email = null;
  }
  if (password === '' || password.length < 3 || password.includes(' ') || password.includes('<') || password.includes('>')) {
    formError.password = 'invalid';
    isValid = false;
  } else {
    formError.password = null;
  }

  console.log('validation is: ', isValid)
  return {isValid, formError};
};

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
