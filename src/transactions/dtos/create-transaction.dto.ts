export class CreateTransactionDto {
  fromAccount: string;
  toAccount?: string;
  amount: number;
  userId: string;
  type: 'transferSent' | 'transferReceived';
}
