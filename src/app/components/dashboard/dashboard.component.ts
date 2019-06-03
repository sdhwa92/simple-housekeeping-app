/*Cores*/
import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentFactory } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/*Components*/
import { BaseChartComponent } from '../../layout/base-chart-component/base-chart.component';
import { BarChartComponent } from '../../layout/bar-chart-component/bar-chart.component';

/*Services*/
import { TransactionsService, GLOBAL_VARIABLES } from '../../services/transactions.service';

/*Models*/
import { TransactionsResponseModel } from '../../models/transactions-response.model';

/*3rd Party*/
import { first, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  // takeUntil plus ngOnDestory pattern
  private _destroyed$ = new Subject();

  public incomesEachMonth = [];
  public expensesEachMonth = [];

  @ViewChild('monthIncomeAndExpenseChart', { read: ViewContainerRef }) monthIncomeAndExpenseChartContainer: ViewContainerRef;

  constructor(
    private transactionService: TransactionsService,
    private resolver: ComponentFactoryResolver,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.getInitialData();
    console.log(this.monthIncomeAndExpenseChartContainer);
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  createChartComponent(chartType: 'bar') {
    if ( chartType === 'bar' ) {
      this.monthIncomeAndExpenseChartContainer.clear();
      const factory = this.resolver.resolveComponentFactory(BarChartComponent);
      const componentRef = this.monthIncomeAndExpenseChartContainer.createComponent(factory);
      componentRef.instance.chartLabels = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
      componentRef.instance.chartData = [
        {data: this.incomesEachMonth, label: 'Income'},
        {data: this.expensesEachMonth, label: 'Expense'}
      ];
      componentRef.instance.chartColors = [
        {
          // Blue
          backgroundColor: 'rgb(0, 153, 255)',
          borderColor: 'rgb(0, 138, 230)'
        },
        {
          // Red
          backgroundColor: 'rgb(255, 80, 80)',
          borderColor: 'rgb(255, 51, 51)'
        }
      ];
    }
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
          console.log(this.incomesEachMonth);
          console.log(this.expensesEachMonth);
          this.createChartComponent('bar');
        }
      );
  }
}
