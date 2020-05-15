import {Contact, Order} from '../Models/Order';
import { UploadComponent } from '../services/UploadComponent';


export class Item {
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
    image: string = null;
    imageUploader: UploadComponent = null;
    due = '';
    order: Order = null;
    status = -1;
    getDueDate() {return this.due.slice(0, this.due.indexOf('T')); }
    isImageSet() {
        if (this.image == null) {
            this.imageUploader = new UploadComponent();
            return false;
        }
        return true;
    }
}
