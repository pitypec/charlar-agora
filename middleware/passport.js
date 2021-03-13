import passport from 'passport';
import jwtStrat from 'passport-jwt';
import localStrat from 'passport-local';
import dotenv from 'dotenv';
import User from '../models/userModel.js';

dotenv.config();
const JwtStrategy = jwtStrat.Strategy;
const LocalStrategy = localStrat.Strategy;

const { ExtractJwt } = jwtStrat;

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader('authorization'),
      secretOrKey: process.env.ACCESS_JWT_SECRET
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.id);
        if (!user) {
          return done(null, false);
        }
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email'
    },
    async (email, password, done) => {
      console.log(email, password);
      try {
        const user = await User.findOne({ 'local.email': email });
        console.log(user);
        if (!user) {
          return done(null, false);
        }
        console.log('2', user);
        const Match = await user.isValidPassword(password);
        console.log('match', Match);

        if (!Match) {
          return done(null, false);
        }
        console.log('3', user);
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

export default passport;
