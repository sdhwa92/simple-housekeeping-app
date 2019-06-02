import { Component, OnInit, AfterViewInit, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from './sidebar.service';
import { Subscription } from 'rxjs';
declare var jQuery: any;

/**
 *  Component for Sidebar Navigation's view and logic
 */
@Component({
  selector: 'app-sidebar-navigation',
  templateUrl: './sidebar-navigation.component.html'
})
export class SidebarNavigationComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Navigation Visibility
   *
   * @type {boolean}
   */
  isVisible: any = {};

  /**
   * Currently selected main menu
   */
  selectedMainMenu = '';
  private onMinimise$: Subscription;
  private onResize$: Subscription;

  constructor(
    private router: Router,
    private elRef: ElementRef,
    private sidebarService: SidebarService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    if (this.router.url) {
      this.selectedMainMenu = this.router.url;
    }
  }

  ngAfterViewInit(): void {
    // Toggle Default state
    if (this.sidebarService.isCollapsed) {
      if (this.sidebarService.isSmall) {
        this.sidebarService.isCollapsed = false;
      } else {
        // trigger initial collapsed
        this.minimize(true);
      }
    }

    jQuery('#side-menu').metisMenu();

    this.onResize$ = this.sidebarService.onResize.subscribe();
    this.onMinimise$ = this.sidebarService.onMinimise.subscribe((e) => { this.minimize(e); });
  }

  ngOnDestroy(): void {
    if (typeof this.onResize$ !== 'undefined') {
      this.onResize$.unsubscribe();
    }

    if (typeof this.onMinimise$ !== 'undefined') {
      this.onMinimise$.unsubscribe();
    }
  }

  /**
   * Update Selected Main Menu
   * @param newValue
   */
  selectMenu(newValue: string) {
    this.selectedMainMenu = this.selectedMainMenu === newValue ? null : newValue;
  }

  activeRoute(routename: string): boolean {
    return this.router.url.indexOf(routename) > -1;
  }

  activeRoutesub(routename: string): boolean {
    return this.router.url.indexOf(routename) > -1;
  }

  activeRouteStartsWith(routename: string): boolean {
    return this.router.url.indexOf(routename) === 0;
  }

  minimize( collapsed ) {
    let body = jQuery('body');

    let animationEnd = (function(el) {
      let animations = {
        animation: 'animationend',
        OAnimation: 'oAnimationEnd',
        MozAnimation: 'mozAnimationEnd',
        WebkitAnimation: 'webkitAnimationEnd',
      };

      for (let t in animations) {
        if (el.style[t] !== undefined) {
          return animations[t];
        }
      }
    })(document.createElement('div'));

    if (collapsed) {
      this.renderer.addClass(document.body, 'mini-navbar');
    } else {
      this.renderer.removeClass(document.body, 'mini-navbar');
    }

    jQuery('sidebar-navigation').one(animationEnd, function() {
      jQuery('sidebar-navigation').removeClass('fadeIn')
    });

    jQuery('sidebar-navigation').addClass('fadeIn');
  }

  /**
   * Update the Sidebar height
   * @param height
   */
  updateHeight(height) {
    this.elRef.nativeElement.style.minHeight = height ? `${height}px` : '';
  }

  /**
   * Get the Sidebar height
   */
  getHeight() {
    return this.elRef.nativeElement.offsetHeight;
  }
}
