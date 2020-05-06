import { Component, OnInit } from '@angular/core';
import { ChartType , ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { NavigateServiceService } from '../service/navigate-service.service';
import { DataAccessService } from '../services/data-access.service';
import { BsModalService } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { moment } from 'ngx-bootstrap/chronos/test/chain';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  selectedDate = null;
  payment = [];
  startDate = null ;
  endDate = null ;
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  cash; card; cheque;

  public pieChartLabels: Label[] = ['Cash', 'Card', 'Cheque'];
  public pieChartData: SingleDataSet = [0, 0, 0];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  myDate = new Date();
  toDate: string ;
  oldGold = null;
  constructor(private navigationService: NavigateServiceService , private api: DataAccessService, private modalService: BsModalService, private datePipe: DatePipe ) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
    this.toDate = this.datePipe.transform(this.myDate, 'dd/M/yy');
    this.getReportData(this.startDate , this.endDate);
  }

  ngOnInit() {
  }
  // daily date choosed
  dailyDate() {
    this.startDate = this.toDate;
    console.log(this.startDate);
    this.getReportData(this.startDate , this.endDate);
  }

  weekDate() {
    console.log(this.myDate);
    console.log("new date")
  }
  // Date picked for the filteration
  dateChoosed( event: MatDatepickerInputEvent<Date>) {
    console.log(event);
    if (event['startDate'] != null) {
    this.startDate = this.datePipe.transform(event['startDate']._d, 'dd/M/yy');
    this.endDate = this.datePipe.transform(event['endDate']._d, 'dd/M/yy');
    if (this.startDate === this.endDate) {
      this.endDate = null;
      console.log(this.endDate);
      this.getReportData(this.startDate , this.endDate);
    } else {
    this.getReportData(this.startDate , this.endDate);
    }

  }
  }
  

  // getting a report data from the backend
  getReportData(startDate , endDate) {
    this.api.getReport(startDate , endDate).subscribe(data => {
      console.log(data);
      this.renderData(data);

    });
  }

  // data to be displayed on charts and table
  renderData(data) {
    console.log(data.payment);
    this.payment = data.payment;
    this.oldGold = data.oldGold;
    if (this.payment.length <= 0) {
      this.cash = 0;
      this.card = 0;
      this.cheque = 0;
      this.pieChartData = [0 , 0 , 0];
      console.log(this.payment.length);
    } else {
    this.payment.forEach(element => {
      console.log(element);
      if (element.type === 'Cash') {
        this.cash = element.amount;
      }
      if (element.type === 'Card') {
        this.card = element.amount;
      }
      if (element.type === 'Cheque') {
        this.cheque = element.amount;
      }
    });
    this.pieChartData = [this.cash , this.card , this.cheque , 0];
    console.log(this.cash);
  }
  }
}

