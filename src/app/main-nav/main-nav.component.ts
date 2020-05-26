import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { NavigateServiceService } from '../service/navigate-service.service';
import { Router } from '@angular/router';
import { DataAccessService } from '../services/data-access.service';

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
  rates: Object;
  gold916: any;
  silver: any;

  constructor(private breakpointObserver: BreakpointObserver,private navigatorSerice: NavigateServiceService ,private api: DataAccessService, private route: Router) {
    this.api.getRate().subscribe( data => {
      this.rates = data ;
      console.log(this.rates);
      this.gold916 = this.rates['gold'];
      this.silver = this.rates['silver'];
      
    });
  }
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
  goToRepairEstimation() {
    this.navigatorSerice.navigateToRepaireEstimation();
  }
  goToOrderEstimation() {
    this.navigatorSerice.navigateToOrderEstimation();
    }
}
