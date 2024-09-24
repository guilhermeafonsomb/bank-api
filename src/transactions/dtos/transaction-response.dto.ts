export class TransactionResponseDto {
  amount: number;
  fromAccountName: string;
  toAccountName?: string;
  type: 'deposit' | 'withdraw' | 'transferSent' | 'transferReceived';
}
