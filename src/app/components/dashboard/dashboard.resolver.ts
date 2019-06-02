// Imports
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { TransactionsService } from '../../services/transactions.service';

// Models
import { TransactionsResponseModel } from '../../models/transactions-response.model';

// Import RxJS required methods
import { Observable } from 'rxjs';
import { first, flatMap, map } from 'rxjs/operators';

@Injectable()
export class DashboardResolver implements Resolve<Observable<any>> {
  constructor(
    private transactionService: TransactionsService
  ) {}

  public resolve( route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot ): Observable<any> {
    return this.transactionService.getTransactions()
      .pipe(
        map(
          (transactions: TransactionsResponseModel[]) => {
            return {
              sumOfIncomes: this.transactionService.sumOfAnnualTransactionsEachMonth(transactions, 'income'),
              sumOfExpenses: this.transactionService.sumOfAnnualTransactionsEachMonth(transactions, 'expense')
            };
          }
        ),
        first()
      );
  }
}
