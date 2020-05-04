import { UploadComponent } from '../services/UploadComponent';
export class Order {

    // general order related data
    // customer: String = '';
    // address: String = '';
    // phone: String = '';
    rate = 0;
    // email: String = '';
    date: String = '';
    type: String = '0';
    ncr: Boolean = false;
    gst : string = '0';
    // customer related 
    customer: Customer = null;
    customerItem = new Customer();

    total: string = '0';; // sub total of the entire order
    itemSubTotal: string = '0';;
    items: OrderItem[] = []; // list of all the order items
     // temproary item: the item which is currently being used for pushing in data is referred from here
    currentItem = new OrderItem();
    selectedItem: OrderItem = null;

    // old gold related items
    oldGoldTotal: string = '0';
    oldGold: Array<OldGold> = [];
    oldGoldItem = new OldGold();
    selectedOldGoldItem: OldGold = null;

    // Advance related items
    advance: string = '0';
    advances: Array<Advance> = [];
    advanceItem = new Advance();
    slectedAdvanceItem: Advance = null;


    constructor() {}


    getDate() {
        return this.date.slice(0, this.date.indexOf('T'));
    }


    init(customer: String, address: String, phone: String, rate: number, date: String): Order {
        return this;
    }

    // can be used to remove any making charge
    removeItem(position: number) {
        this.items.splice(position, 1);
        this.generateOrderSubTotal();
        this.generateOrderTotal();
    }

    removeOldGold(position: number) {
        this.oldGold.splice(position, 1);
        this.generateOldGoldSubTotal();
        this.generateOrderTotal();
    }

    removeAdvance(position: number) {
        this.advances.splice(position, 1);
        this.generateAdvanceSubTotal();
        this.generateOrderTotal();
    }
    // used to remove making change based on position from current item
    removeCurrentItemMakingCharge(position: number) {
        this.currentItem.makingChargeItems.splice(position, 1);
    }



    rateChanged() {
        this.currentItem.setRate(this.rate);
        this.oldGoldItem.rate = this.rate;
        this.currentItem.recalculateItemSubtotal();
        this.oldGoldItem.generateTotal();

        this.items.forEach(element => {
            element.setRate(this.rate);
            element.recalculateItemSubtotal();
        });

        this.oldGold.forEach(element => {
            element.rate = this.rate;
            element.generateTotal();
        });
        this.generateOldGoldSubTotal();
        this.generateOrderSubTotal();
        this.generateOrderTotal();
    }

    triggerCurrentMakingChargeChanged() {
        this.currentItem.triggerCurrentMakingChargeChanged(true);
        this.generateOrderSubTotal();
    }

    triggerMakingChargeChanged(item: OrderItem, isStoneCharge: Boolean= false) {


        item.triggerCurrentMakingChargeChanged(isStoneCharge);
        this.generateOrderSubTotal();

    }


    triggerItemDataChanged() {
        console.log('item triggered');
        this.currentItem.triggerItemDataChanged();
        this.generateOrderSubTotal();
    }

    triggerOldGoldChanged() {
        this.oldGoldItem.rate = this.oldGoldItem.rate;
        this.oldGoldItem.generateTotal();
        this.generateOldGoldSubTotal();
        this.generateOrderTotal();
    }
    triggerAdvanceChanged() {
        this.advanceItem.amount = this.advanceItem.amount;
        this.generateAdvanceSubTotal();
        this.generateOrderTotal();
    }

    // ----------------------------------------------------------------------------
    saveAdvance() {this.advances.push(this.advanceItem); }
    refreshAdvanceItem() {this.advanceItem = new Advance(); }

    saveoldGold() {this.oldGold.push(this.oldGoldItem); }
    referesholdGoldItem() { this.oldGoldItem = new OldGold(); }

    refereshcurrentItem() {this.currentItem = new OrderItem(); }

    saveOrder() {
        if (this.currentItem.total > 0) {
        this.items.push(this.currentItem); }
     }

