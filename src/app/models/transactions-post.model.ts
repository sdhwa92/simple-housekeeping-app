export interface TransactionsPostModel {
  transaction_type: number;
  is_fixed: boolean;
  category_id: number;
  transaction_date: string;
  amount: number;
  account_id: number;
}
