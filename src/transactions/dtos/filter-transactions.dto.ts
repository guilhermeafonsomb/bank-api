export class TransactionFilterDto {
  fromAccount?: string;
  toAccount?: string;
  minAmount?: number;
  maxAmount?: number;
  startDate?: Date;
  endDate?: Date;
  type?: string;
}
