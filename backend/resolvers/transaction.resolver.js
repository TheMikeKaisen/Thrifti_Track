import { transactions } from "../dumyData/data.js"


const transactionResolver = {
    Query: {
        transactions: () => {
            return transactions
        },
        transaction: (parent, args) => {
            const id = args.transactionId
            return transactions.find((transaction)=> transaction._id === id)
        }

    }, 
    Mutation: {}
}

export default transactionResolver