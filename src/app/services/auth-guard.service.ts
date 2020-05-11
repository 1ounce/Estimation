import { Injectable } from '@angular/core';
import { AuthServiceService } from '../services/auth-service.service';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private authService: AuthServiceService, private router: Router) { }

  // tslint:disable-next-line: max-line-length
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.authService.isAdmin()) {
      console.log('true');
      return true;
      
    }
    this.router.navigate(['/login']);
    return false;
  }
}
