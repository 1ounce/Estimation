import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, } from '@angular/common/http';
import {Order, Contact, OrderItem} from '../Models/Order';
import {Rest} from '../Models/Rest';
import {Item} from '../all-work/Model';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',

  })
};
// const ip ='https://test.1ounce.in/estimate/';
const ip = 'http://127.0.0.1:8000/estimate/';


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
    return this.client.get<Rest<Order>>(ip + 'orders/', {params: {page: page.toString()}});

  }


  // SAVE CURRENT ORDER TO ONLINE DATABASE
  saveOrderToDB(order: Order) {
    const form = new FormData();
    form.append('data', JSON.stringify(order));
    return this.client.post(ip + 'create/', form);
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

  getItems() {return this.client.get<Rest<Item>>(ip + 'item/'); }

}
