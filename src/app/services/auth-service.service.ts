import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor() { }

  isAdmin() {
    if (localStorage.getItem('isAdmin') === 'true') {
      return true;
    }
    return false;
  }
}
