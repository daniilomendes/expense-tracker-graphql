import passport from "passport";
import bcrypt from "bcryptjs";

import { GraphQLLocalStrategy } from "graphql-passport";

import User from "../models/user.model.js";

export const configurePassport = async () => {
  passport.serializeUser((user, done) => {
    console.log("Serializando Usuário");
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    console.log("Deserializando Usuário");
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  passport.use(
    new GraphQLLocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username });

        if (!user) {
          throw new Error("Nome de usuário ou senha inválidos!");
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
          throw new Error("Nome de usuário ou senha inválidos!");
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );
};
