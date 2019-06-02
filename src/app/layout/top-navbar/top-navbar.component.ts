import { Component, Renderer2 } from '@angular/core';
import { SidebarService } from '../sidebar-navigation/sidebar.service';

/**
 *  Top Navbar Component
 *
 *  Handles view and logic on the main Admin template.
 */
@Component({
  selector: 'app-top-navbar',
  templateUrl: 'top-navbar.component.html',
  styles: [``]
})
export class TopNavbarComponent {
  constructor(
    private sidebarService: SidebarService,
    private renderer: Renderer2
  ) {}

  /**
   * Transforms current UI into compact version
   */
  minimalize() {
    this.sidebarService.toggleCollapse();
  }
}
