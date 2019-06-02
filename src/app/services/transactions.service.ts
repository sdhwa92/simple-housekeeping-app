import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { HBWebAPI, HB_WEB_API_PATH } from './hb-web-api.service';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';

/*Models*/
import { TransactionsResponseModel } from '../models/transactions-response.model';
import { TransactionsPostModel } from '../models/transactions-post.model';

export const GLOBAL_VARIABLES = {
  FINANCIAL_YEAR_MONTH: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
};

@Injectable()
export class TransactionsService {
  constructor(
    private http: HttpClient,
    private hbWebApi: HBWebAPI
  ) {}

  private requestOptions(options = {}) {
    const headers = new HttpHeaders().set('Accept', 'application/json');

    return _.merge({
      headers: headers
    }, options);
  }

  /**
   * Get all bank accounts
   */
  getAccounts(): Observable<any> {
    const options = this.requestOptions();

    return this.http
      .get<any>(
        HB_WEB_API_PATH.ENDPOINT + '/' +
        HB_WEB_API_PATH.ENDPOINTS.BANK_ACCOUNT.GET,
        options
      );
  }

  /**
   * Get all categories
   */
  getCategories(): Observable<any> {
    const options = this.requestOptions();

    return this.http
      .get<any>(
        HB_WEB_API_PATH.ENDPOINT + '/' +
        HB_WEB_API_PATH.ENDPOINTS.CATEGORIES.GET,
        options
      );
  }

  /**
   * Get all transactions list
   */
  getTransactions(): Observable<any> {
    const options = this.requestOptions();

    return this.http
      .get<any>(
        HB_WEB_API_PATH.ENDPOINT + '/' +
        HB_WEB_API_PATH.ENDPOINTS.TRANSACTION.GET,
        options
      );
  }

  /**
   * Add a new Transaction
   * @param data
   */
  addTransaction(data): Observable<any> {
    const options = this.requestOptions();
    const body: TransactionsPostModel = {
      transaction_type: data.transactionType,
      is_fixed: data.isFixed,
      category_id: data.transactionCategory,
      transaction_date: data.transactionDate,
      amount: data.transactionAmount,
      account_id: data.bankAccount
    };

    return this.http
      .post<any>(
        HB_WEB_API_PATH.ENDPOINT + '/' +
        HB_WEB_API_PATH.ENDPOINTS.TRANSACTION.POST,
        body, options
      );
  }

  getIncomeTransactionsByCategory(categoryId: number, year?: number): Observable<any> {
    const options = this.requestOptions();

    if ( !!!year ) {
      year = this.getCurrentFinancialYear();
    }

    return this.http
      .get<TransactionsResponseModel[]>(
        HB_WEB_API_PATH.ENDPOINT + '/' +
        HBWebAPI.prepareURI(HB_WEB_API_PATH.ENDPOINTS.TRANSACTION.GET_INCOMES_BY_CATEGORY, {year: year, categoryId: categoryId}),
        options
      );
  }

