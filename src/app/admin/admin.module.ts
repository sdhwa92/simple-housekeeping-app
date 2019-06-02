import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { SharedModule } from './shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { SidebarNavigationComponent } from '../layout/sidebar-navigation/sidebar-navigation.component';
import { SidebarBackdropComponent } from '../layout/sidebar-navigation/sidebar-backdrop.component';
import { TopNavbarComponent } from '../layout/top-navbar/top-navbar.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ],
  declarations: [
    SidebarNavigationComponent,
    SidebarBackdropComponent,
    TopNavbarComponent,
    AdminComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminModule {}
