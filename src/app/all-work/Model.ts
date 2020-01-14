import {Contact, Order} from "../Models/Order";


export class Item{
    id:number;
    name:String="";
    weight:number=0;
    wastage:number=0;
    makingCharge:number=0;
    stoneCharge:number=0;
    amount:number=0;
    total:number=0;
    rate:number=0;
    assignedTo:Contact=null
    due:string="";
    order:Order=null;

    getDueDate()
    {return this.due.slice(0,this.due.indexOf('T'));}
}