import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SplashpagePage } from './splashpage.page';

const routes: Routes = [
  {
    path: '',
    component: SplashpagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SplashpagePageRoutingModule {}
