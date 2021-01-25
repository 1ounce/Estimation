import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, } from '@angular/common/http';
import {Order, Contact, OrderItem, Customer} from '../Models/Order';
import {Rest} from '../Models/Rest';
import {Item} from '../all-work/Model';
import { Repair } from '../Models/Repair';
let headers = new HttpHeaders();
// const httpOptions = {
//   headers: new HttpHeaders({
//     'Content-Type':  'application/json',

//   })
// };

const ip = 'https://development.1ounce.in/estimate/';
// const ip = 'http://127.0.0.1:8000/estimate/';


@Injectable({
  providedIn: 'root'
})
export class DataAccessService {

  orderId: number;
  Token: String;

  constructor(private client: HttpClient) {
    headers = headers.set('Authorization' , 'Token ' + localStorage.getItem('token'));

    console.log(headers);
    console.log('hiiiii');
  }

  userLogin(phone , pwd )  {
    const form = new FormData();
    form.append('phone' , phone);
    form.append('password' , pwd);
    return this.client.post(ip + 'login/', form);
  }

  // FETCH ORDERS FROM SERVER WITH PAGINATION
  getOrders(page: number= 1 , status: number= null , search: string= null) {
    headers = headers.set('Authorization' , 'Token ' + localStorage.getItem('token'));
    const params: URLSearchParams = new URLSearchParams();
    params.set('page', page.toString());
    
    if (status != null) {
      params.set('status', status.toString());
      return this.client.get<Rest<Order>>(ip + 'order/', {params: {page: page.toString(), status: status.toString()} ,  headers });
    }
    if (search != null) {
      console.log(search);
      params.set('search', search.toString());
      return this.client.get<Rest<Order>>(ip + 'order/', {params: {page: page.toString(), search: search.toString() }, headers});

    }
    if (status != null && search != null) {
      console.log(status);
    console.log(search);
      // tslint:disable-next-line: max-line-length
      return this.client.get<Rest<Order>>(ip + 'order/', {params: {page: page.toString(), status: status.toString(), search: search.toString()}, headers});
    }
    return this.client.get<Rest<Order>>(ip + 'order/', {params: {page: page.toString() }, headers});

  }

// getting a available people from the database
  getPeople(phoneNo: string) {
    headers = headers.set('Authorization' , 'Token ' + localStorage.getItem('token'));
    const params: URLSearchParams = new URLSearchParams();
    params.set('phone' , phoneNo.toString());
    return this.client.get(ip + 'people/', {params: {phone: phoneNo.toString()}, headers});
  }

  // save the new customer to the database
  savePeople(customer: Customer) {
    headers = headers.set('Authorization' , 'Token ' + localStorage.getItem('token'));
    const form = new FormData();
    form.append('name' , customer.name);
    form.append('email' , customer.email);
    form.append('phone' , customer.phone);
    form.append('address' , customer.address);
    return this.client.post(ip + 'people/' , form , { headers});
  }

  // SAVE CURRENT ORDER TO ONLINE DATABASE
  saveOrderToDB(order: Order) {
    // const form = new FormData();
    // form.append('data', JSON.stringify(order));
    console.log(order);
    // return this.client.post(ip + 'order/', form);
    headers = headers.set('Authorization' , 'Token ' + localStorage.getItem('token'));
    headers = headers.set('Content-Type', 'application/json' );
    // const headers = { 'Content-Type': 'application/json' };
    console.log(headers);
    return this.client.post<any>(ip + 'order/', order, { headers });
  }

  uploadItemImage(item) {
    headers = headers.set('Authorization' , 'Token ' + localStorage.getItem('token'));
    const form = new FormData();
    form.append('data', item.imageUploader.file);
    form.append('itemId', item.id);
    return this.client.patch(ip + 'item/', form , { headers });
  }

  // FETCH A REST BASED API DATA
  getData<T>(url: string) {
    headers = headers.set('Authorization' , 'Token ' + localStorage.getItem('token'));
    return this.client.get<Rest<T>>(url);
  }
// fetch the rates
  getRate() {
    headers = headers.set('Authorization' , 'Token ' + localStorage.getItem('token'));
    return this.client.get(ip + 'rate/' , { headers });
  }
  // SAVE CONTACTS
  saveContact(contact: Contact) {
    console.log(contact);
      
    headers = headers.set('Authorization' , 'Token ' + localStorage.getItem('token'));
    const form = new FormData();
    form.append('data', JSON.stringify(contact));
    return this.client.post<Contact>(ip + 'contact/', form , { headers });
  }

