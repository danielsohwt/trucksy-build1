import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AdminOrderDetailPage } from './admin-order-detail.page';

const routes: Routes = [
  {
    path: '',
    component: AdminOrderDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule, CommonModule],
})
export class AdminOrderDetailPageRoutingModule {}
