import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Item} from './Model';
import { DataAccessService } from '../services/data-access.service';
import { BehaviorSubject, of } from 'rxjs';
import { Rest } from '../Models/Rest';
import { catchError } from 'rxjs/operators';

export class ItemDataSource implements DataSource<Item> {

    private nextUrl: string;
    private orderData = new BehaviorSubject<Item[]>([]);
    private loadingOrder = new BehaviorSubject<Boolean>(false);
    public loading$ = this.loadingOrder.asObservable();
  paginator: any;
  //pagination
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

    loadData(page: number, status: number) {
        page = page + 1;
        console.log(page);
        this.loadingOrder.next(true);

        this.api.getItems(page , status).subscribe(
                data => {
    
            
                this.nextUrl = data.next;
                console.log('next url is ' + this.nextUrl);
    
                const orders = data.results.map(obj => {
                    // console.log(obj);
                    const o = Object.assign(new Item() , obj);
                    // const items = obj.map(item => Object.assign(new Item()));
    
                    // const o = Object.assign(new Item(), obj);
                    // o = items;
    
                    return o;
                });
    
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



    // loadData(page: number) {
    //     this.loadingOrder.next(true);

    //     if (page == 1) {

    //         this.api.getItems().subscribe(
    //             data => {
    //             console.log(data);
    //             this.nextUrl = data.next;
    //             let orders = data.results.map(obj => Object.assign(new Item(), obj));
    //             console.log('Order data');
    //             console.log(orders);
    //             this.orderData.next(orders);
    //             this.loadingOrder.next(false);

    //             },
    //             fail => {
    //                 console.log('failed for some unkonwn reason');
    //                 // should handle this to display error messages
    //             }
    //         );
    //     } else {
    //         if (this.nextUrl != null) {
    //             this.api.getData<Rest<Item>>(this.nextUrl).subscribe(
    //                 data => {
    //                     this.orderData.next(data.results.map(obj => Object.assign(new Item(), obj)));
    //                     this.loadingOrder.next(false);
    //                 },
    //                 fail => {console.log('failure during donwload'); }
    //             );
    //         }
    //     }

    // }

}
