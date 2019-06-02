import { Injectable } from '@angular/core';
import { of as observableOf, } from 'rxjs';
import * as _ from 'lodash';

export const HB_WEB_API_PATH = {
  ENDPOINT: 'http://localhost:5000',
  ENDPOINTS: {
    TRANSACTION: {
      GET: 'transaction',
      POST: 'transaction/add',
      GET_INCOMES_BY_CATEGORY: 'transaction/annual/income/{year}/{categoryId}'
    },
    BANK_ACCOUNT: {
      GET: 'accounts'
    },
    CATEGORIES: {
      GET: 'categories'
    }
  }
};

@Injectable()
export class HBWebAPI {
  /**
   * Handle API Exceptions
   *
   * @param error
   * @param returnValue
   * @returns {ErrorObservable}
   */
  static handleError( error: any, returnValue: any = {}) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let message = 'Authentication Error';
    try {
      if ( error['_body'] ) {
        let json = JSON.parse( error['_body'] );
        if ( json ) {
          message = json.error_description;
          if (message) {
            return observableOf( message );
          }
        }
      }
      return observableOf( returnValue );
    } catch (exception) {
      return observableOf( returnValue );
    }
    // return Observable.throw( message );
  }

  static prepareURI( URI: string, replacements: any = {}) {
    // console.log(URI, replacements);
    _.each(replacements, (value: string, key: string) => {
      // console.log(URI, value, key);
      let find = new RegExp('{' + key + '}');
      URI = URI.replace( find, value );
    });
    // console.log(URI);
    return URI;
  }
}
