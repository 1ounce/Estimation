import { Component, OnInit } from '@angular/core';
import { NavigateServiceService } from '../service/navigate-service.service';
import {FormControl, Validators} from '@angular/forms';


@Component({
  selector: 'app-repair-estimation',
  templateUrl: './repair-estimation.component.html',
  styleUrls: ['./repair-estimation.component.css']
})
export class RepairEstimationComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);

  constructor() { }

  ngOnInit() {
  }


  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

}
