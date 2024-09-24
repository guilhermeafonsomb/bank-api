export class Transaction {
  id: string;
  fromAccount: string;
  toAccount?: string;
  amount: number;
  createdAt: Date;
  userId: string;
  type: 'deposit' | 'withdraw' | 'transferSent' | 'transferReceived';
}
