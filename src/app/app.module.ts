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
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatTableExporterModule } from 'mat-table-exporter';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatInputModule } from '@angular/material';
import { RepairEstimationComponent } from './repair-estimation/repair-estimation.component';
import { OrderEstimationComponent } from './order-estimation/order-estimation.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';


const appRoutes: Routes = [
  { path: 'repair', component: RepairComponent },
  { path: 'orders',component: OrdersComponent },
  { path: 'repair_estimation',component:RepairEstimationComponent},
  { path: 'order_estimation',component:OrderEstimationComponent} 




]

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    RepairComponent,
    OrdersComponent,
    RepairEstimationComponent,
    OrderEstimationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
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
    RouterModule.forRoot(appRoutes,{useHash: true}),
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
