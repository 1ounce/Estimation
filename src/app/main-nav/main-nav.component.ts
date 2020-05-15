import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { NavigateServiceService } from '../service/navigate-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,private navigatorSerice: NavigateServiceService , private route: Router) {}
b24;b22;bs;s24;s22;ss;name;phone;navigateToRate;
  reportPage() {
    this.navigatorSerice.navigateToReport();
  }
  orderPage() {
    this.navigatorSerice.navigateToOrders();
  }

  allWorks() {
    this.navigatorSerice.navigateToAllWorks();
  }

  report() {
    this.navigatorSerice.navigateTOReport();
  }
  
  logout() {
    console.log("logged out");
    localStorage.clear();
    this.route.navigate(['/login']);
  }
}
