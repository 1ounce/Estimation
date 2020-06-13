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
import { NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import { AlertModule, ModalModule } from 'ngx-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { AllWorkComponent } from './all-work/all-work.component';
import { ChartsModule } from 'ng2-charts';
import { ReportComponent } from './report/report.component';
import { DatePipe } from '@angular/common';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { UserLoginComponent } from './user-login/user-login.component';
import { AuthGuardService } from './services/auth-guard.service';
import {NgxPaginationModule} from 'ngx-pagination';

const appRoutes: Routes = [
  { path: 'login', component: UserLoginComponent },
  { path: 'home', component: MainNavComponent , canActivate: [AuthGuardService]},
  { path: 'repair', component: RepairComponent , canActivate: [AuthGuardService]},
  { path: 'orders', component: OrdersComponent , canActivate: [AuthGuardService] },
  { path: 'repair_estimation', component: RepairEstimationComponent , canActivate: [AuthGuardService]},
  { path: 'order_estimation', component: OrderEstimationComponent , canActivate: [AuthGuardService]} ,
  { path: 'allWork', component: AllWorkComponent , canActivate: [AuthGuardService]},
  { path: 'report', component: ReportComponent , canActivate: [AuthGuardService]},
  { path: 'order-details/:id', component: OrderDetailComponent , canActivate: [AuthGuardService]},


];

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    RepairComponent,
    OrdersComponent,
    RepairEstimationComponent,
    OrderEstimationComponent,
    AllWorkComponent,
    ReportComponent,
    OrderDetailComponent,
    UserLoginComponent
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
    NgxPaginationModule,
    NgxDaterangepickerMd.forRoot()

  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
