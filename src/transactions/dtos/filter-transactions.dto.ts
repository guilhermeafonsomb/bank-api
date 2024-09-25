export class FilterTransactionsDto {
  fromAccount?: string;
  toAccount?: string;
  minAmount?: number;
  maxAmount?: number;
  startDate?: Date;
  endDate?: Date;
  type?: 'transferSent' | 'transferReceived';
}
