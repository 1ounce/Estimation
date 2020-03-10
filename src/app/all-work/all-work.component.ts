import {Component, OnInit, ViewChild,TemplateRef} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { environment } from '../../environments/environment';
// import { Routes, RouterModule, Router } from '@angular/router';
import {MatSort} from '@angular/material/sort';
import { NavigateServiceService } from '../service/navigate-service.service';
import {DataAccessService} from '../services/data-access.service';
import {Order, OrderItem, Contact} from '../Models/Order';
import {Rest}  from '../Models/Rest';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import {ItemDataSource} from './Items_table_source';
import { HeroCircle } from '../Models/HeroCircle';
import {Item} from './Model';

@Component({
  selector: 'app-all-work',
  templateUrl: './all-work.component.html',
  styleUrls: ['./all-work.component.css']
})
export class AllWorkComponent implements OnInit {
  ELEMENT_DATA = [];
  dataSource: ItemDataSource;
  boolSpinner;
  displayedColumns: string[] = ['order_id','status','item','date','customer','assigned_to'];
  selected: Order;
  selectedItem: Item;
  color: HeroCircle = new HeroCircle();

  orderModal: BsModalRef = null;
  makingChargeModal: BsModalRef = null;
  contactsModal: BsModalRef = null;

  contacts: Array<Contact> = null //list of contacts
  //temporary models
  contact: Contact = new Contact();
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(private navigationService: NavigateServiceService , private api: DataAccessService, private modalService: BsModalService,) { }

  ngOnInit() {
    this.dataSource = new ItemDataSource(this.api)
    this.dataSource.loadData(1);
    console.log('loading contacts');
    // tslint:disable-next-line: whitespace
    // tslint:disable-next-line: max-line-length
    this.api.getContacts().subscribe(data => {console.log(data); this.contacts = data.results; } , fail => {console.log('failed in fetching contacts');console.log(fail);});

  }

  rowClick(template: TemplateRef<any>,element) {
    this.selected=element;

    this.orderModal = this.modalService.show(
      template,
      Object.assign({})
    );
    this.orderModal.setClass('modal-xl');
  
  }



  goToOrderEstimation() {
  this.navigationService.navigateToOrderEstimation();
  }

  money(data) {return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(data);}

  openSelectedMakingChargeModal(item:Item,template,isMakingCharge:Boolean) {
    this.selectedItem=item;
    console.log(this.selectedItem);
    this.makingChargeModal = this.modalService.show(
      template,
      Object.assign({})
    );
    this.makingChargeModal.setClass('modal-xl');
  }

  openSelectOrAddContacts(item:Item,template) {
    this.selectedItem=item;
    this.contactsModal = this.modalService.show(
      template,
      Object.assign({})
    );
    this.contactsModal.setClass('modal-lg');
  }


  saveContact() {
    this.api.saveContact(this.contact).subscribe(
      data=>{
        this.contacts.push(data);
        this.contact=new Contact();
      },
      fail=>{

      }
    )
  }


  //triggered from the contact modal, for selecting 
  onContactClicked(contact) {
    this.api.saveAsignee(this.selectedItem,contact).subscribe(
      success=>{
        if(success['result']=='success') {
            console.log('successfully saved assignee information');
            this.selectedItem.assignedTo=contact;
            this.contactsModal.hide();
        } else {
          //some failure occured during loading of data
        }
      },
      fail=>{}
    )

  }

}