    // temporary item related functionality
    // -------------------------------------------------------------------------------------------------

    // returns the subtotal of all the items for the order
    generateOrderSubTotal() {
        // the subtotal for order items
        let sum = 0;
        this.items.forEach(element => {

                console.log(element);
                sum = sum + element.total;

        });
        this.itemSubTotal = String(sum + this.currentItem.total);
        this.generateGstOfItems();
        this.generateOrderTotal();

    }

    generateGstOfItems() {
        this.gst = '0'  ;
        this.gst = String(Number(this.gst) + ((Number(this.itemSubTotal) * 3) / 100));
        
      }

    generateOldGoldSubTotal() {
        // the subtotal for old gold items
        let sum = 0;
        this.oldGold.forEach(element => {
            sum = sum + Number(element.total);
            console.log(sum);
        });
        console.log(sum);
        this.oldGoldTotal = String(sum + Number(this.oldGoldItem.total));
        this.generateOrderTotal();
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
        this.advance = String(sum + this.advanceItem.amount);
        console.log(this.advance);
        this.generateOrderTotal();
    }

    generateOrderTotal() {
        // console.log(this.advance);
        // the sub total for the entire order, including items, oldgold and advance
        this.total = String(Number(this.itemSubTotal) + Number(this.gst) - Number(this.oldGoldTotal) - Number(this.advance));
        // console.log("generating complete order total"+this.total);
        if (Number (this.total) > 0) {
        this.total = this.getTotal();
        const totalamount = Number(this.total);
        this.total = totalamount.toFixed(2);
        console.log(this.total);
        console.log(totalamount.toFixed(2));
        }
    }
    getTotal() {
        return this.total.slice(0, 9);
    }

    addItem() {
        if (this.currentItem.total > 0) {
        this.items.push(this.currentItem);
        this.currentItem = new OrderItem();
        this.rateChanged();
        // this.currentItem.setRate(this.rate);
        }
    }

    addOldGold() {
        if (Number(this.oldGoldItem.total) > 0) {
            this.oldGold.push(this.oldGoldItem);
            this.oldGoldItem = new OldGold();
            this.oldGoldItem.rate = this.oldGoldItem.rate;
        }
    }





}
export class OldGold {
    description: string;
    dust = 0;
    weight = 0;
    purity: number = null;
    rate = 0;
    total:string = '0';

    generateTotal() {
        let purity = 100;
        if (this.purity != null) {purity = this.purity; }
        this.total = String((this.weight - this.dust) * (purity / 100));
        this.total = String(Number(this.total) * this.rate);
        console.log(this.total);
    }

}

export class OrderItem {
    [x: string]: any;
    id: number;
    name: String = '';
    weight = 0;
    wastage = 0;
    makingCharge = 0;
    stoneCharge = 0;
    amount = 0;
    total = 0;
    rate = 0;
    assignedTo: Contact = null;
    due = '';
    image: string = null;
    gst = 0;
    imageUploader: UploadComponent = null;
    totalWithGst = 0;

    // making charge related data
    makingChargeItems: MakingCharge[] = [];
    stones: Stone[] = [];

    currentStone: Stone = new Stone('', 0, 0);
    currentMakingCharge: MakingCharge = new MakingCharge('', 0, 0);



    constructor() {}

    setRate(rate: number) {this.rate = rate;
    // generate sub totals of items and complete subtotal
    }


    isImageSet() {
        if (this.image == null) {
            this.imageUploader = new UploadComponent();
            return false;
        }
        return true;
    }

    getDueDate() {
        console.log('------------------------------due date -------------------------');
        console.log(this.due.slice(0, this.due.indexOf('T')));
        return 'date';
        return this.due.slice(0, this.due.indexOf('T'));
    }

    init( description: String,
          weight: number,
          wastage: number,
          amount: number): OrderItem {
             this.name = description;
             this.weight = weight;
             this.wastage = wastage;
             this.amount = amount;

             return this;
    }

