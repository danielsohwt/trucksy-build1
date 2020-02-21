import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { AdminOrderListingModule } from "./adminOrderListing/AdminOrderListing.module";
import { UsersListingModule } from "./usersListing/usersListing.module";
import {DriversListingModule} from "./driversListing/driversListing.module";
import {SentimentModule} from "./sentiment/sentiment.module";
@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    AdminOrderListingModule,
    UsersListingModule,
    DriversListingModule,
    SentimentModule,
  ],
  declarations: [
    PagesComponent,
  ],
})
export class PagesModule {
}
