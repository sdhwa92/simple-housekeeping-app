import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionsService, GLOBAL_VARIABLES } from '../../services/transactions.service';
import { first, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';

/*Models*/
import { TransactionsResponseModel } from '../../models/transactions-response.model';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  // takeUntil plus ngOnDestory pattern
  private _destroyed$ = new Subject();

  public incomesEachMonth = [];
  public expensesEachMonth = [];

  @ViewChild('baseChart') chart: BaseChartDirective;

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels = GLOBAL_VARIABLES.FINANCIAL_YEAR_MONTH;
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [
    {data: this.expensesEachMonth, label: 'Expense'},
    {data: this.incomesEachMonth, label: 'Income'}
  ];

  constructor(
    private transactionService: TransactionsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.getInitialData();
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  private getInitialData() {
    this.route.data
      .pipe(
        map((data) => data['resolved']),
        first()
      )
      .subscribe(
        (results) => {
          console.log(results);
          if (results.error) {
            console.log(results.error);
          } else {
            this.incomesEachMonth = results.sumOfIncomes;
            this.expensesEachMonth = results.sumOfExpenses;
          }
        },
        (err) => {
          console.log(err);
        },
        () => {
          console.log('Complete');
          console.log(this.chart);
          if ( this.chart !== undefined) {
            console.log('Destroy');
            this.chart.ngOnDestroy();
            this.chart.chart = this.chart.getChartBuilder(this.chart.ctx);
          }
        }
      );
  }
}
