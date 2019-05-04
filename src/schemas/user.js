import Joi from 'joi'

const email = Joi.string().email().required().label('Email')
const username = Joi.string().alphanum().min(4).max(30).required().label('Username')
const name = Joi.string().max(100).required().label('Name')
const password = Joi.string().min(8).max(30).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required().label('Password').options({
  language: {
    string: {
      regex: {
        base: 'Between 8 and 30 characters, at least one uppercase letter, one lowercase letter, one number and one special character'
      }
    }
  }
})

export default Joi.object().keys({
  email,
  username,
  name,
  password
})

export const signUp = Joi.object().keys({
  email,
  username,
  name,
  password
})

export const signIn = Joi.object().keys({
  email,
  password
})
