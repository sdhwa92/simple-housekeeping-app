import { TransactionsResponseModel } from './transactions-response.model';

export interface TransactionsResolveModel {
  transactions: TransactionsResponseModel[];
  dsSalaryIncomeTransactions: TransactionsResponseModel[];
  yiSalaryIncomeTransactions: TransactionsResponseModel[];
  ptIncomeTransactions: TransactionsResponseModel[];
  bankAccounts: any;
  transactionCategories: any;
  error?: any;
}
