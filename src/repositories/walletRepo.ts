// src/repositories/rideRepo.ts

import walletModel from "../entities/wallet";

export default class WalletRepository {

  // Method to add a transaction to a user's wallet
  addTransaction = async (
    userId: string,
    userName: string,
    type: 'credit' | 'debit',
    amount: number,
    description: string,
    rideId: string
  ) => {
    try {
      const now = new Date();
      const payoutDate = new Date();
      payoutDate.setDate(now.getDate() + 10); // Set payout date 10 days from now
  
      const transaction = {
        description,
        type,
        amount, 
        date: now,
        payoutDate,
        userId,
        userName,
        rideId,
      };
  
      return await walletModel.findOneAndUpdate(
        { userId },
        {
          $inc: { balance: type === 'credit' ? amount : -amount },
          $push: { transactions: transaction },
        },
        { new: true, upsert: true } // Create a new wallet if none exists
      );
  
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw new Error('Error adding transaction to wallet.');
    }
  };
}
