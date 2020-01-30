import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserMgmtPage } from './user-mgmt.page';

const routes: Routes = [
  {
    path: '',
    component: UserMgmtPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserMgmtPageRoutingModule {}
