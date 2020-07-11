import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { DataAccessService } from '../services/data-access.service';
import { NavigateServiceService } from '../service/navigate-service.service';
import {Order, OrderItem, Contact} from '../Models/Order';
import { HeroCircle } from '../Models/HeroCircle';
import {Location} from '@angular/common';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  id;
  selectedimage: any;
  selected: Order;
  orderData = [];
  selectedItem: OrderItem;
  color: HeroCircle = new HeroCircle();
  
  orderModal: BsModalRef = null;
  makingChargeModal: BsModalRef = null;
  contactsModal: BsModalRef = null;

  contacts: Array<Contact> = null; // list of contacts
  // temporary models
  contact: Contact = new Contact();
  isChecked = false;
  constructor( private route: ActivatedRoute, private router: Router ,
               private modalService: BsModalService, private api: DataAccessService, private navigatorSerice: NavigateServiceService, private _location: Location) { 
                this.getContacts();
               }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    console.log(this.id);
    this.getOrderDetails();
   }

   // available contact list
  getContacts() {
    this.api.getContacts().subscribe( data =>  {
      console.log(data);
      this.contacts = data.results;
    });
  }
  getOrderDetails() {
    
    this.api.getselectedOrder(this.id).subscribe( data => {
      console.log(data);
      
      this.orderData.pop();
      this.orderData.push(data) ;
      const orders = this.orderData.map(obj => {
        // console.log(obj);
        const items = obj.items.map(item => Object.assign(new OrderItem(), item));

        const o = Object.assign(new Order(), obj);
        o.items = items;

        return o;
    });
      orders.forEach(ele => {
        this.selected = ele;
      });
      console.log(this.selected);
    });
  }

  getselectedIamge(item) {
     return  item.image;
  }
  money(data) {return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(data); }

  openSelectedMakingChargeModal(item: OrderItem, template, isMakingCharge: Boolean) {
    this.selectedItem = item;
    console.log(this.selectedItem);
    this.makingChargeModal = this.modalService.show(
      template,
      Object.assign({})
    );
    this.makingChargeModal.setClass('modal-xl');
  }

  openSelectOrAddContacts(item: OrderItem, template) {
    this.selectedItem = item;
    this.contactsModal = this.modalService.show(
      template,
      Object.assign({})
    );
    this.contactsModal.setClass('modal-lg');
  }


  saveContact() {
    this.api.saveContact(this.contact).subscribe(
      data => {
        console.log(data);
        this.contacts.push(data);
        this.contact = new Contact();
      },
      fail => {

      }
    );
  }

  onContactClicked(contact) {
    this.api.saveAsignee(this.selectedItem, contact).subscribe(
      success => {
        // tslint:disable-next-line: triple-equals
        console.log(success);
        
        console.log('successfully saved assignee information');
        this.selectedItem.assignedTo = contact;
        this.selectedItem.due = success['due'];
        this.selectedItem.status = 1;
        this.contactsModal.hide();
        
      },
      fail => {}
    );

  }
  printPage() {
    console.log("printing");
    window.print();
}
backClicked() {
  console.log("Back going....");
  this._location.back();
}
print(): void {
  let printContents, popupWin;
  printContents = document.getElementById('print-section').innerHTML;
  // popupWin = window.open('', '_blank', 'height=100%,width=auto');
  popupWin = window.open('', '', 'width=900,height=650');
  popupWin.document.open();
  popupWin.document.write(`
    <html>
      <head>
        <title>Print tab</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        
        <style>
        html {
          width: 100%;
          height: auto;
        }
      
        body {
          -webkit-text-size-adjust: none;
          -ms-text-size-adjust: none;
          margin: 0;
          padding: 0;
          font-family: 'Open Sans', Arial, Sans-serif !important;
        }
      
        @media print {
            body {
               -webkit-print-color-adjust: exact;
            }
        }
      
    
        </style>
      </head>
  <body onload="window.print();">${printContents}</body>
    </html>`
  );
  popupWin.document.close();
}

  uploadItemImage(item) {
    this.selectedItem = item;
    console.log('upload Item started');
    console.log(item.imageUploader.file);
    // console.log(id);
    this.api.uploadItemImage(item).subscribe(
        result => {
        console.log(result);
        if (result['result'] === 'success') {
          console.log(result['data'].image);
          this.selectedItem.image = result['data'].image;
          this.selectedimage = result['data'].image;
          // this.getImage();
          console.log('image uploded sucessfully');
          // this.orderModal.hide();
        }
      },
      fail => {
      console.log('Failed');
      console.log(fail);
      }

    );
  }


}
