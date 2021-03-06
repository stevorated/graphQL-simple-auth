import mongoose from 'mongoose'
import { hash, compare } from 'bcryptjs'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    minlength: [8, 'Email too short!'],
    validate: {
      validator: email => User.doesntExist({ email }),
      message: ({ value }) => `Email ${value} already exists` // TODO: fix later
    }
  },
  username: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    minlength: [2, 'username too short! must be at least 2 letters long'],
    validate: {
      validator: email => User.doesntExist({ email }),
      message: ({ value }) => `username ${value} already exists` // TODO: fix later
    }
  },
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    minlength: [2, 'name too short! must be at least 2 letters long']
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: [7, 'password must be at least 7 letters long ']
  }
}, {
  timestamps: true
})

userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 10)
  }
})

userSchema.statics.doesntExist = async function (options) {
  return await this.where(options).countDocuments() === 0
}

userSchema.methods.passwordMatch = function (password) {
  return compare(password, this.password)
}
const User = mongoose.model('User', userSchema)

export default User
