import { Component, OnInit } from '@angular/core';
import { NavigateServiceService } from '../service/navigate-service.service';
import { DataAccessService } from '../services/data-access.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  message: String = null;

  constructor(private navigationService: NavigateServiceService , private api: DataAccessService, private router: Router ) { }

  ngOnInit() {
  }

  checked(event) {
    // console.log(event);
    this.message = null;
  }
  login() {
    const phone = ( (document.getElementById('phone')) as HTMLInputElement).value;
    const pwd = ( (document.getElementById('pwd')) as HTMLInputElement).value;
    // let fd = new FormData();
    // fd.append('username', phone);
    // fd.append('password', pwd);
    console.log(phone);
    console.log(pwd);
    this.api.userLogin(phone , pwd).subscribe(data => {
      console.log(data);
      this.api.Token = data['token']
      console.log(this.api.Token);
      localStorage.setItem('token', data['token']);
      localStorage.setItem('isAdmin', 'true');
      this.router.navigate(['/orders']);
    }, err => {
      console.log(err.error.detail);
      this.message = err.error.detail;
    } );
  }
}
