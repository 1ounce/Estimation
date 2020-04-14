import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
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
  @ViewChild(MatPaginator , { static: false})
  paginator: MatPaginator;
  boolSpinner;
  displayedColumns: string[] = ['date', 'order_id',  'item', 'assigned_to', 'status'];
  selected;
  selectedItem: Item;
  color: HeroCircle = new HeroCircle();

  orderModal: BsModalRef = null;
  makingChargeModal: BsModalRef = null;
  contactsModal: BsModalRef = null;

  contacts: Array<Contact> = null //list of contacts
  //temporary models
  contact: Contact = new Contact();
    @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private navigationService: NavigateServiceService , private api: DataAccessService, private modalService: BsModalService,) { }

  ngOnInit() {
    this.dataSource = new ItemDataSource(this.api);
    this.dataSource.loadData(0);
    console.log('loading contacts');
    // tslint:disable-next-line: whitespace
    // tslint:disable-next-line: max-line-length
    this.api.getContacts().subscribe(data => {console.log(data); this.contacts = data.results; } , fail => {console.log('failed in fetching contacts');console.log(fail);});

  }


  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewInit(): void {
    this.dataSource.counter$.subscribe(
     count => {
      console.log('paginator length triggered' + count);
      this.paginator.length = count; }
    );


    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.

    this.paginator.page.subscribe(
      () => {
          console.log('page clicked' + this.paginator.pageIndex);

          this.dataSource.loadData(this.paginator.pageIndex); 
        }
    );

  }

  rowClick(template: TemplateRef<any>, element) {
    // this.selected = element;
    this.api.getselectedOrder(element.order_id).subscribe( data => {
      this.selected = data;
      console.log(this.selected);
      this.orderModal = this.modalService.show(
        template,
        Object.assign({})
      );
      this.orderModal.setClass('modal-xl');
      console.log('larger')
    });

  
  }



  goToOrderEstimation() {
  this.navigationService.navigateToOrderEstimation();
  }

  money(data) {return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(data);}

  openSelectedMakingChargeModal(item: Item, template, isMakingCharge: Boolean) {
    this.selectedItem = item;
    console.log(this.selectedItem);
    this.makingChargeModal = this.modalService.show(
      template,
      Object.assign({})
    );
    this.makingChargeModal.setClass('modal-xl');
  }

  openSelectOrAddContacts(item: Item, template) {
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


  //triggered from the contact modal, for selecting
  onContactClicked(contact) {
    this.api.saveAsignee(this.selectedItem, contact).subscribe(
      success => {
        if (success['result'] === 'success') {
            console.log('successfully saved assignee information');
            this.selectedItem.assignedTo = contact;
            this.contactsModal.hide();
        } else {
          //some failure occured during loading of data
        }
      },
      fail => { }
    );

  }

}
