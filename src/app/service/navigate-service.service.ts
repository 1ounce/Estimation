import { Injectable } from '@angular/core';
import { Routes, RouterModule, Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class NavigateServiceService {

  constructor(private route:Router) { }

  navigateToReport(){
    this.route.navigate(['/repair']);
  }
  navigateToOrders(){
    this.route.navigate(['/orders']);
  }
}
