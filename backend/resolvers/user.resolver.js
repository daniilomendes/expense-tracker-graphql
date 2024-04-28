import User from "../models/user.model.js";
import Transaction from "../models/transaction.model.js";
import bcrypt from "bcryptjs";

const userResolver = {
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { username, name, password, gender } = input;

        if (!username || !name || !password || !gender) {
          throw new Error("Preencha todos os campos!");
        }

        const existingUser = await User.findOne({ username });

        if (existingUser) {
          throw new Error("Este usuário já existe");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
          username,
          name,
          password: hashedPassword,
          gender,
          profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
        });

        await newUser.save();
        await context.login(newUser);
        return newUser;
      } catch (err) {
        console.error("Erro ao Inscrever-se: ", err);
        throw new Error(err.message || "Erro interno do servidor");
      }
    },

    login: async (_, { input }, context) => {
      try {
        const { username, password } = input;
        if (!username || !password)
          throw new Error("Todos os campos devem ser preenchidos.");
        const { user } = await context.authenticate("graphql-local", {
          username,
          password,
        });

        await context.login(user);
        return user;
      } catch (err) {
        console.error("Erro ao Entrar:", err);
        throw new Error(err.message || "Erro interno do servidor");
      }
    },

    logout: async (_, __, context) => {
      try {
        await context.logout();
        context.req.session.destroy((err) => {
          if (err) throw err;
        });
        context.res.clearCookie("connect.sid");

        return { message: "Desconectado com sucesso!" };
      } catch (err) {
        console.error("Erro ao Sair:", err);
        throw new Error(err.message || "Erro interno do servidor");
      }
    },
  },

  Query: {
    authUser: async (_, __, context) => {
      try {
        const user = await context.getUser();
        return user;
      } catch (err) {
        console.error("Erro em authUser: ", err);
        throw new Error("Erro interno do servidor");
      }
    },

    user: async (_, { userId }) => {
      try {
        const user = await User.findById(userId);
        return user;
      } catch (err) {
        console.error("Erro em consultar o usuário: ", err);
        throw new Error(err.message || "Erro interno do servidor");
      }
    },
  },

  User: {
    transactions: async (parent) => {
      try {
        const transactions = await Transaction.find({ userId: parent._id });
        return transactions;
      } catch (err) {
        console.log("Erro no user.transactions resolver: ", err);
        throw new Error(err.message || "Erro interno do servidor.");
      }
    },
  },
};

export default userResolver;
