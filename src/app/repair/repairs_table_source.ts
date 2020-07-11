import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {RepairItem, Repair} from '../Models/Repair';
import { DataAccessService } from '../services/data-access.service';
import { BehaviorSubject, of } from 'rxjs';


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

  loadData(page: number , status: number) {
    page = page + 1;
    console.log(page);
    this.loadingOrder.next(true);

    this.api.getRepairOrders(page , status).subscribe(
        data => {
        console.log(data);
        this.nextUrl = data.next;
        console.log('next url is ' + this.nextUrl);

        const orders = data.results.map(obj => {
            console.log(obj);
            const items = obj.items.map(item => Object.assign(new RepairItem(), item));

            const o = Object.assign(new Repair(), obj);
            o.items = items;

            return o;
        })

        console.log('Order data');
        console.log(orders);
        this.orderData.next(orders);
        this.countSubject.next(data.count);
        this.loadingOrder.next(false);

        },
        fail => {
            console.log('failed for some unkonwn reason');
            // should handle this to display error messages
        }
    );


    }


}