    // adding a making charge for the particular item
    addMakingCharge(isStoneCharge: Boolean= false) {
        console.log('adding making charge isStoneCharge' + isStoneCharge);
        console.log('making charge' + this.currentMakingCharge.cost);
        console.log('weight' + this.currentMakingCharge.weight);
        console.log('stone charge' + this.currentStone.cost);
        console.log('weight' + this.currentStone.weight);
        if (isStoneCharge) {
            if (this.currentStone.cost != 0 && this.currentStone.weight != 0) {
                this.stones.push(this.currentStone);
                this.currentStone = new Stone('', 0, 0);
            }
        } else {
            if (this.currentMakingCharge.cost > 0 && this.currentMakingCharge.weight > 0) {
            this.makingChargeItems.push(this.currentMakingCharge);
            this.currentMakingCharge = new MakingCharge('', 0, 0);
            }
        }
    }



    // saving all the making charges including the current making charge if it exists
    saveMakingCharge(isStoneCharge: Boolean= false) {
        if (isStoneCharge) {
            if (this.currentStone.total != 0) {
                    this.stones.push(this.currentStone);
                    this.currentStone = new Stone('', 0, 0);
                }
        } else {
            if (this.currentMakingCharge.total != 0) {
                this.makingChargeItems.push(this.currentMakingCharge);
                this.currentMakingCharge = new MakingCharge('', 0, 0);
            }
        }
        this.generateItemSubtotal();
    }

    saveStoneCharge() {

    }

    // remove Making charge item based on position
    removeMakingChargeItem(position: number) {
        this.makingChargeItems.splice(position, 1);
    }



    // triggered when weight or cost is added
    triggerCurrentMakingChargeChanged(isStoneCharge) {
        if (isStoneCharge) { console.log('generating individual stone charge');
                             this.currentStone.generateTotal();
                             this.generateStoneChargeSubTotal();
            } else {
            console.log('gnerating making charge total');
            this.currentMakingCharge.generateTotal();
            this.generateMakingChargeSubTotal();

        }

    }


    triggerItemDataChanged() {
        console.log('Item data change triggered');
        this.generateItemSubtotal();
    }



    // generates the sub total for the inputted value
   generateMakingChargeSubTotal() {
       console.log('Generating total making charge');
       let sum = 0;
       this.makingChargeItems.forEach(element => {
           sum = sum + element.total;
       });

       console.log('making charge total is ' + this.makingCharge);
       this.makingCharge = sum + this.currentMakingCharge.total;

   }

   generateStoneChargeSubTotal() {
       console.log('Generating total making charge');
       let sum = 0;
       this.stones.forEach(element => {
           sum = sum + element.total;
       });

       console.log('making charge total is ' + this.makingCharge);
       this.stoneCharge = sum + this.currentStone.total;

   }

   // returns the subtotal for the particular item
   recalculateItemSubtotal() {
       this.generateMakingChargeSubTotal();
       this.generateStoneChargeSubTotal();
       const baseCost = this.weight * this.rate;
       this.total = baseCost + ((this.wastage / 100) * baseCost) + this.makingCharge + this.stoneCharge;
   }

   generateItemSubtotal() {
    const baseCost = this.weight * this.rate;
    this.total = baseCost + ((this.wastage / 100) * baseCost) + this.makingCharge + this.stoneCharge;
    
    }
 

}





export class MakingCharge {
   total = 0;
    constructor(public name: String, public weight: number, public cost: number) {}

    generateTotal() {
        console.log('generating making charge item total');
        this.total = this.weight * this.cost;
    }
}

export class Stone {
    total = 0;
     constructor(public name: String, public weight: number, public cost: number) {}

     generateTotal() {
         console.log('generating making charge item total');
         this.total = this.weight * this.cost;
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
 }

export class Customer {
     name = '';
     email = '';
     phone = '';
     address = '';
 }
