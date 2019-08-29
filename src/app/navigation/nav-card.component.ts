import { Component, OnInit }        from '@angular/core';
import { Router, RouterModule, Routes, RouterLinkActive, ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-nav-card',
  templateUrl: './nav-card.component.html',
  styleUrls: ['./nav-card.component.scss']
})
export class NavCardComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {}

  navItems: any[] = [
    {name: 'Transactions', path: '/transactions', icon: 'icon-text-document'},
    {name: 'Activity', path: '/activities', icon: 'icon-list'}
    ];

  activeLink(routerLink) {
    return routerLink === this.router.url;
  }
}
