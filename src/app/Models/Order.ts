import { UploadComponent } from '../services/UploadComponent';
export class Order {

    // general order related data
    customer: String = '';
    address: String = '';
    phone: String = '';
    rate = 0;
    email: String = '';
    date: String = '';
    advance = 0;
    total = 0; // sub total of the entire order
    itemSubTotal = 0;


    // list of all the order items
    items: OrderItem[] = [];

     // temproary item: the item which is currently being used for pushing in data is referred from here
    currentItem = new OrderItem();
    selectedItem: OrderItem = null;

    // old gold related items
    oldGoldTotal = 0;
    oldGold: Array<OldGold> = [];
    oldGoldItem = new OldGold();
    selectedOldGoldItem: OldGold = null;

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
    // used to remove making change based on position from current item
    removeCurrentItemMakingCharge(position: number) {
        this.currentItem.makingChargeItems.splice(position, 1);
    }

    advanceChanged() {
        this.advance = this.advance;
        this.generateOrderTotal();
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
        this.currentItem.triggerItemDataChanged();
        this.generateOrderSubTotal();
    }

    triggerOldGoldChanged() {
        this.oldGoldItem.generateTotal();
        this.generateOldGoldSubTotal();
        this.generateOrderTotal();
    }

    // ----------------------------------------------------------------------------



    refereshcurrentItem() {this.currentItem = new OrderItem(); }

    saveOrder() {this.items.push(this.currentItem); }

    // temporary item related functionality
    // -------------------------------------------------------------------------------------------------

    // returns the subtotal of all the items for the order
    generateOrderSubTotal() {
        // the subtotal for order items
        let sum = 0;
        this.items.forEach(element => {

                sum = sum + element.total;

        });
        this.itemSubTotal = sum + this.currentItem.total;
        this.generateOrderTotal();
    }

    generateOldGoldSubTotal() {
        // the subtotal for old gold items
        let sum = 0;
        this.oldGold.forEach(element => {
            sum = sum + element.total;
        });
        this.oldGoldTotal = sum + this.oldGoldItem.total;
        this.generateOrderTotal();
    }

    generateOrderTotal() {
        console.log(this.advance);
        // the sub total for the entire order, including items, oldgold and advance
        this.total = this.itemSubTotal - this.oldGoldTotal - this.advance;
        // console.log("generating complete order total"+this.total);

    }

    addItem() {
        if (this.currentItem.total > 0) {
        this.items.push(this.currentItem);
        this.currentItem = new OrderItem();
        this.currentItem.setRate(this.rate);
        }
    }

    addOldGold() {
        if (this.oldGoldItem.total > 0) {
            this.oldGold.push(this.oldGoldItem);
            this.oldGoldItem = new OldGold();
            this.oldGoldItem.rate = this.rate;
        }
    }





}
export class OldGold {
    description: string;
    dust = 0;
    weight = 0;
    purity: number = null;
    rate = 0;
    total = 0;

    generateTotal() {
        let purity = 100;
        if (this.purity != null) {purity = this.purity; }
        this.total = (this.weight * purity / 100) - this.dust;
        this.total = this.total * this.rate;
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

    imageUploader: UploadComponent = null;


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
