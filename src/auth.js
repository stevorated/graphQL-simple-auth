import { AuthenticationError } from 'apollo-server-express'
import { User } from './models'
import { SESSION_NAME } from './config'

const message = 'Wrong Details. Try again'

export const attmeptSignIn = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new AuthenticationError(message)
  }
  const check = await user.passwordMatch(password)
  if (!check) {
    throw new AuthenticationError(message)
  }
  return user
}

const signedIn = req => req.session.userId

export const checkSignedIn = req => {
  if (!signedIn(req)) {
    throw new AuthenticationError('You must be signed in.')
  }
}

export const checkSignedOut = req => {
  if (signedIn(req)) {
    throw new AuthenticationError('You are already signed in.')
  }
}

export const signOut = (req, res) => new Promise((resolve, reject) => {
  req.session.destroy(err => {
    if (err) reject(err)
    res.clearCookie(SESSION_NAME)
    resolve(true)
  })
})
