import Transaction from "../models/transaction.model.js";

const transactionResolver = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        if (!context.getUser()) throw new Error("Não autorizado");

        const userId = await context.getUser()._id;
        const transactions = await Transaction.find({ userId });
        return transactions;
      } catch (err) {
        console.error("Erro ao obter transações:", err);
        throw new Error("Erro ao obter transações");
      }
    },

    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transaction.findById(transactionId);
        return transaction;
      } catch (err) {
        console.error("Erro ao obter a transação:", err);
        throw new Error("Erro ao obter a transação");
      }
    },
  },

  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        const newTransaction = new Transaction({
          ...input,
          userId: context.getUser()._id,
        });

        await newTransaction.save();
        return newTransaction;
      } catch (err) {
        console.error("Erro ao criar a transação:", err);
        throw new Error("Erro ao criar a transação");
      }
    },

    updateTransaction: async (_, { input }) => {
      try {
        const updateTransaction = await Transaction.findByIdAndUpdate(
          input.transactionId,
          input,
          { new: true }
        );
        return updateTransaction;
      } catch (err) {
        console.error("Erro ao modificar a transação:", err);
        throw new Error("Erro ao modificar a transação");
      }
    },

    deleteTransaction: async (_, { transactionId }) => {
      try {
        const deletedTransaction = await Transaction.findByIdAndDelete(
          input.transactionId,
          input,
          { new: true }
        );
        return deletedTransaction;
      } catch (err) {
        console.error("Erro ao deletar a transação:", err);
        throw new Error("Erro ao deletar a transação");
      }
    },
  },
};

export default transactionResolver;
