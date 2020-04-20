import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {RepairItem, Repair} from '../Models/Repair';
import { DataAccessService } from '../services/data-access.service';
import { BehaviorSubject, of } from 'rxjs';
import { Rest } from '../Models/Rest';
import { catchError } from 'rxjs/operators';

export class RepairOrderDataSource implements DataSource<Repair> {
    private nextUrl: string;
    private orderData = new BehaviorSubject<Repair[]>([]);
    private loadingOrder = new BehaviorSubject<Boolean>(false);
    public loading$ = this.loadingOrder.asObservable();
  paginator: any;
  // pagination
  private countSubject = new BehaviorSubject<number>(0);
  public counter$ = this.countSubject.asObservable();


  constructor(private api: DataAccessService) {}

  connect(collectionViewer: CollectionViewer): import('rxjs').Observable<any[] | readonly any[]> {
      return this.orderData.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
      this.orderData.complete();
      this.loadingOrder.complete();
  }

  loadData(page: number) {
    page = page + 1;
    console.log(page);
    this.loadingOrder.next(true);

    // this.api.getRepairOrders(page).subscribe(
    //     data => {

    //     this.nextUrl = data.next;
    //     console.log('next url is ' + this.nextUrl);

    //     const orders = data.results;

    //     console.log('Order data');
    //     console.log(orders);
    //     // this.orderData.next(orders);
    //     this.countSubject.next(data.count);
    //     this.loadingOrder.next(false);

    //     },
    //     fail => {
    //         console.log('failed for some unkonwn reason');
    //         // should handle this to display error messages
    //     }
    // );


    }


}