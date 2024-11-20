const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => res.render('login');

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

// Fixed now
const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username is already in use!' });
    }
    return res.status(500).json({ error: 'An error occured!' });
  }
};

// Update password to account if logged in
const changePass = async (req, res) => {
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  // attempt to change password
  try {
    const hash = await Account.generateHash(pass);
    // Gonna try searching by id, can use findOneAndUpdate if fails
    await Account.findByIdAndUpdate(req.session.account._id, { password: hash }).lean().exec();
    return res.json({ redirect: '/maker' });
  } catch (err) {
    return res.status(500).json({ error: 'An error occurred! ' });
  }
};

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  changePass,
};