  getContacts() {
    headers = headers.set('Authorization' , 'Token ' + localStorage.getItem('token'));
    return this.client.get<Rest<Contact>>(ip + 'contact/', { headers });
  }

// Assignig a items to the particular contacts
  saveAsignee(item, contact) {
    headers = headers.set('Authorization' , 'Token ' + localStorage.getItem('token'));
    console.log(item);
    console.log(contact);
    const form = new FormData();
    form.append('itemId', item.id);
    form.append('contactId', contact.id);
    return this.client.post(ip + 'saveAssignee/', form , { headers });
  }
// changing a due date
  saveDueDate(item) {
    // headers = headers.set('Content-Type', 'application/json' );
    headers = headers.set('Authorization' , 'Token ' + localStorage.getItem('token'));
    // console.log(JSON.stringify(item));
    const form = new FormData();
    form.append('itemId', item.id);
    form.append('due_date' , item.due);
    
    return this.client.patch(ip + 'item/', form , { headers });
  }

  // Fetch a all items from the database
  getItems(page: number= 1 , status: number= null ) {
    headers = headers.set('Authorization' , 'Token ' + localStorage.getItem('token'));
    const params: URLSearchParams = new URLSearchParams();
    params.set('page', page.toString()); // if user selected the filteration based on the status
    console.log(status);
    if (status != null) {
      console.log(status);
      params.set('status', status.toString());
      return this.client.get<Rest<Item>>(ip + 'item/', {params: {page: page.toString(), status: status.toString()}, headers });
    }

    return this.client.get<Rest<Item>>(ip + 'item/', {params: {page: page.toString()}, headers });
   }

// Fetching a single order based on the orderid
   // tslint:disable-next-line: variable-name
   getselectedOrder(order_id) {
    headers = headers.set('Authorization' , 'Token ' + localStorage.getItem('token'));
    console.log(order_id);
    return this.client.get(ip + `order/${order_id}`, { headers });
   }

// groupItemUpdating api
   itemIsCompleted(items) {
    headers = headers.set('Authorization' , 'Token ' + localStorage.getItem('token'));
    const form = new FormData();
    console.log(items);
    return this.client.post(ip + 'groupItemUpdate/', items , { headers });
   }

// saving a new Repair Order to the database
   saveRepairOrderTODB(repair: Repair) {
     console.log(repair);
     headers = headers.set('Authorization' , 'Token ' + localStorage.getItem('token'));
     headers = headers.set('Content-Type' , 'application/json' );
     return this.client.post(ip + 'repairOrder/', repair , {headers});
   }

 // Fteching a repair Items from database
   getRepairOrders(page: number= 1 , status: number= null) {
    headers = headers.set('Authorization' , 'Token ' + localStorage.getItem('token'));
    const params: URLSearchParams = new URLSearchParams();
    params.set('page', page.toString());
    if (status != null) {
      console.log(status);
      params.set('status', status.toString());
      return this.client.get<Rest<Repair>>(ip + 'repairOrder/', {params: {page: page.toString(), status: status.toString()},  headers });
    }
    return this.client.get<Rest<Repair>>(ip + 'repairOrder/', {params: {page: page.toString()},  headers });

  }
// GroupRepairUpdating
  groupRepairItempdate(items) {
    headers = headers.set('Authorization' , 'Token ' + localStorage.getItem('token'));
    console.log(items);
    return this.client.post(ip + 'groupRepairUpdate/' , items , { headers });
  }

  // groupOrderUpdate
  grouporderupdate(items) {
    headers = headers.set('Authorization' , 'Token ' + localStorage.getItem('token'));
    console.log(items);
    return this.client.post(ip + 'groupOrderUpdate/' , items , { headers });
  }

  getReport(startDate: Date , endDate: Date) {
    headers = headers.set('Authorization' , 'Token ' + localStorage.getItem('token'));
    console.log(startDate);
    const params: URLSearchParams = new URLSearchParams();
    if (startDate != null && endDate != null) {
      console.log(endDate);
      params.set('start_date' , String(startDate));
      params.set('end_date' , String(endDate));
      return this.client.get(ip + 'report/', {params: {start_date: startDate.toString(), end_date: endDate.toString()},  headers });
    }

    if (startDate != null) {
      params.set('start_date' , String(startDate));
      return this.client.get(ip + 'report/', {params: {start_date: startDate.toString()},  headers });
    }
    return this.client.get(ip + 'report/' , { headers });
  }

  getReportOrder(page: number = 1) {
    console.log(page);
    headers = headers.set('Authorization' , 'Token ' + localStorage.getItem('token'));
    const params: URLSearchParams = new URLSearchParams();
    params.set('page', page.toString());
    return this.client.get<Rest<any>>(ip + 'reportOrder/', {params: {page: page.toString()},  headers });
  }

}
