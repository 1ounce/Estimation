import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatMenuModule} from '@angular/material/menu';
import { RepairComponent } from './repair/repair.component';
import { OrdersComponent } from './orders/orders.component';
import { RouterModule, Routes } from '@angular/router';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatTableExporterModule } from 'mat-table-exporter';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatInputModule } from '@angular/material';
import { RepairEstimationComponent } from './repair-estimation/repair-estimation.component';
import { OrderEstimationComponent } from './order-estimation/order-estimation.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { ModalComponent } from './modal/modal.component';
import { NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import { AlertModule, ModalModule } from 'ngx-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { AllWorkComponent } from './all-work/all-work.component';
import { ChartsModule } from 'ng2-charts';
import { ReportComponent } from './report/report.component';
import { DatePipe } from '@angular/common';
import { OrderDetailComponent } from './order-detail/order-detail.component';



const appRoutes: Routes = [
  { path: 'repair', component: RepairComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'repair_estimation', component: RepairEstimationComponent},
  { path: 'order_estimation', component: OrderEstimationComponent} ,
  { path: 'allWork', component: AllWorkComponent},
  { path: 'report', component: ReportComponent },
  { path: 'order-details', component: OrderDetailComponent },


];

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    RepairComponent,
    OrdersComponent,
    RepairEstimationComponent,
    OrderEstimationComponent,
    ModalComponent,
    AllWorkComponent,
    ReportComponent,
    OrderDetailComponent
  ],
  imports: [
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    MatSnackBarModule,
    HttpClientModule,
    NgbModalModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ChartsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatCardModule,
    MatExpansionModule,
    MatTableExporterModule,
    MatMenuModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatInputModule,
    RouterModule.forRoot(appRoutes, {useHash: true}),
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,

  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
