import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {Item} from "./Model";
import { DataAccessService } from '../services/data-access.service';
import { BehaviorSubject, of } from 'rxjs';
import { Rest } from '../Models/Rest';
import { catchError } from 'rxjs/operators';

export class ItemDataSource implements DataSource<Item>
{

    private nextUrl:string;
    private orderData = new BehaviorSubject<Item[]>([]);
    private loadingOrder=new BehaviorSubject<Boolean>(false);
    public loading$=this.loadingOrder.asObservable();

    constructor(private api:DataAccessService){}

    connect(collectionViewer: CollectionViewer): import("rxjs").Observable<any[] | readonly any[]> {
        return this.orderData.asObservable();
    }  
    
    disconnect(collectionViewer: CollectionViewer): void {
        this.orderData.complete();
        this.loadingOrder.complete();
    }


    loadData(page:number)
    {
        this.loadingOrder.next(true);
        
        if(page==1){
            
            this.api.getItems().subscribe(
                data =>{
                this.nextUrl=data.next;
                var orders=data.results.map(obj=>Object.assign(new Item(),obj));
                console.log("Order data");
                console.log(orders);
                this.orderData.next(orders);
                this.loadingOrder.next(false);

                },
                fail=>{
                    console.log("failed for some unkonwn reason");
                    //should handle this to display error messages
                }
            )
        }
        else
        {
            if(this.nextUrl!=null)
            {
                this.api.getData<Rest<Item>>(this.nextUrl).subscribe(
                    data=>{
                        this.orderData.next(data.results.map(obj=>Object.assign(new Item(),obj)));
                        this.loadingOrder.next(false);
                    },
                    fail=>{console.log("failure during donwload");}
                )
            }
        }

    }

}