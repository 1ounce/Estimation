import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Item} from './Model';
import { DataAccessService } from '../services/data-access.service';
import { BehaviorSubject } from 'rxjs';


export class ItemDataSource implements DataSource<Item> {

    private nextUrl: string;
    // data list
    private orderData = new BehaviorSubject<Item[]>([]);

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




}
