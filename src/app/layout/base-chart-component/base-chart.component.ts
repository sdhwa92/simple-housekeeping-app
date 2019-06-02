import { Component, Input, OnInit } from '@angular/core';

/*Models*/
import { ChartDataConfigModel } from '../../models/chart-config.model';

@Component({
  selector: 'app-base-chart',
  templateUrl: 'base-chart.component.html'
})
export class BaseChartComponent implements OnInit {
  @Input() chartlabels;
  @Input() chartType = 'bar';
  @Input() chartLegend = true;
  @Input() chartData: ChartDataConfigModel[];

  public chartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  constructor() {}

  ngOnInit(): void {
  }

}