import { Component, Input, OnInit } from '@angular/core';

/*Models*/
import { ChartDataConfigModel } from '../../models/chart-config.model';
import { Color } from 'ng2-charts';

@Component({
  selector: 'app-bar-chart',
  templateUrl: 'bar-chart.component.html'
})
export class BarChartComponent implements OnInit {
  @Input() chartLabels: string[];
  @Input() chartType = 'bar';
  @Input() chartLegend = true;
  @Input() chartData: ChartDataConfigModel[];
  @Input() chartColors: Color[];

  public chartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  constructor() {

  }

  ngOnInit(): void {
    console.log(this.chartLabels);
    console.log(this.chartData);
  }
}
