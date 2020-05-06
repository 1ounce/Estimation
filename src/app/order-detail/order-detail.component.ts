import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { DataAccessService } from '../services/data-access.service';
import { NavigateServiceService } from '../service/navigate-service.service';
import {Order, OrderItem, Contact} from '../Models/Order';
import {Rest} from '../Models/Rest';
import { HeroCircle } from '../Models/HeroCircle';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  id;
  selected: Object = null;
  selectedimage: any;
  selectedItem: OrderItem;
  color: HeroCircle = new HeroCircle();

  orderModal: BsModalRef = null;
  makingChargeModal: BsModalRef = null;
  contactsModal: BsModalRef = null;

  contacts: Array<Contact> = null; // list of contacts
  // temporary models
  contact: Contact = new Contact();
  
  constructor( private route: ActivatedRoute, private router: Router ,
               private modalService: BsModalService, private api: DataAccessService, private navigatorSerice: NavigateServiceService, ) { 
                this.getOrderDetails();
               }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    console.log(this.id);
    this.getOrderDetails();
   }

  getOrderDetails() {
    this.api.getselectedOrder(this.id).subscribe( data => {
      this.selected = data; 
      console.log(this.selected);
    });
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
        if (success['result'] === 'success') {
        console.log('successfully saved assignee information');
        this.selectedItem.assignedTo = contact;
        this.contactsModal.hide();
        } else {
          // some failure occured during loading of data
        }
      },
      fail => {}
    );

  }


  uploadItemImage(item) {
    console.log('upload Item started');
    console.log(item.imageUploader.file);
    // console.log(id);
    this.api.uploadItemImage(item).subscribe(
        result => {
        console.log(result);
        if (result['result'] === 'success') {
          console.log(result['data'].image);
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
