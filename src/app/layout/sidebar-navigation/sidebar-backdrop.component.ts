import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidebarService } from './sidebar.service';
import { Subscription } from 'rxjs';

/**
 * Component for Sidebar Backdrop's view and logic.
 * This is used to dismiss the mobile menu when clicking off the menu
 */
@Component({
  selector: 'app-sidebar-backdrop',
  template: `<div class="sidebar-backdrop-overlay" (click)="toggleSidebar()" *ngIf="isActive"></div>`,
  styles: [`
      :host .sidebar-backdrop-overlay {
          top: 0;
          bottom: 0;
          left: 220px;
          right: 0;
          position: fixed;
          opacity: 0.7;
          z-index: 1;
      }
  `]
})
export class SidebarBackdropComponent implements OnInit, OnDestroy {
  /**
   * Activate the Sidebar Backdrop
   */
  isActive = false;

  /**
   * onMinimise Subscriber listens for state change in the sidebar
   */
  private onMinimise$: Subscription;

  constructor(
    private sidebarService: SidebarService
  ) {}

  /**
   * Set the initial state of the backdrop (when route changes and reloads).
   * Setup the onMinimise listener and update the isActive status
   */
  ngOnInit(): void {
    this.isActive = this.sidebarService.isSmall && this.sidebarService.isCollapsed;

    this.onMinimise$ = this.sidebarService.onMinimise.subscribe((collapsed) => {
      this.isActive = this.sidebarService.isSmall && collapsed;
    });
  }

  /**
   * Clean up and Unsubscribe from onMinimise listener
   */
  ngOnDestroy(): void {
    this.onMinimise$.unsubscribe();
  }

  /**
   * Toggle the Sidebar to Collapse
   */
  toggleSidebar() {
    this.sidebarService.toggleCollapse();
  }
}
