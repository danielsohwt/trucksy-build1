import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstimatepricePageRoutingModule } from './estimateprice-routing.module';

import { EstimatepricePage } from './estimateprice.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstimatepricePageRoutingModule
  ],
  declarations: [EstimatepricePage]
})
export class EstimatepricePageModule {}
