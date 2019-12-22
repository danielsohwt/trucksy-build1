import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminOrderDetailPageRoutingModule } from './admin-order-detail-routing.module';

import { AdminOrderDetailPage } from './admin-order-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminOrderDetailPageRoutingModule
  ],
  declarations: [AdminOrderDetailPage]
})
export class AdminOrderDetailPageModule {}
