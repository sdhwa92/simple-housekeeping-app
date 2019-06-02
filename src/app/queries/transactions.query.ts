import { QueryEntity } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { TransactionsResponseModel } from '../models/transactions-response.model';
import { State, TransactionsStore } from '../stores/transactions.store';

@Injectable({
  providedIn: 'root'
})
export class TransactionsQuery extends QueryEntity<State, TransactionsResponseModel> {
  constructor(protected store: TransactionsStore) {
    super(store);
  }
}
