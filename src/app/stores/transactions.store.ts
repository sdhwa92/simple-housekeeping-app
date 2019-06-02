import { TransactionsResponseModel } from '../models/transactions-response.model';
import { EntityState, EntityStore } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface State extends EntityState<TransactionsResponseModel> {}

@Injectable({
  providedIn: 'root'
})
export class TransactionsStore extends EntityStore<State, TransactionsResponseModel> {
  constructor() {
    super();
    // super(initialState);
  }
}
