const Clarifai = require('clarifai');
const { updateUserEntries } = require('../models/users.model');

const API_KEY = process.env.API_KEY;

const app = new Clarifai.App({
 apiKey: API_KEY
});


async function handleApiCall(req, res) {
  const { input } = req.body;
  app.models.predict('face-detection', input)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.error('unable to work with API: ', err);
      res.status(400).json('unable to work with API');
    })
}

async function handleImage(req, res, db) {
  const { id } = req.body;
  const entries = await updateUserEntries(id);
  console.log('entries from handleImage are: ', entries);
  if (entries) {
    res.json(entries);
  } else {
    res.json({ success: false })
  }
}

module.exports = {
  handleImage,
  handleApiCall
}
