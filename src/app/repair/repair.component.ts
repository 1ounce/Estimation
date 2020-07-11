import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import { NavigateServiceService } from '../service/navigate-service.service';
import { HeroCircle } from '../Models/HeroCircle';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { RepairOrderDataSource } from './repairs_table_source';
import { DataAccessService } from '../services/data-access.service';
import { Contact } from '../Models/Order';
import {RepairItem } from '../Models/Repair';

@Component({
  selector: 'app-repair',
  templateUrl: './repair.component.html',
  styleUrls: ['./repair.component.css']
})
export class RepairComponent implements OnInit {
  dataSource: RepairOrderDataSource;
  @ViewChild(MatPaginator , { static: false})
  paginator: MatPaginator;
  boolSpinner;
  displayedColumns: string[] = ['checked', 's.no', 'date', 'phoneno' , 'total' , 'balance' ,'status'];

  color: HeroCircle = new HeroCircle();

  orderModal: BsModalRef = null;
  makingChargeModal: BsModalRef = null;
  contactsModal: BsModalRef = null;

  contacts: Array<Contact> = null; // list of contacts
  // temporary models
  contact: Contact = new Contact();
  selected: any;  // selection = new SelectionModel(true, []);

  isChecked = false;
  groupItemData = new groupRepairItem();
  status: number = null;
  selectedItem: RepairItem;
  page: number;
  // tslint:disable-next-line: max-line-length
  constructor(private navigationService: NavigateServiceService , private api: DataAccessService, private modalService: BsModalService, ) {
    
   }

  ngOnInit() {
    this.dataSource = new RepairOrderDataSource(this.api);
    this.dataSource.loadData(0 , this.status);
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
          this.page = this.paginator.pageIndex;
          console.log('page clicked' + this.paginator.pageIndex);

          this.dataSource.loadData(this.paginator.pageIndex , this.status);
          console.log(this.dataSource);
        }
    );

  }
  money(data) {return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(data); }
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

  selectedRow(element, event) {
    const checked = event.target.checked; // stored checked value true or false
    if (checked) {
      this.isChecked = true;
      console.log(element);
      this.groupItemData.items.push(element.id);
      // this.items.push(element.id);
      this.groupItemData.items.forEach(ele => {
        console.log(ele);

    });
      console.log(this.groupItemData.items);

  } else {
    const index = this.groupItemData.items.findIndex(list => list === element.id);
    this.groupItemData.items.splice(index , 1);
    this.groupItemData.items.forEach(ele => {
      console.log(ele);
      // console.log(this.items.length);
  });
    if (this.groupItemData.items.length < 1) {
      console.log(this.groupItemData.items.length);
      this.isChecked = false;
    }
  }
  }
  refresh() {
    window.location.reload();
}
  onSelectedStatus(val: any) {
    this.groupItemData.action = val;
    console.log(this.groupItemData.action);
    this.api.groupRepairItempdate(this.groupItemData).subscribe( data => {
      console.log(data);
      this.isChecked = false;
      this.dataSource.loadData(this.page , this.status);
    });
  }
  goToRepairEstimation() {
    this.navigationService.navigateToRepaireEstimation();
  }

//  filteration using a status
onStatusSelected(val: any) {
  if (val === '4') {
    this.status = null;
    this.dataSource.loadData(0 , this.status);
  } else {
  this.status = val;
  console.log(this.status);
  this.dataSource.loadData(0 , this.status);
  }
}

openSelectOrAddContacts(item: RepairItem, template) {
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
    err => {
      console.log("failed")
      console.log(err);
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
      this.contactsModal.hide();

    
    },
    fail => {
      console.log(fail);
    }
  );

}

refreshPage() {
  window.location.reload();
 }

uploadItemImage(item) {
  console.log('upload Item started');
  console.log(item.imageUploader.file);
  this.selectedItem = item;
  console.log(this.selectedItem);
  this.api.uploadItemImage(item).subscribe(
      result => {
      console.log(result);
      if (result['result'] === 'success') {
        console.log(result['data'].image);
        console.log(this.selectedItem.assignedTo);
        this.selectedItem.image = result['data'].image;
        console.log(this.selectedItem.image);
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
// tslint:disable-next-line: class-name
export class groupRepairItem {
  items: number[] = [];
  action = 0;
}
