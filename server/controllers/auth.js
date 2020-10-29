const User = require('../models/user')
const jwt = require('jsonwebtoken')

// SendGrid
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// exports.signup = (req, res) => {
//   // console.log('Request Body On SignUp:', req.body)
//   // res.json({
//   //   data: 'testing the new router endpoint.'
//   // })

//   const { name, email, password } = req.body

//   User.findOne({email}).exec((err, user) => {
//     if(user) {
//       return res.status(400).json({
//         error: 'Email is taken'
//       })
//     }
//   })

//   let newUser = new User({ name, email, password })

//   newUser.save((err, success) => {
//     if(err) {
//       console.log('SIGNUO ERROR:', err)
//       return res.status(400).json({
//         error: err
//       })
//     }
//     res.json({
//       user: newUser,
//       message: 'Signup success! Please signin'
//     })
//   })
// }

exports.signup = (req, res) => {
  const { name, email, password } = req.body

    User.findOne({email}).exec((err, user) => {
      if(user) {
        return res.status(400).json({
          error: 'Email is taken'
        })
      }

      const token = jwt.sign({name, email, password}, process.env.JWT_ACCOUNT_ACTIVATION, {expiresIn: '10m'})

      const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Account activation link`,
        html: `
        <h1> Please use the follwoing link to activate your account. </h1>
        <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
        <hr/>
        <p> This email may contain sensetive information. </p>
        <p> ${process.env.CLIENT_URL} </p>
        `
      }

      sgMail.send(emailData).then(sent => {
        console.log('SIGNUP EMAIL SENT', sent)

        return res.json({
          message: `Email has been sent to ${email}. Follow the instructions to activate your account.`
        })
      })
      .catch(err => {
        console.log('SIGNUP EMAIL SENT ERROR', err)
        return res.json({
          message: err.message
        })
      })
    })
}

exports.accountActivation = (req, res) => {
  const { token } = req.body

  
}