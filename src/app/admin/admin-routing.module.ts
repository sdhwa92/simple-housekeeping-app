import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { TransactionComponent } from '../components/transaction/transaction.component';
import { DashboardResolver } from '../components/dashboard/dashboard.resolver';
import { TransactionResolver } from '../components/transaction/transaction.resolver';

const appAdminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
        data: {title: 'Welcome to Dashboard'},
        resolve: {
          resolved: DashboardResolver
        }
      }
    ]
  },
  {
    path: 'transaction',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: TransactionComponent,
        resolve: {
          resolved: TransactionResolver
        }
      }
    ]
  }
];

@NgModule( {
  imports: [
    RouterModule.forChild(appAdminRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    DashboardResolver,
    TransactionResolver
  ]
})
export class AdminRoutingModule {}
