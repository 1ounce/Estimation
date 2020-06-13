import {Component, OnInit, ViewChild,} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import { NavigateServiceService } from '../service/navigate-service.service';
import {DataAccessService} from '../services/data-access.service';
import {Order, OrderItem} from '../Models/Order';
import { OrderDataSource } from './orders_table_source';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})


export class OrdersComponent implements OnInit {
  search: string = null;
  status: number = null;
  // ip = 'http://127.0.0.1:8000';
  @ViewChild(MatPaginator , { static: false})
  paginator: MatPaginator;
  ELEMENT_DATA = [];
  dataSource: OrderDataSource;
  displayedColumns: string[] = ['checked', 'order_id', 'date', 'phone_no',  'balance', 'totalCost', 'status'];
  selected: Order;
  selectedItem: OrderItem;
  isChecked = false;
  groupItemData = new groupOrderItem();
  


  constructor(private navigationService: NavigateServiceService, private api: DataAccessService, ) {
    
   }

  ngOnInit() {


    this.dataSource = new OrderDataSource(this.api);
    this.dataSource.loadData(0, this.status , this.search);
    console.log('loading contacts');

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

          this.dataSource.loadData(this.paginator.pageIndex, this.status , this.search);
        }
    );

  }

  rowClick(element) {
    this.selected = element.id;
    console.log(this.selected);
    this.navigationService.navigateTOOrderDeatil(this.selected);
  }

 
   selectedRow(element, event) {
    const checked = event.target.checked; // stored checked value true or false
    if (checked) {
      this.isChecked = true;
      console.log(element);
      this.groupItemData.orders.push(element.id);
      // this.items.push(element.id);
      this.groupItemData.orders.forEach(ele => {
        console.log(ele);

    });
      console.log(this.groupItemData.orders);

  } else {
    const index = this.groupItemData.orders.findIndex(list => list === element.id);
    this.groupItemData.orders.splice(index , 1);
    this.groupItemData.orders.forEach(ele => {
      console.log(ele);
      // console.log(this.items.length);
  });
    if (this.groupItemData.orders.length < 1) {
      console.log(this.groupItemData.orders.length);
      this.isChecked = false;
    }
  }
  }


// ststus for the filteration purpose used
  onStatusSelected(val: any) {
    this.search = null;
    if (val === '4') {
      this.status = null;
      this.dataSource.loadData(0 , this.status , this.search);
    } else {
    this.status = val;
    console.log(this.status);
    this.dataSource.loadData(0 , this.status , this.search);
    }
  }

// searcching value
applyFilter(value) {
    // this.status = null;
    this.search = value;
    console.log(this.search);
    console.log(this.status);
    this.dataSource.loadData(0, this.status , this.search);
}
  goToOrderEstimation() {
  this.navigationService.navigateToOrderEstimation();
  }

  money(data) {return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(data); }

  onSelectedStatus(val: any) {
    console.log(val);
    this.groupItemData.update_type = Number(val);
    console.log(this.groupItemData.update_type);
    this.api.grouporderupdate(this.groupItemData).subscribe( data => {
      console.log(data);
      this.isChecked = false;
      this.dataSource.loadData(this.paginator.pageIndex , this.status , this.search);
    });
  }
    

}
export class groupOrderItem {
  orders: number[] = [];
  update_type = -1;
}
