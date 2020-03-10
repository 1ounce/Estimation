import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { NavigateServiceService } from '../service/navigate-service.service';

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

  constructor(private breakpointObserver: BreakpointObserver,private navigatorSerice:NavigateServiceService) {}
b24;b22;bs;s24;s22;ss;name;phone;navigateToRate;logout;
  reportPage() {
    this.navigatorSerice.navigateToReport();
  }
  orderPage() {
    this.navigatorSerice.navigateToOrders();
  }

  allWorks() {
    this.navigatorSerice.navigateToAllWorks();
  }

}
