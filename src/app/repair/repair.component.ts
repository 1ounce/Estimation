import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { environment } from '../../environments/environment';
import { Routes, RouterModule, Router } from "@angular/router";
import {MatSort} from '@angular/material/sort';
import { NavigateServiceService } from '../service/navigate-service.service';

@Component({
  selector: 'app-repair',
  templateUrl: './repair.component.html',
  styleUrls: ['./repair.component.css']
})
export class RepairComponent implements OnInit {


ELEMENT_DATA=[];
dataSource;
boolSpinner;
  displayedColumns: string[] = ['s.no','date','repair','assign','status','due'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;


  constructor(private navigationService:NavigateServiceService) { }

  ngOnInit() {

  }
  goToRepairEstimation(){
    this.navigationService.navigateToRepaireEstimation();
  }

}
