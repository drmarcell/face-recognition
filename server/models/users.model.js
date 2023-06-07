require('dotenv').config();
const users = require('../models/users.mongo');

const DEFAULT_ID = 0;

async function checkExistingUser(email) {
	try {
		const user = await users
		  .findOne({ email }, { _id: 0, __v: 0, joined: 0 })
		console.log('user is: ', user);
		return user;
	} catch (err) {
		console.error('Could not get the email: ', err);
	}
}

async function getLatestID() {
	// sort sorts parameter in ascent order, to descent the order need a minus sign before
	const latestUser = await users
		.findOne()
		.sort('-id');
    console.log('latestUser', latestUser);
	return latestUser ? latestUser.id : DEFAULT_ID;
};

async function registerUser(name, email, password) {
	const isUserExist = await checkExistingUser(email);
	if (isUserExist) {
		console.log('this email already in use');
		return { success: false, error: 'occupied'};
	};

    const latestID = await getLatestID();
    const newUserID = latestID + 1;
    console.log('newUserID is: ', newUserID)
	try {
		await users.updateOne({
			id: newUserID,
			name: name,
            email: email,
            password: password,
			entries: 0,
			joined: new Date(Date.now())
		}, {
			id: newUserID,
			name: name,
            email: email,
            password: password,
			entries: 0,
			joined: new Date(Date.now())
		}, {
			upsert: true
		});
		const newUser = await users.findOne({ id: newUserID }, { _id: 0, __v: 0, password: 0, joined: 0 })
		console.log('newUser is: ', newUser);
        return { success: true, user: newUser };
	} catch (err) {
		console.error('Could not register user: ', err);
        return { success: false, error: 'failed' };
	}
}

async function updateUserEntries(id) {
	try {
		const user = await users
		  .findOne({ id }, { _id: 0, __v: 0, joined: 0 });
		const entries = user.entries;
		console.log('user entries is: ', entries);
		await users.updateOne({
			id
		}, {
			entries: entries + 1
		});
		console.log('user entries modification was successful: ', entries + 1);
		return { success: true, entries: entries + 1 };
	} catch (err) {
		console.error('Could not update user entries: ', err);
        return { success: false, error: 'failed' };
	}
}

module.exports = {
    registerUser,
	checkExistingUser,
	updateUserEntries
}