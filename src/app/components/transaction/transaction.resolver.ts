import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { TransactionsService } from '../../services/transactions.service';
import { HttpErrorResponse } from '@angular/common/http';


import { Observable, forkJoin, of } from 'rxjs';
import { TransactionsResponseModel } from '../../models/transactions-response.model';
import { TransactionsResolveModel } from '../../models/transactions-resolve.model';
import { catchError, finalize, flatMap, map, tap } from 'rxjs/operators';

@Injectable()
export class TransactionResolver implements Resolve<Observable<any>> {
  constructor(
    private transactionService: TransactionsService
  ) {}

  public resolve( route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot ): Observable<TransactionsResolveModel> {
    let result;

    result = forkJoin([
      this.transactionService.getTransactions(), // All transactions
      this.transactionService.getAccounts(), // All bank accounts
      this.transactionService.getCategories(), // All transaction categories
      this.transactionService.getIncomeTransactionsByCategory(1),
      this.transactionService.getIncomeTransactionsByCategory(2),
      this.transactionService.getIncomeTransactionsByCategory(3)
    ]).pipe(
      map((allResponses) => {
        return Object.assign({
          transactions: allResponses[0],
          bankAccounts: allResponses[1],
          transactionCategories: allResponses[2],
          dsSalaryIncomeTransactions: allResponses[3],
          yiSalaryIncomeTransactions: allResponses[4],
          ptIncomeTransactions: allResponses[5]
        });
      }),
      map((response: any) => {
        return response;
      })
    );

    return result
      .pipe(
        finalize(() => {
          console.log('Transaction Resolver Success');
        }),
        catchError((e) => {
          console.log(e);
          return of({
            transactions: null,
            bankAccounts: null,
            transactionCategories: null,
            dsSalaryIncomeTransactions: null,
            yiSalaryIncomeTransactions: null,
            ptIncomeTransactions: null,
            error: {
              message: 'Unable to load transaction details',
              details: e instanceof HttpErrorResponse ? e.message : e
            }
          });
        })
      );
  }
}
