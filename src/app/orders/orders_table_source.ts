import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Order, OrderItem} from '../Models/Order';
import { DataAccessService } from '../services/data-access.service';
import { BehaviorSubject, of } from 'rxjs';
import { Rest } from '../Models/Rest';
import { catchError } from 'rxjs/operators';

export class OrderDataSource implements DataSource<Order> {

    private nextUrl: string;

    // data list
    private orderData = new BehaviorSubject<Order[]>([]);

    // paging purpose
    private countSubject = new BehaviorSubject<number>(0);
    public counter$ = this.countSubject.asObservable();

    // loading bar , each time i click
    private loadingOrder = new BehaviorSubject<Boolean>(false);
    public loading$ = this.loadingOrder.asObservable();

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

        this.api.getOrders(page).subscribe(
            data => {

        
            this.nextUrl = data.next;
            console.log('next url is ' + this.nextUrl);

            const orders = data.results.map(obj => {

                const items = obj.items.map(item => Object.assign(new OrderItem(), item));

                const o = Object.assign(new Order(), obj);
                o.items = items;

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

        // if(page==1){
        //     this.api.getOrders().subscribe(
        //         data =>{
        //         this.nextUrl=data.next;
        //         console.log("next url is "+this.nextUrl);

        //         var orders=data.results.map(obj=>Object.assign(new Order(),obj));
        //         console.log("Order data");
        //         console.log(orders);
        //         this.orderData.next(orders);
        //         this.countSubject.next(data.count+3);
        //         this.loadingOrder.next(false);

        //         },
        //         fail=>{
        //             console.log("failed for some unkonwn reason");
        //             //should handle this to display error messages
        //         }
        //     )
        // }
        // else
        // {


        //     if(this.nextUrl!=null)
        //     {
        //         this.api.getData<Rest<Order>>(this.nextUrl).subscribe(
        //             data=>{
        //                 this.nextUrl=this.nextUrl;
        //                 console.log("next url is "+this.nextUrl);

        //                 this.orderData.next(data.results.map(obj=>Object.assign(new Order(),obj)));
        //                 this.loadingOrder.next(false);
        //             },
        //             fail=>{console.log("failure during donwload");}
        //         )
        //     }
        // }

    }

}
