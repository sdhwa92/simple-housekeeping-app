import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerConfig, defineLocale, enGbLocale } from 'ngx-bootstrap';
import { TransactionsService } from '../../services/transactions.service';
import { BreadcrumbsModel } from '../../models/breadcrumbs.model';
import { TransactionsResponseModel } from '../../models/transactions-response.model';
import { TransactionsResolveModel } from '../../models/transactions-resolve.model';

import { Color, BaseChartDirective } from 'ng2-charts';

import LanguageSettings = DataTables.LanguageSettings;
import LanguagePaginateSettings = DataTables.LanguagePaginateSettings;
import ColumnSettings = DataTables.ColumnSettings;
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import * as _ from 'lodash';
import * as moment from 'moment';
declare var jQuery: any;

@Component({
  templateUrl: 'transaction.component.html'
})
export class TransactionComponent implements OnInit, OnDestroy {
  // takeUntil plus ngOnDestory pattern
  private _destroyed$ = new Subject();

  // Breadcrumbs array
  breadcrumbs: BreadcrumbsModel[] = [
    {name: 'Home', navigate: ['/admin']},
    {name: 'Transaction'}
  ];

  // Datepicker configurations
  bsConfig: Partial<BsDatepickerConfig>;

  // Transaction form group
  transactionForm: FormGroup;

  // Storing list of transactions
  transactions: TransactionsResponseModel[];
  dsSalaryIncomeTransactions: TransactionsResponseModel[];
  yiSalaryIncomeTransactions: TransactionsResponseModel[];
  ptIncomeTransactions: TransactionsResponseModel[];
  totalMonthIncomes: number[];
  totalMonthExpenses: number[];
  totalYearIncome;
  totalYearExpense;

  currentMonthNum: number;

  // Storing lis of options (accounts, transaction categories)
  accountOptions;
  transactionCategoryOptions;

  /**
   * Datatables API
   */
  private datatablesAPI: any;

  /**
   * Controls DataTables' smart column width handling
   */
  private autoWidth = false;

  /**
   * Controls DataTables' search (filtering) abilities
   */
  private searching = true;

  /**
   * Controls end user's ability to change the paging display length
   */
  private lengthChange = true;

  /**
   * Controls DataTables' information display field
   */
  private showInfo = false;

  /**
   * Changes the initial page length (number of rows per page)
   */
  private pageLength = 10;

  /**
   * Retrieve an existing DataTables instance
   */
  private retrieve = true;

  /**
   * Faster loading for DataTables
   */
  private bDeferRender = true;

  /**
   * Hide filtering for DataTables
   */
  private bFilter = false;

  private dom = 't<"col-sm-6"i><"col-sm-6"p>';

  private language: LanguageSettings = {
    search: '',
    searchPlaceholder: 'Search',
    emptyTable: `
        <i class="fa fa-car"></i>
        <h3>No Vehicles to display</h3>
      `,
    zeroRecords: `
        <i class="fa fa-ban"></i>
        <h3>No matching records found</h3>
      `,
    paginate: <LanguagePaginateSettings> {
      previous: '<',
      next: '>'
    }
  };

  /**
   * Column Definitions
   * Used to configure the columns behaviours and appearances
   */
  private columns: ColumnSettings[] = [
    { orderable: true, searchable: true, visible: true,  name: 'bank_account' },
    { orderable: true, searchable: true, visible: true,  name: 'transaction_type' },
    { orderable: true,  searchable: true,  visible: true,  name: 'category' },
    { orderable: true,  searchable: true,  visible: true,  name: 'is_fixed' },
    { orderable: true,  searchable: true,  visible: true,  name: 'transaction_date' },
    { orderable: true,  searchable: true,  visible: true, name: 'amount' }
  ];

  /**
   * Chart Configuration
   */
  public lineChartData;
  public lineChartLabels = [
    'July', 'August', 'September', 'October', 'November', 'December',
    'January', 'February', 'March', 'April', 'May', 'June'
  ];

  constructor(
    private _fb: FormBuilder,
    private transactionService: TransactionsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.getInitialData();
    this.currentMonthNum = this.transactionService.convertToAusMonthNumber();
  }

