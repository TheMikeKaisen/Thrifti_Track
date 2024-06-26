import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';

import passport from 'passport';
import session from 'express-session';
import connectMongo from 'connect-mongodb-session'

import { buildContext } from 'graphql-passport';

// Apollo imports
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';


import connectDB from './Database/connectDB.js';
import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";
import { configurePassport } from './passport /possport.config.js';

dotenv.config()
configurePassport();

const app = express();

const httpServer = http.createServer(app);

const MongoDBStore = connectMongo(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions"
})

store.on('error', (error) => console.log(error))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // this option specifies whether to save the session to the store on every request
    saveUninitialized: false, // this option specifies whether to save uninitialized sessions
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true, // this option prevents the cross-site scripting attacks
    },
    store: store

  })
)

app.use( passport.initialize());
app.use(passport.session());

 
const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],

})

await server.start();
app.use(
  '/graphql',
  cors({
    origin: 'http://localhost:3000', 
    credentials: true
  }),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res }),
  }),
);

// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

// connect database
await connectDB()

console.log(`🚀 Server ready at http://localhost:4000/graphql`);