export interface TransactionsResponseModel {
  id?: number;
  transaction_type: number;
  is_fixed: boolean;
  transaction_category: string;
  transaction_date: string;
  amount: number;
  account_name: string;
}

