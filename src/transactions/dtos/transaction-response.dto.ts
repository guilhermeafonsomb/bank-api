export class TransactionResponseDto {
  amount: number;
  fromAccountName: string;
  toAccountName?: string;
  type: 'transferSent' | 'transferReceived';
  createdAt: Date;
}
