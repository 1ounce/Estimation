import { UploadComponent } from '../services/UploadComponent';
export class Repair {
    
    rate;
    date = null;
    // customer related 
    customer: Customer = null;
    customerItem = new Customer();

    itemSubToatal: string = '0';
    total :string = "0";
    balance: string = '0'; // sub total of the entire Repair
    items: RepairItem[] = []; // list of all the repair items
     // temproary item: the item which is currently being used for pushing in data is referred from here
    currentItem = new RepairItem();
    selectedItem: RepairItem = null;

      // Advance related items
      advance: string = '0';
      advances: Array<Advance> = [];
      advanceItem = new Advance();
      slectedAdvanceItem: Advance = null;

      constructor() {}

       // can be used to remove any making charge
    removeItem(position: number) {
        this.items.splice(position, 1);
        this.generateItemSubTotal();
        this.generateRepairTotal();
    }



    removeAdvance(position: number) {
        this.advances.splice(position, 1);
        this.generateAdvanceSubTotal();
        this.generateRepairTotal();
    }

      addItem() {
        if (this.currentItem.total > 0) {
        this.items.push(this.currentItem);
        this.currentItem = new RepairItem();
        this.generateItemSubTotal();
        // this.currentItem.setRate(this.rate);
        }
    }

    triggerItemDataChanged() {
        console.log('item triggered');
        // this.currentItem.triggerItemDataChanged();
        this.generateItemSubTotal();
    }

    triggerAdvanceChanged() {
        this.advanceItem.amount = this.advanceItem.amount;
        this.generateAdvanceSubTotal();
        this.generateRepairTotal();
    }


    saveAdvance() {this.advances.push(this.advanceItem); }
    refreshAdvanceItem() {this.advanceItem = new Advance(); }
    refereshcurrentItem() {this.currentItem = new RepairItem(); }

    saveOrder() {
        if (this.currentItem.total > 0) {
        this.items.push(this.currentItem);
        this.generateItemSubTotal();
    
    }
     }

    generateAdvanceSubTotal() {
        // the subtotal for order items
        let sum = 0;
        // let totalAdvance = 0;
        this.advances.forEach(element => {
                // tslint:disable-next-line: prefer-const
                let numberAmount = Number(element.amount);
                console.log(element.amount);
                sum = sum + numberAmount;

        });
        console.log(sum);
        this.advance = String((sum + this.advanceItem.amount).toFixed(2));
        console.log(this.advance);
        this.generateRepairTotal();
    }

        generateItemSubTotal() {
            let sum = 0;
            this.itemSubToatal = String(this.currentItem.total);
            this.items.forEach(ele => {
                const numberAmount = Number(ele.total);
                console.log(ele.total);
                sum = sum + numberAmount;
            });
            if (sum > 0) {
                this.itemSubToatal = String((sum).toFixed(2)) ;
                this.total = this.itemSubToatal;
            }
            
            console.log(this.total);
            this.generateRepairTotal();
        }
        generateRepairTotal() {
            console.log(this.advance);
            this.balance = String((Number(this.itemSubToatal) - Number(this.advance)).toFixed(2));
        }
}

export class RepairItem {
    name = '';
    weight = 0;
    total = 0;
    assignedTo: Contact = null;
    due = '';
    image: string = null;
    gst = 0;
    imageUploader: UploadComponent = null;

    isImageSet() {
        if (this.image == null) {
            this.imageUploader = new UploadComponent();
            return false;
        }
        return true;
    }
}

export class Contact {
    id: number;
    name = '';
    phone = '';
    email = '';
}

export class Advance {
    type = 0;
    ref_id = '' ;
    amount = 0;

    constructor() {}
 }
export class Customer {
    name = '';
    email = '';
    phone = '';
    address = '';
}

