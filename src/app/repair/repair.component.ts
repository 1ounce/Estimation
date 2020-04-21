import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { environment } from '../../environments/environment';
import { Routes, RouterModule, Router } from '@angular/router';
import {MatSort} from '@angular/material/sort';
import { NavigateServiceService } from '../service/navigate-service.service';
import { HeroCircle } from '../Models/HeroCircle';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { RepairOrderDataSource } from './repairs_table_source';
import { DataAccessService } from '../services/data-access.service';
import { Contact } from '../Models/Order';
import {RepairItem, Repair} from '../Models/Repair';

@Component({
  selector: 'app-repair',
  templateUrl: './repair.component.html',
  styleUrls: ['./repair.component.css']
})
export class RepairComponent implements OnInit {


  ELEMENT_DATA = [];
  dataSource: RepairOrderDataSource;
  @ViewChild(MatPaginator , { static: false})
  paginator: MatPaginator;
  boolSpinner;
  displayedColumns: string[] = ['checked', 's.no', 'customer',  'advance'];

  color: HeroCircle = new HeroCircle();

  orderModal: BsModalRef = null;
  makingChargeModal: BsModalRef = null;
  contactsModal: BsModalRef = null;

  contacts: Array<Contact> = null; // list of contacts
  // temporary models
  contact: Contact = new Contact();
    @ViewChild(MatSort, {static: true}) sort: MatSort;
  selected: any;
    // selection = new SelectionModel(true, []);

  // tslint:disable-next-line: max-line-length
  constructor(private navigationService: NavigateServiceService , private api: DataAccessService, private modalService: BsModalService, ) { }

  ngOnInit() {
    this.dataSource = new RepairOrderDataSource(this.api);
    this.dataSource.loadData(0);
    console.log('loading contacts');
    // tslint:disable-next-line: whitespace
    // tslint:disable-next-line: max-line-length
    this.api.getContacts().subscribe(data => {console.log(data); this.contacts = data.results; } , fail => {console.log('failed in fetching contacts'); console.log(fail); });

  }

  ngAfterViewInit(): void {
    this.dataSource.counter$.subscribe(
     count => {
      console.log('paginator length triggered' + count);
      this.paginator.length = count; 
    }
    );
    console.log(this.dataSource);

    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.

    this.paginator.page.subscribe(
      () => {
          console.log('page clicked' + this.paginator.pageIndex);

          this.dataSource.loadData(this.paginator.pageIndex);
          console.log(this.dataSource);
        }
    );

  }

  rowClick(template: TemplateRef<any>, element) {
    // this.selected = element;
    // this.api.getselectedOrder(element.order_id).subscribe( data => {
      this.selected = element;
      console.log(this.selected);
      this.orderModal = this.modalService.show(
        template,
        Object.assign({})
      );
      this.orderModal.setClass('modal-xl');
    // });
  }

  selectedRow(element, $event) {
    console.log(element);
  }

  goToRepairEstimation() {
    this.navigationService.navigateToRepaireEstimation();
  }

  applyFilter(filterValue: string) {
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
