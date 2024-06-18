import passport from 'passport'
import bcryptjs from 'bcryptjs'

//model
import User from '../Models/user.model.js'
import { GraphQLLocalStrategy } from 'graphql-passport'



export const configurePassport = () => {
    passport.serializeUser((user, done) => {
        console.log("serializing user")
        done(null, user.id)
    })

    passport.deserializeUser(async(id, done) => {
        console.log("Deserializing User");
        try {
            const user = await User.findById(id)
            done(null, user)
        } catch (error) {
            done(error)
        }
    })

    passport.use(
        new GraphQLLocalStrategy(async(username, password, done) => {
            try {
                const user = await User.findOne({username})
                if(!user){
                    throw new Error("Invalid username or password!")
                }
                const validPassword = await bcryptjs.compare(password, user.password)
                if(!validPassword) {
                    throw new Error("Invalid suername or password")
                }
                return done(null, user)
            } catch (error) {
                return done(err)
            }
        })
    )
}