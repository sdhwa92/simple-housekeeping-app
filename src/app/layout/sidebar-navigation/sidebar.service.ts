import { fromEvent as observableFromEvent,  Observable, Subject } from 'rxjs';
import { tap, map, debounceTime } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CoolSessionStorage } from '@angular-cool/storage';

/**
 * Sidebar Service for common variables and listeners
 */
@Injectable()
export class SidebarService {
  /**
   * is the current viewport a mobile/tablet size?
   */
  isSmall = false;

  /**
   * Is the Menu Currently Collapsed?
   * Get State in sessionStorage
   * @returns {boolean}
   */
  get isCollapsed(): boolean {
    return this.sessionStorage.getObject('/isCollapsed');
  }

  /**
   * Set State in sessionStorage
   * @param {boolean} state
   */
  set isCollapsed( state: boolean ) {
    this.sessionStorage.setObject('/isCollapsed', state);
  }

  /**
   * onMinimise to update subscribers of change
   */
  onMinimise = new Subject<boolean>();

  /**
   * onResize to update subscribers of change
   */
  onResize: Observable<{width: number, height: number}>;

  /**
   * isMobile screen size threshold (this is tided to CSS max-width, see _navigation.scss)
   */
  private smallThreshold = 768;

  /**
   * Track the current screen size
   */
  private screenSize: any;

  /**
   * Setup Listener and isMobile state
   */
  constructor(private sessionStorage: CoolSessionStorage) {
    // Register Listener
    this.resizeListener();

    // Set Initial State
    this.isSmall = window.innerWidth <= this.smallThreshold;
  }

  /**
   * onResize listener setup (Singleton)
   */
  private resizeListener() {
    // Create 1 Observable
    if ( this.onResize instanceof Observable === false ) {
      // Listen for window to resize and update the body class
      this.onResize = observableFromEvent( window, 'resize' ).pipe(
        debounceTime( 100 ),
        map( ( event: any ) => {
          // Extract the window width and height from the event
          return {
            width: event.target.innerWidth,
            height: event.target.innerHeight
          };
        } ),
        tap( ( screenSize ) => {
          // Get the previous width, if any (or use current)
          const previousWidth = this.screenSize && this.screenSize.width ? this.screenSize.width : screenSize.width;

          // Update Mobile/Tablet State
          this.isSmall = screenSize.width <= this.smallThreshold;

          // Keep reference to the screen size
          this.screenSize = screenSize;

          // trigger collapse when entering the small state
          if ( this.isSmall && (previousWidth > this.smallThreshold) ) {
            this.toggleCollapse(false);
          }
        } ));
    }
  }

  /**
   * Toggle Collapse of Menu
   */
  toggleCollapse( isCollapsed = null ) {
    // Update Collapsed State
    this.isCollapsed = isCollapsed !== null ? isCollapsed : !this.isCollapsed;

    // Inform Subscribers
    this.onMinimise.next( this.isCollapsed );
  }
}
