import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {MatPaginator} from '@angular/material';
import { environment } from '../../environments/environment';
import { Routes, RouterModule, Router } from '@angular/router';
import { NavigateServiceService } from '../service/navigate-service.service';
import {DataAccessService} from '../services/data-access.service';
import {Order, OrderItem, Contact} from '../Models/Order';
import {Rest} from '../Models/Rest';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { OrderDataSource } from './orders_table_source';
import { HeroCircle } from '../Models/HeroCircle';
import {Observable} from 'rxjs';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
// import { timingSafeEqual } from 'crypto';


class ImageSnippet {
  constructor(public src: string, public file: File) {}
}



@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})


export class OrdersComponent implements OnInit {
  selectedimage: string;
  ip = 'http://127.0.0.1:8000';
  @ViewChild(MatPaginator , { static: false})
  paginator: MatPaginator;
  ELEMENT_DATA = [];
  dataSource: OrderDataSource;
  boolSpinner;
  displayedColumns: string[] = ['order_id', 'date', 'phone_no', 'Status', 'assigned_to', 'balance'];
  selected: Order;
  selectedItem: OrderItem;
  color: HeroCircle = new HeroCircle();

  orderModal: BsModalRef = null;
  makingChargeModal: BsModalRef = null;
  contactsModal: BsModalRef = null;

  contacts: Array<Contact> = null; // list of contacts
  // temporary models
  contact: Contact = new Contact();

    @ViewChild(MatSort, {static: true}) sort: MatSort;
  currentImage: string;
  image: any;


  constructor(private navigationService: NavigateServiceService, private api: DataAccessService, private modalService: BsModalService, ) {
    this.getContacts();
   }

  ngOnInit() {
    this.dataSource = new OrderDataSource(this.api);
    this.dataSource.loadData(0);
    console.log('loading contacts');
    // this.sort.sortChange.subscribe(
    //   sort => {
    //       console.log('printing sort order');
    //       console.log(sort.direction);


    //   }
    // );
    // tslint:disable-next-line: max-line-length

  }
// available contact list
  getContacts() {
    this.api.getContacts().subscribe( data =>  {
      console.log(data);
      this.contacts = data.results;
    });
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
    this.selected = element;
    console.log(this.selected);
    this.orderModal = this.modalService.show(
      template,
      Object.assign({})
    );
    this.orderModal.setClass('modal-xl');

  }

  // applyFilter(filterValue: string) {
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }

  getselectedIamge(item) {
    // console.log(item);
     // tslint:disable-next-line: no-unused-expression
     return this.ip + item.image;
  }
  getImage() {
    this.currentImage = this.ip + this.selectedimage;
  }


  goToOrderEstimation() {
  this.navigationService.navigateToOrderEstimation();
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
          this.getImage();
          console.log('image uploded sucessfully');
          this.orderModal.hide();
        }
      },
      fail => {
      console.log('Failed');
      console.log(fail);
      }

    );
  }

}
