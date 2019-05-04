import mongoose from 'mongoose'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import session from 'express-session'
import connectRedis from 'connect-redis'
import typeDefs from './typeDefs'
import resolvers from './resolvers'
import {
  APP_PORT,
  IN_PROD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  SESSION_NAME,
  SESSION_LIFE,
  SESSION_SECRET,
  REDIS_HOST,
  REDIS_PASS,
  REDIS_PORT
} from './config'

(async () => {
  try {
    await mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
    const app = express()

    app.disable('x-powered-by')

    const RedisStore = connectRedis(session)

    const store = new RedisStore({
      host: REDIS_HOST,
      port: REDIS_PORT,
      pass: REDIS_PASS
    })

    app.use(session({
      store,
      name: SESSION_NAME,
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: parseInt(SESSION_LIFE),
        sameSite: true,
        secure: IN_PROD
      }
    }))

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      playground: IN_PROD ? false : {
        settings: {
          'request.credentials': 'include'
        }
      },
      context: ({ req, res }) => ({ req, res })
    })
    server.applyMiddleware({
      cors: false,
      app
    })

    app.listen({ port: APP_PORT }, () =>
      console.log(`🚀 Server ready at http://localhost:${APP_PORT}${server.graphqlPath}`)
    )
  } catch (err) { console.error(err) }
})()
