import mongoose, { Schema, Document } from 'mongoose';

// Wallet Transaction Interface
interface WalletTransaction {
  description: string; // Description of the transaction
  type: 'credit' | 'debit'; // Whether the transaction is a credit or debit
  amount: number; // Transaction amount
  date: Date;
  payoutDate: Date; 
  userId: string; // ID of the user involved in the transaction
  userName: string; // Name of the user involved in the transaction
  rideId: string;
}

export interface WalletInterface extends Document {
  userId: string; // Unique identifier for the wallet's user
  balance: number; // Current balance in the wallet
  transactions: WalletTransaction[]; // List of wallet transactions
}

// Wallet Schema Definition
const WalletSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true, // Ensures a unique wallet per user
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    transactions: {
      type: [
        {
          description: { type: String, required: true },
          type: {
            type: String,
            enum: ['credit', 'debit'],
            required: true,
          },
          amount: { type: Number, required: true },
          date: { type: Date, required: true, default: Date.now },
          payoutDate: {
            type: Date,
            required: true,
            default: function () {
              const now = new Date();
              now.setDate(now.getDate() + 10);
              return now;
            },
          },
          userId: { type: String, required: true },
          userName: { type: String, required: true },
          rideId: { type: String, required: true },
        },
      ],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);


// Create the Wallet model
const walletModel = mongoose.model<WalletInterface>('Wallet', WalletSchema);

export default walletModel;
