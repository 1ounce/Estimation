import { Component, OnInit } from '@angular/core';
import { NavigateServiceService } from '../service/navigate-service.service';
import {FormControl, Validators} from '@angular/forms';

import { isNgTemplate } from '@angular/compiler';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {AlertModule} from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';


import {Repair, RepairItem} from '../Models/Repair';
import {DataAccessService } from '../services/data-access.service';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import { delay } from 'rxjs/operators';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-repair-estimation',
  templateUrl: './repair-estimation.component.html',
  styleUrls: ['./repair-estimation.component.css']
})
export class RepairEstimationComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);
  repair: Repair = new Repair();
  advancemodal: BsModalRef = null;
  selectedUser: Object;
  userId = null;
  isSaveClicked: boolean = false;
  // user: Object;

    constructor(private modalService: BsModalService, private api: DataAccessService, private navigatorSerice: NavigateServiceService,
                private snackBar: MatSnackBar , private datepipe: DatePipe) {}

  ngOnInit() {
    this.repair.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy');
    this.api.getRate().subscribe( data => {
      console.log(data);
      this.repair.rate = data['gold'] ;
      
    });
  }


  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

    addItem() {
      this.repair.saveOrder();
      this.repair.refereshcurrentItem();
    }

     addAdvance() {
      this.repair.saveAdvance();
      this.repair.refreshAdvanceItem();
    }

    saveAdvance() {
      if (this.repair.advanceItem.amount > 0) {
      this.addAdvance();
      this.advancemodal.hide();
      } else {
        this.advancemodal.hide();
      }
    }

    people(phone) {
      if (phone.length < 1) {
      this.selectedUser = null;
      }
      this.repair.customerItem.name = '';
      this.repair.customerItem.email = '';
      this.repair.customerItem.address = '';
      console.log(phone);
      if (phone.length >= 5) {
        this.api.getPeople(phone).subscribe(data => {
          this.selectedUser = data['results'];
          console.log(this.selectedUser);
        });
      }
    }
    onuserClicked(user) {
      console.log(user);
      this.userId = user.id;
      this.repair.customerItem.name = user.name;
      this.repair.customerItem.email = user.email;
      this.repair.customerItem.phone = user.phone;
      this.repair.customerItem.address = user.address;
      this.selectedUser = null;
      if (user.id != null) {
        this.repair.customer = user.id;
      }

    }
   
  openAdvanceModal(template) {
    this.advancemodal = this.modalService.show(
      template,
      Object.assign({})
    );
    this.advancemodal.setClass('modal-lg');
  }

  saveData() {
    console.log(this.userId);
    if (this.userId === null) {
      this.api.savePeople(this.repair.customerItem).subscribe(data => {
        console.log(data);
        this.repair.customer = data['id'];
        this.saveRepairOrder();
      });
    } else {
      this.saveRepairOrder();
    }
}

money(data) {
  if (data != null) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(data); }
  }

  refresh(){
    window.location.reload();
}

addDate(event) {
console.log(event['value']);
this.repair.date = this.datepipe.transform(event['value'], 'dd/MM/yyyy');
console.log(this.repair.date);
}

  saveRepairOrder() {
    this.repair.saveOrder();
    console.log(this.repair);
    if (!this.isSaveClicked) {
      this.isSaveClicked = true;
      this.api.saveRepairOrderTODB(this.repair).toPromise().then(data => {console.log(data); 
                                                                   this.navigatorSerice.navigateToReport();
    }).catch( error => {
      this.snackBar.open('Failed to save data');
      console.log(error);
      setTimeout(() =>  this.snackBar.dismiss() , 2000);
      this.isSaveClicked = false;

    });
  }
   }

}
