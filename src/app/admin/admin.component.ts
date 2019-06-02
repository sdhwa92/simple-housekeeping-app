import { Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { SidebarNavigationComponent } from '../layout/sidebar-navigation/sidebar-navigation.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, AfterViewInit {
  // Template References
  @ViewChild('pageWrapper') pageWrapper: ElementRef;
  @ViewChild('sidebar') sidebar: SidebarNavigationComponent;

  // Window Width
  innerWidth: number;

  // Window Height
  innerHeight: number;

  /**
   * Listen for Window Resizing
   */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    this.updatePageHeight();
    this.updateSidebarHeight();
  }

  /**
   * Constructor
   */
  constructor() { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
  }

  /**
   * Trigger Updates
   */
  ngAfterViewInit() {
    this.updatePageHeight();
    this.updateSidebarHeight();
  }

  /**
   * Dynamically set the Page Height
   *
   * Set #page-wrapper height
   */
  updatePageHeight() {
    if (this.sidebar) {
      const sidebarHeight = this.sidebar.getHeight();
      // if sidebar height is bigger then the window height, use that instead
      const finalHeight = sidebarHeight > this.innerHeight ? sidebarHeight : this.innerHeight;
      this.pageWrapper.nativeElement.style.minHeight = `${finalHeight}px`;
    } else {
      this.pageWrapper.nativeElement.style.minHeight = `${this.innerHeight}px`;
    }
  }

  /**
   * Dynamically set the Sidebar Height
   *
   * Set .navbar-static-side height
   */
  updateSidebarHeight() {
    this.sidebar.updateHeight( this.innerWidth > 768 ? this.innerHeight : null );
  }
}
