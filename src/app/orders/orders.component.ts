import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { environment } from '../../environments/environment';
import { Routes, RouterModule, Router } from "@angular/router";
import {MatSort} from '@angular/material/sort';
import { NavigateServiceService } from '../service/navigate-service.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  ELEMENT_DATA=[];
  dataSource;
  boolSpinner;
  displayedColumns: string[] = ['s.no','date','order_id','assign','status','due'];
  
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(private navigationService:NavigateServiceService) { }

  ngOnInit() {
  }

  goToOrderEstimation(){
  this.navigationService.navigateToOrderEstimation();
  }

}
