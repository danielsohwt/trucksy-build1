import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstimatepricePage } from './estimateprice.page';

const routes: Routes = [
  {
    path: '',
    component: EstimatepricePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstimatepricePageRoutingModule {}
