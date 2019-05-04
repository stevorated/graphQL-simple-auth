import Joi from 'joi'
import mongoose from 'mongoose'
import { User } from '../models'
import { UserInputError } from 'apollo-server-express'
import * as Auth from '../auth'
import { signIn, signUp } from '../schemas'

export default {
  Query: {
    me: (root, args, { req }, info) => {
      // TODO: check authentication, projection, pagination, sanitization
      Auth.checkSignedIn(req)
      return User.findById(req.session.userId)
    },
    users: (root, args, { req }, info) => {
      // TODO: check authentication, projection, pagination, sanitization
      Auth.checkSignedIn(req)
      return User.find({})
    },
    user: (root, { id }, { req }, info) => {
      // TODO: check authentication, projection, sanitization
      Auth.checkSignedIn(req)
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new UserInputError(`${id} is not valid`)
      }
      return User.findById(id)
    }
  },
  Mutation: {
    // TODO: check NOT auth
    signUp: async (root, args, { req }, info) => {
      Auth.checkSignedOut(req)
      // TODO: validation
      await Joi.validate(args, signUp, { abortEarly: false })

      const user = await User.create(args)
      req.session.userId = user.id
      return user
    },
    signIn: async (root, args, { req }, info) => {
      const { email, password } = args
      const { userId } = req.session
      if (userId) {
        return User.findById(userId)
      }

      await Joi.validate(args, signIn, { abortEarly: false })
      const user = await Auth.attmeptSignIn(email, password)
      req.session.userId = user.id
      return user
    },
    signOut: (root, args, { req, res }, info) => {
      Auth.checkSignedIn(req)
      return Auth.signOut(req, res)
    }
  }
}
