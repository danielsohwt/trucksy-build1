import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {AdminOrderListingComponent} from "./adminOrderListing/AdminOrderListing.component";
import {UsersListingComponent} from "./usersListing/usersListing.component";
import {DriversListingComponent} from "./driversListing/driversListing.component";
import {SentimentComponent} from "./sentiment/sentiment.component";
const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: 'AdminOrderListing',
      component: AdminOrderListingComponent,
    },
    {
      path: 'UsersListing',
      component: UsersListingComponent,
    },
    {
      path: 'DriversListing',
      component: DriversListingComponent,
    },
    {
      path: 'Sentiment',
      component: SentimentComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
