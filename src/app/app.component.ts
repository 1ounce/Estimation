import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'reportPanel';


  get_login_info(){
    if(localStorage.getItem("token")==null || localStorage.getItem("token")==undefined){

      return false;
    }
    return true;
  }
}