  /**
   * Create an array containing sum of transaction amount in each month.
   * Array length is 12.
   * index 0: July
   * index 11: June
   *
   * @param data
   * @param transType
   * @param year => Beginning year of the current financial year term
   */
  sumOfAnnualTransactionsEachMonth(data: TransactionsResponseModel[], transType: 'income'|'expense', year?: number) {
    if ( !!!year ) {
      year = this.getCurrentFinancialYear();
    }
    const financialYearTransactions = _.filter(data, function(o) {
      if ( o.transaction_type === transType && moment(o.transaction_date).year() === year ) {
        return moment(o.transaction_date).month() >= 6;
      } else if ( o.transaction_type === transType && moment(o.transaction_date).year() === year + 1 ) {
        return moment(o.transaction_date).month() < 6;
      }
    });
    // console.log(financialYearTransactions);
    const sumOfTransactionsEachMonth = [];
    const transactions_jul = this.extractTransactionAmounts(financialYearTransactions, 6);
    // console.log('July: ' + transactions_jul);
    const transactions_aug = this.extractTransactionAmounts(financialYearTransactions, 7);
    // console.log('August: ' + transactions_aug);
    const transactions_sep = this.extractTransactionAmounts(financialYearTransactions, 8);
    // console.log('September: ' + transactions_sep);
    const transactions_oct = this.extractTransactionAmounts(financialYearTransactions, 9);
    // console.log('October: ' + transactions_oct);
    const transactions_nov = this.extractTransactionAmounts(financialYearTransactions, 10);
    // console.log('November: ' + transactions_nov);
    const transactions_dec = this.extractTransactionAmounts(financialYearTransactions, 11);
    // console.log('December: ' + transactions_dec);
    const transactions_jan = this.extractTransactionAmounts(financialYearTransactions, 0);
    // console.log('January: ' + transactions_jan);
    const transactions_feb = this.extractTransactionAmounts(financialYearTransactions, 1);
    // console.log('February: ' + transactions_feb);
    const transactions_mar = this.extractTransactionAmounts(financialYearTransactions, 2);
    // console.log('March: ' + transactions_mar);
    const transactions_apr = this.extractTransactionAmounts(financialYearTransactions, 3);
    // console.log('April: ' + transactions_apr);
    const transactions_may = this.extractTransactionAmounts(financialYearTransactions, 4);
    // console.log('May: ' + transactions_may);
    const transactions_jun = this.extractTransactionAmounts(financialYearTransactions, 5);
    // console.log('June: ' + transactions_jun);
    // TODO: Retrieve only value of amount before call sum function.
    sumOfTransactionsEachMonth[0] = transactions_jul.length > 0 ? transactions_jul.reduce(this.getSum) : 0;
    sumOfTransactionsEachMonth[1] = transactions_aug.length > 0 ? transactions_aug.reduce(this.getSum) : 0;
    sumOfTransactionsEachMonth[2] = transactions_sep.length > 0 ? transactions_sep.reduce(this.getSum) : 0;
    sumOfTransactionsEachMonth[3] = transactions_oct.length > 0 ? transactions_oct.reduce(this.getSum) : 0;
    sumOfTransactionsEachMonth[4] = transactions_nov.length > 0 ? transactions_nov.reduce(this.getSum) : 0;
    sumOfTransactionsEachMonth[5] = transactions_dec.length > 0 ? transactions_dec.reduce(this.getSum) : 0;
    sumOfTransactionsEachMonth[6] = transactions_jan.length > 0 ? transactions_jan.reduce(this.getSum) : 0;
    sumOfTransactionsEachMonth[7] = transactions_feb.length > 0 ? transactions_feb.reduce(this.getSum) : 0;
    sumOfTransactionsEachMonth[8] = transactions_mar.length > 0 ? transactions_mar.reduce(this.getSum) : 0;
    sumOfTransactionsEachMonth[9] = transactions_apr.length > 0 ? transactions_apr.reduce(this.getSum) : 0;
    sumOfTransactionsEachMonth[10] = transactions_may.length > 0 ? transactions_may.reduce(this.getSum) : 0;
    sumOfTransactionsEachMonth[11] = transactions_jun.length > 0 ? transactions_jun.reduce(this.getSum) : 0;

    return sumOfTransactionsEachMonth;
  }

  /**
   * Get the beginning year of the current financial year term
   * e.g. return 2018 if today is 30th of May 2019
   */
  getCurrentFinancialYear() {
    if ( moment().month() >= 6) {
      return moment().year();
    } else {
      return moment().year() - 1;
    }
  }

  /**
   * Get all transaction amounts out of in a financial year transaction objects
   * @param data
   * @param monthIndex
   */
  extractTransactionAmounts(data: TransactionsResponseModel[], monthIndex: number) {
    const transactions_amounts = [];
    _(data)
      .filter(function(o) {
        return moment(o.transaction_date).month() === monthIndex;
      })
      .forEach(function(o) {
        transactions_amounts.push(o.amount);
      });

    return transactions_amounts;
  }

  /**
   * Get sum of number array
   * @param total
   * @param num
   */
  private getSum(total: number, num: number) {
    return total + num;
  }

  /**
   * Mapping month for Aus financial year
   */
  convertToAusMonthNumber(monthNumber?: number): number {
    let monthNum = moment().month();
    if ( monthNumber ) {
      monthNum = monthNumber;
    }

    if ( monthNum < 6) {
      monthNum = monthNum + 6;
    } else {
      monthNum = monthNum - 6;
    }

    return monthNum;
  }
}
