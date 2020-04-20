import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, } from '@angular/common/http';
import {Order, Contact, OrderItem, Customer} from '../Models/Order';
import {Rest} from '../Models/Rest';
import {Item} from '../all-work/Model';
import { Repair } from '../Models/Repair';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',

  })
};
const ip = 'https://test.1ounce.in/estimate/';
// const ip = 'http://127.0.0.1:8000/estimate/';


@Injectable({
  providedIn: 'root'
})
export class DataAccessService {

  orderId: number;

  constructor(private client: HttpClient) { }

  // FETCH ORDERS FROM SERVER WITH PAGINATION
  getOrders(page: number= 1) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('page', page.toString());
    return this.client.get<Rest<Order>>(ip + 'order/', {params: {page: page.toString()}});

  }


  getPeople(phoneNo: string) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('phone' , phoneNo.toString());
    return this.client.get(ip + 'people/', {params: {phone: phoneNo.toString()}});
  }

  savePeople(customer: Customer) {
    const form = new FormData();
    form.append('name' , customer.name);
    form.append('email' , customer.email);
    form.append('phone' , customer.phone);
    form.append('address' , customer.address);
    return this.client.post(ip + 'people/' , form);
  }

  // SAVE CURRENT ORDER TO ONLINE DATABASE
  saveOrderToDB(order: Order) {
    // const form = new FormData();
    // form.append('data', JSON.stringify(order));
    console.log(order);
    // return this.client.post(ip + 'order/', form);
    const headers = { 'Content-Type': 'application/json' };
    return this.client.post<any>(ip + 'order/', order, { headers });
  }

  uploadItemImage(item) {
    const form = new FormData();
    form.append('data', item.imageUploader.file);
    form.append('itemId', item.id);
    return this.client.patch(ip + 'item/', form);
  }

  // FETCH A REST BASED API DATA
  getData<T>(url: string) {
      return this.client.get<Rest<T>>(url);
  }
// fetch the rates
  getRate() {
    return this.client.get(ip + 'rate/');
  }
  // SAVE CONTACTS
  saveContact(contact: Contact) {
    const form = new FormData();
    form.append('data', JSON.stringify(contact));
    return this.client.post<Contact>(ip + 'contact/', form);
  }

  getContacts() {
    return this.client.get<Rest<Contact>>(ip + 'contact/');
  }

  saveAsignee(item, contact) {
    console.log(item);
    console.log(contact);
    const form = new FormData();
    form.append('itemId', item.id);
    form.append('contactId', contact.id);
    return this.client.post(ip + 'saveAssignee/', form);
  }

  getItems(page: number= 1) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('page', page.toString());
    return this.client.get<Rest<Item>>(ip + 'item/', {params: {page: page.toString()}});
   }

   getselectedOrder(order_id) {
     return this.client.get(ip + `order/${order_id}`);
   }

   itemIsCompleted(items) {
     const form = new FormData();
     console.log(items);
    //  form.append('items', items);
    //  form.append('update_type', value);
    //  console.log(form.get('update_type'));
    //  console.log(form.get('items'));
     return this.client.post(ip + 'groupItemUpdate/', items);
   }
   saveRepairOrderTODB(repair: Repair) {
     console.log(repair);
     const headers = { 'Content-Type': 'application/json' };
     return this.client.post(ip + 'repairOrder/', repair , {headers});
   }

   getRepairOrders(page: number= 1) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('page', page.toString());
    return this.client.get<Rest<Order>>(ip + 'repairOrder/', {params: {page: page.toString()}});

  }
}
