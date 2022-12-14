// USER CONTROLLER
/*
File Name: users.js
Name: Mehak kaur 
Student ID 301232188
Date 20 October, 2022
*/

const user = require('../Models/user');
const bcryptjs = require('bcryptjs');

// RENDERS THE LOGIN PAGE WITH WARNINGS IF ANY
exports.getLogin = (req, res, next) => {
  // USING FLASH() FOR SENDING RESPONSE TO USER 
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('authorised/login', {
    title: 'Login',
    errorMessage: message
  })

}

// CHECKS THE ENTERED CREDENTIALS IF THEY ARE CORRECT OR NOT
exports.postLogin = (req, res, next) => {
  // GETTING USERNAME AND PASSWORD ENTERED BY USER FROM BODY
  const username = req.body.username;
  const password = req.body.password;
  console.log(username, password);

  // USING MONGOOSE FUNCTION FINDONE() TO CHECK IF THE USERNAME EXIST IN THE DATABASE
  user.findOne({ username: username })
    .then(user => {
      if (!user) {
        // IF USERNAME NOT FOUNF i.e INVALID CREDENTIALS
        req.flash('error', 'Invalid Username');
        return res.redirect('/users/login');
      }
      else {
        // USERNAME FOUND NOW CHECKING THE PASSWORD
        bcryptjs.compare(password, user.password) // ENCRYPTING AND CHECKING THE PASSWORD
          .then(domatch => {
            if (domatch) {
              console.log('VALID USERNAME AND PASSWORD');
              req.session.isLoggedIn = true;
              req.session.user = user;
              res.redirect('/businessContacts');
              console.log('SESSION STATUS ' + req.session.isLoggedIn)
            }
            else {
              req.flash('error', 'Invalid Password');
              res.redirect('/users/login');
              console.log('SESSION STATUS ' + req.session.isLoggedIn)
            }
          })
      }
    });
}

// LOGOUT FUNCTION THAT DELETS CURRENT SESSION
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect('/users/login');
  })
  console.log('LOGOUT');
}