import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminOrderDetailPage } from './admin-order-detail.page';

const routes: Routes = [
  {
    path: '',
    component: AdminOrderDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminOrderDetailPageRoutingModule {}
