import { Component, OnInit, TemplateRef } from '@angular/core';
import {FormControl, Validators, FormGroup} from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import {Order, OrderItem} from '../Models/Order';
import {DataAccessService } from '../services/data-access.service';
import { NavigateServiceService } from '../service/navigate-service.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { DatePipe} from '@angular/common';


@Component({
  selector: 'app-order-estimation',
  templateUrl: './order-estimation.component.html',
  styleUrls: ['./order-estimation.component.css']
})

export class OrderEstimationComponent implements OnInit {
  order: Order = new Order();
  isdisabled = false;
  selectedOrderType: String = 'gold' ;
  email = new FormControl('', [Validators.required, Validators.email]);
  modalRef: BsModalRef = null;
  advancemodal: BsModalRef = null;
  popupmodal: BsModalRef = null;
  makingChargeModalItem: OrderItem = null;
  isMakingChargeModal: Boolean = true;
  isSaveClicked: Boolean = false;
  selectedUser: Object;
  userId = null ;
  rates: Object;
  gold916;silver;
  date = new Date((new Date())); 
  testForm : FormGroup;
  constructor(private modalService: BsModalService, private api: DataAccessService, private navigatorSerice: NavigateServiceService,
              private snackBar: MatSnackBar, private datepipe: DatePipe ) {

              }

    keyup(event , val) {
      console.log(event.target.value);
      console.log(val);
      if (event.target.value[0] === '.' && val === 1) {
        this.order.currentItem.weight = '0' + event.target.value;
      }
      if (event.target.value[0] === '.' && val === 2) {
        this.order.oldGoldItem.weight =  '0' + event.target.value;
      }
      if (event.target.value[0] === '.' && val === 3) {
        this.order.oldGoldItem.dust =  '0' + event.target.value;
      }
    }

  addItem() {
      this.order.saveOrder();
      this.order.refereshcurrentItem();

    }

    addOldGold() {
      this.order.saveoldGold();
      this.order.referesholdGoldItem();
      this.order.generateOldGoldSubTotal();
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
      if ( val === 'gold') {
        this.order.type = '0';
        this.rateAssign(this.order.type);
      } else {
        this.order.type = '1';
        this.rateAssign(this.order.type);
      }
    }

      rateAssign(ordertype) {
      console.log(ordertype);
      if (ordertype === '1') {
        this.order.rate = this.rates['silver'];
        if (this.order.ncr === false) {
        this.order.rateChanged(); }
      } else {
        this.order.rate = this.rates['gold'];
        if (this.order.ncr === false) {
        this.order.rateChanged(); }
      }
    }
    
    checkSelected() {
      if (this.isdisabled === true) {
        this.isdisabled = false;
        this.rateAssign(this.order.type);
      } else {
        this.isdisabled = true;
        this.order.rate = 0;
        
      }

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
          this.selectedUser = data['results'];
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

    addDate(event) {
      console.log(event['value']);
      this.order.date = this.datepipe.transform(event['value'], 'dd/MM/yy');
      console.log(this.order.date);
      }

ngOnInit() {
      this.order.date = this.datepipe.transform(new Date(), 'dd/MM/yy');
      console.log(this.order.date);
      this.api.getRate().subscribe( data => {
      this.rates = data ;
      console.log(this.rates);
      this.order.oldGoldItem.rate = this.rates['gold'];
      this.gold916 = this.rates['gold'];
      this.silver = this.rates['silver'];
      this.order.rate = this.rates['gold'];
    });
    
     this.testForm = new FormGroup({
      date:new FormControl(this.date),
    })
    // orderItemList.push(new OrderItem("gold24 Ring I1234",2,3,4));

  }


openMakingChargeModal(template: TemplateRef < any > , isMakingChargeModal: Boolean = true) {

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


openSelectedMakingChargeModal(itemPosition: number, template, isMakingChargeModal = true) {
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

openPopupmodal(template) {
    this.popupmodal = this.modalService.show(
      template,
      Object.assign({})
    );
  }

ok() {
    this.saveData();
    this.popupmodal.hide();
  }
Cancel() {
    this.popupmodal.hide();
  }

saveData() {
      if (this.userId === null) {
        console.log(this.order.customerItem);
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
    this.order. saveoldGold();
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

    }
  }



}
