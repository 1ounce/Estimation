import { Component, OnInit } from '@angular/core';
import { ChartType , ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { DataAccessService } from '../services/data-access.service';
import { DatePipe } from '@angular/common';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';


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
  cash; card; cheque; phonepay; googlepay; paytm;

  public pieChartLabels: Label[] = ['Cash', 'Card', 'Cheque','PhonePay','GooglePay','Paytam'];
  public pieChartData: SingleDataSet = [0, 0, 0, 0, 0, 0];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  myDate = new Date();
  toDate: string ;
  oldGold = null;
  reportOrder;
  page = 1;
  constructor( private api: DataAccessService,  private datePipe: DatePipe ) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
    this.toDate = this.datePipe.transform(this.myDate, 'dd/M/yy');
    this.getReportData(this.startDate , this.endDate);
    this.getReportOderData(0);
  }

  ngOnInit() {
  }
  // daily date choosed
  dailyDate() {
    this.startDate = this.toDate;
    console.log(this.startDate);
    this.getReportData(this.startDate , this.endDate);
  }

  totalReport() {
    this.startDate = null;
    this.endDate = null;
    this.getReportData(this.startDate , this.endDate);
  }
  // Date picked for the filteration
  dateChoosed( event: MatDatepickerInputEvent<Date>) {
    console.log(event);
    console.log(event['type']);
    if (event['type'] === 'change') {
      this.startDate =null;
      this.endDate = null;
      this.getReportData(this.startDate , this.endDate);
    }
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
  money(data) {
    if (data != null) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(data); }
    }

  // getting a report data from the backend
  getReportData(startDate , endDate) {
    this.api.getReport(startDate , endDate).subscribe(data => {
      console.log(data);
      this.renderData(data);

    });
  }

  dataChanged() {
    this.cash = 0;
    this.card = 0;
    this.cheque = 0;
    this.phonepay = 0;
    this.googlepay = 0;
    this.paytm = 0;
    this.pieChartData = [0 , 0 , 0 , 0 , 0 , 0];
  }

  // data to be displayed on charts and table
  renderData(data) {
    this.dataChanged();
    console.log(data.payment);
    this.payment = data.payment;
    this.oldGold = data.oldGold;
    
    this.payment.forEach(element => {
      console.log(element);
      if (element.type === 'Cash') {
        this.cash = element.amount;
      }

      if (element.type === 'Card') {
        this.card = element.amount;
      } 
      if (element.type === 'Paytm') {
        this.paytm = element.amount;
      }
      if (element.type === 'Cheque') {
        this.cheque = element.amount;
      }
      if (element.type === 'Phone Pe') {
        this.phonepay = element.amount;
        console.log(this.phonepay)
      }
      if (element.type === 'Google Pay') {
        this.googlepay = element.amount;
      }
      
    });
    this.pieChartData = [this.cash , this.card , this.cheque , this.phonepay , this.googlepay , this.paytm , 0];
    console.log(this.paytm);
  
  }

  getReportOderData1(event) {
    console.log(event);
  }
  getReportOderData(page) {
    console.log(page);
    this.api.getReportOrder(page).subscribe(data => {
      console.log(data);
      this.reportOrder = data.results;
    });
  }
}

