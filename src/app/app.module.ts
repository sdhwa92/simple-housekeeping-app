/**
 * Angular Modules
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

/**
 * Add-on Modules
 */
import { AdminModule } from './admin/admin.module';
import { ChartsModule } from 'ng2-charts';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { DataTablesModule } from 'angular-datatables';

/**
 * Providers
 */
import { CoolSessionStorage } from '@angular-cool/storage';
import { HBWebAPI } from './services/hb-web-api.service';
import { SidebarService } from './layout/sidebar-navigation/sidebar.service';
import { TransactionsService } from './services/transactions.service';

/**
 * Modules
 */
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './admin/shared.module';

/**
 * Components
 */
import { AppContentComponent } from './layout/app.content';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TransactionComponent } from './components/transaction/transaction.component';

@NgModule({
  declarations: [
    AppContentComponent,
    AppComponent,
    DashboardComponent,
    TransactionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AdminModule,
    SharedModule,
    ChartsModule,
    BsDatepickerModule.forRoot(),
    DataTablesModule
  ],
  providers: [
    CoolSessionStorage,
    HBWebAPI,
    SidebarService,
    TransactionsService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppContentComponent]
})
export class AppModule { }
