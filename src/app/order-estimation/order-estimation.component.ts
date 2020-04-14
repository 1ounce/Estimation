import { Component, OnInit, TemplateRef } from '@angular/core';

import {FormControl, Validators} from '@angular/forms';
import { isNgTemplate } from '@angular/compiler';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {AlertModule} from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';


import {Order, OrderItem} from '../Models/Order';
import {DataAccessService } from '../services/data-access.service';
import {HttpClient} from '@angular/common/http';
import { NavigateServiceService } from '../service/navigate-service.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { delay } from 'rxjs/operators';




interface Item {
  description: String;
  amount: number;
}

@Component({
  selector: 'app-order-estimation',
  templateUrl: './order-estimation.component.html',
  styleUrls: ['./order-estimation.component.css']
})

// var orderItemList:OrderItem[];




export class OrderEstimationComponent implements OnInit {
  order: Order = new Order();
  isdisabled = false;
  selectedOrderType: String = 'gold' ;
  email = new FormControl('', [Validators.required, Validators.email]);
  modalRef: BsModalRef = null;
  advancemodal: BsModalRef = null;
  makingChargeModalItem: OrderItem = null;
  isMakingChargeModal: Boolean = true;
  isSaveClicked: Boolean = false;
  selectedUser: Object;
  userId = null ;
  rates: Object;
  constructor(private modalService: BsModalService, private api: DataAccessService, private navigatorSerice: NavigateServiceService,
              private snackBar: MatSnackBar) {}

  addItem() {
      this.order.saveOrder();
      this.order.refereshcurrentItem();
    }

    addOldGold() {
      this.order.saveoldGold();
      this.order.referesholdGoldItem();
    }
    addAdvance() {
      this.order.saveAdvance();
      this.order.refreshAdvanceItem();
    }

    saveAdvance() {
      if (this.order.advanceItem.amount > 0) {
      this.addAdvance();
      this.advancemodal.hide();
      } else {
        this.advancemodal.hide();
      }
    }
    onSelectedOrderType(val: any) {
      this.order.orderType = val;
      console.log(this.order.orderType);
      if (this.order.orderType === 'silver') {
        this.order.rate = this.rates['silver'];
      }
    }
    checkSelected() {
      if (this.isdisabled === true) {
        this.isdisabled = false;
      } else {
        this.isdisabled = true;
      }
      this.order.rate = 0;
      this.order.ncr = this.isdisabled;
      this.order.rateChanged();
      console.log(this.order.ncr);
    }

    saveMakingCharge() {


      console.log('saving making charges on whole');
      this.makingChargeModalItem.saveMakingCharge(!this.isMakingChargeModal);
      // this.order.currentItem.saveMakingCharge();
      this.order.generateOrderSubTotal();
      this.modalRef.hide();

    }

    people(phone) {
      if (phone.length < 1) {
      this.selectedUser = null;
      }
      this.order.customerItem.name = '';
      this.order.customerItem.email = '';
      this.order.customerItem.address = '';
      console.log(phone);
      if (phone.length >= 5) {
        this.api.getPeople(phone).subscribe(data => {
          this.selectedUser = data;
          console.log(this.selectedUser);
        });
      }
    }
    onuserClicked(user) {
      console.log(user);
      this.userId = user.id;
      this.order.customerItem.name = user.name;
      this.order.customerItem.email = user.email;
      this.order.customerItem.phone = user.phone;
      this.order.customerItem.address = user.address;
      this.selectedUser = null;
      if (user.id != null) {
        this.order.customer = user.id;
      }

    }

  ngOnInit() {
    this.api.getRate().subscribe( data => {
      this.rates = data ;
      console.log(this.rates);
      this.order.rate = this.rates['gold'];
    });

    // orderItemList.push(new OrderItem("gold24 Ring I1234",2,3,4));

  }


  openMakingChargeModal(template: TemplateRef<any>, isMakingChargeModal: Boolean= true) {

    console.log('Making charge modal' + isMakingChargeModal);

    this.isMakingChargeModal = isMakingChargeModal;


    this.makingChargeModalItem = this.order.currentItem;

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'side-modal' })
    );
    this.modalRef.setClass('modal-lg');

    // this.modalRef = this.modalService.show(template);
  }


  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

  money(data) {return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(data); }


  openSelectedMakingChargeModal(itemPosition: number, template, isMakingChargeModal= true) {
     this.isMakingChargeModal = isMakingChargeModal;
     this.makingChargeModalItem = this.order.items[itemPosition];
     this.modalRef = this.modalService.show(
        template,
        Object.assign({}, {class: 'side-modal'})
      );
     this.modalRef.setClass('modal-lg');

  }

  openAdvanceModal(template) {
    this.advancemodal = this.modalService.show(
      template,
      Object.assign({})
    );
    this.advancemodal.setClass('modal-lg');
  }


   saveData() {
      if (this.userId === null) {
        this.api.savePeople(this.order.customerItem).subscribe(data => {
          console.log(data);
          this.order.customer = data['id'];
          this.saveOrder();
        });
      } else {
        this.saveOrder();
      }
  }

  saveOrder() {
    this.order.saveOrder();
    console.log(this.order);
    if (!this.isSaveClicked) {
      this.isSaveClicked = true;
      this.api.saveOrderToDB(this.order).toPromise().then(data => {console.log(data);
                                                                   this.navigatorSerice.navigateToOrders();
    }).catch( error => {
      this.snackBar.open('Failed to save data');
      console.log(error);
      setTimeout(() =>  this.snackBar.dismiss() , 2000);
      this.isSaveClicked = false;

    });


    // this.api.saveOrderToDB(this.order).subscribe(success=>{console.log(success);},error=>{console.log(error);});
    }
  }



}
