import Transaction from "../Models/transaction.model.js"
import { transactions } from "../dumyData/data.js"


const transactionResolver = {
    Query: {
        transactions: async (parent, _, context) => {
            try {
                const autherizedUser = await context.getUser()
                if (!autherizedUser) {
                    throw new Error("Unautherized")
                }
                const id = autherizedUser._id
                const transactions = await Transaction.find({ id })
                return transactions
            } catch (error) {
                console.error("Error in getting transactions: ", err);
                throw new Error("Internal server error");
            }

        },
        transaction: async (_, { transactionId }) => {
            try {
                const transaction = await Transaction.findById({ transactionId })
                return transaction
            } catch (error) {
                console.error("Error in transaction: ", err);
                throw new Error("Error getting Transaction");
            }
        }

    },
    Mutation: {
        createTransaction: async (_, { input }) => {
            try {
                const newTransaction = new Transaction({
                    ...input,
                    userId: await context.getUser()._id
                })
                await newTransaction.save()
                console.log("Transaction Created")

                return newTransaction
            } catch (error) {
                console.error("Error while creating a transaction: ", err);
                throw new Error("Error creating Transaction");
            }
        },
        updateTransaction: async (_, { input }) => {
            try {
                const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, { new: true })
                console.log("Transaction Updated")

                return updatedTransaction
            } catch (error) {
                console.error("Error while updating a transaction: ", err);
                throw new Error("Error updating Transaction");
            }
        },

        deleteTransaction: async (_, { transactionId }) => {
            try {
                const deletedTransaction = await Transaction.findByIdAndDelete(transactionId)
                console.log("Transaction Deleted")
                return deletedTransaction
            } catch (error) {
                console.error("Error while deleting a transaction: ", err);
                throw new Error("Error deleting Transaction");
            }
        },
    }
}


export default transactionResolver