  ngOnInit(): void {
    this.configureDatePicker();
    this.buildReactiveForm();

    this.getYearTotals();
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();

    // Destroy Datatable when component is destroyed
    if ( this.datatablesAPI ) {
      this.datatablesAPI.destroy();
    }
  }

  private getInitialData() {
    this.route.data
      .pipe(
        map((data) => data['resolved']),
        takeUntil(this._destroyed$)
      )
      .subscribe(
        (results: TransactionsResolveModel) => {
          console.log(results);
          if (results.error) {
            console.log(results.error);
          } else {
            this.transactions = results.transactions;
            this.accountOptions = results.bankAccounts;
            this.transactionCategoryOptions = results.transactionCategories;
            this.dsSalaryIncomeTransactions = results.dsSalaryIncomeTransactions;
            this.yiSalaryIncomeTransactions = results.yiSalaryIncomeTransactions;
            this.ptIncomeTransactions = results.ptIncomeTransactions;
            this.createDataTable();
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  private buildReactiveForm(): void {
    this.transactionForm = this._fb.group({
      'bankAccount': ['', Validators.required],
      'transactionDate': ['', Validators.required],
      'transactionAmount': ['', Validators.required],
      'transactionType': ['', Validators.required],
      'isFixed': ['', Validators.required],
      'transactionCategory': ['', Validators.required]
    });
  }

  private createDataTable(): void {
    // timeout will let the view render then apply the datatables
    setTimeout(() => {
      // Always will let the view render then apply the datatables
      this.datatablesAPI = jQuery('table#transaction-table').DataTable({
        autoWidth: this.autoWidth,
        searching: this.searching,
        lengthChange: this.lengthChange,
        showInfo: this.showInfo,
        pageLength: this.pageLength,
        retrieve: this.retrieve,
        bDeferRender: this.bDeferRender,
        bFilter: this.bFilter,
        language: this.language,
        columns: this.columns,
        columnDefs: [
          {
            type: 'date-euro', targets: 'col-transaction-date'
          }
        ],
        dom: this.dom,
        order: [
          [4, 'desc']
        ]
      });
    });
  }

  private configureDatePicker(): void {
    defineLocale('en-gb', enGbLocale);
    this.bsConfig = {
      ...{
        showWeekNumbers: false,
        dateInputFormat: 'DD/MM/YYYY'
      }
    };
  }

  private getYearTotals() {
    this.totalMonthIncomes = this.transactionService.sumOfAnnualTransactionsEachMonth(this.transactions, 'income');
    console.log(this.totalMonthIncomes);
    this.totalMonthExpenses = this.transactionService.sumOfAnnualTransactionsEachMonth(this.transactions, 'expense');
    console.log(this.totalMonthExpenses);
    this.totalYearIncome = _.sum(this.totalMonthIncomes);
    this.totalYearExpense = _.sum(this.totalMonthExpenses);
    console.log('Total Year Income: ', this.totalYearIncome);
    console.log('Total Year Expense: ', this.totalYearExpense);
  }

  get getDsSalaryTotal() {
    return _.sum(this.transactionService.sumOfAnnualTransactionsEachMonth(this.dsSalaryIncomeTransactions, 'income'));
  }

  get getYiSalaryTotal() {
    return _.sum(this.transactionService.sumOfAnnualTransactionsEachMonth(this.yiSalaryIncomeTransactions, 'income'));
  }

  get getPtTotal() {
    return _.sum(this.transactionService.sumOfAnnualTransactionsEachMonth(this.ptIncomeTransactions, 'income'));
  }

  addTransaction(): void {
    console.log(this.transactionForm.value);
    this.transactionService.addTransaction(this.transactionForm.value)
      .pipe(
        takeUntil(this._destroyed$)
      )
      .subscribe(
      (res) => {
        alert('Transaction added successfully');
      },
      (err) => {
        console.log(err);
      },
      () => {
        // location.reload();
      }
    );
  }

  /**
   * Track items added or removed in the collection
   * @parameter index
   * @parameter item
   */
  trackByFn(index, item) {
    return index;
  }
}

