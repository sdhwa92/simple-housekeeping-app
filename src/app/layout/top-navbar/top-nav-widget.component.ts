import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-top-nav-widget',
  templateUrl: 'top-nav-widget.component.html'
})
export class TopNavWidgetComponent implements OnInit {
  private _allowSettings = false;
  private _title = '';
  private _allowSave = false;
  private _allowBackToResults = false;
  private _backToResultsUrl = '';
  private _breadcrumbs: Array<any> = [];
  private _settingsRoute: any[];

  @Input()
  label = '';

  @Input()
  classicTooltipText = '';

  @Input()
  classicLabel = 'Return to Classic View';

  // if not provided, will emit the onClassicClick = true
  @Input()
  classicUrlPath: string;

  @Output() onClassicClick: EventEmitter<boolean> = new EventEmitter();

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  @Input()
  get breadcrumbs(): Array<any> {
    return this._breadcrumbs;
  }

  set breadcrumbs(value: Array<any>) {
    this._breadcrumbs = value;
  }

  @Input()
  get allowSave(): boolean {
    return this._allowSave;
  }

  set allowSave(value: boolean) {
    this._allowSave = value;
  }

  @Input()
  get allowBackToResults(): boolean {
    return this._allowBackToResults;
  }

  set allowBackToResults(value: boolean) {
    this._allowBackToResults = value;
  }

  @Input()
  get backToResultsUrl(): string {
    return this._backToResultsUrl;
  }

  set backToResultsUrl(value: string) {
    this._backToResultsUrl = value;
  }


  @Input()
  get allowSettings(): boolean {
    return this._allowSettings;
  }

  set allowSettings(value: boolean) {
    this._allowSettings = value;
  }

  @Input()
  get settingsRoute(): any[] {
    return this._settingsRoute;
  }

  set settingsRoute(value: any[]) {
    this._settingsRoute = value;
  }

  settingsPage() {
    this.router.navigate( this._settingsRoute );
  }

  /**
   * @deprecated  Use setTitle Instead
   */
  @Input()
  get title(): string {
    return this._title;
  }

  set title(title: string) {
    this._title = (title && title.trim()) || '';
  }

  /**
   * Set the Title Text
   */
  @Input()
  get setTitle(): string {
    return this._title;
  }

  set setTitle(title: string) {
    this._title = (title && title.trim()) || '';
  }

  ngOnInit(): void {
  }

  navigateToPage()
  {
    let url = this.backToResultsUrl;
    this.router.navigate([url]);
  }
}
