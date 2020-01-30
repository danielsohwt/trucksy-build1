import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserMgmtPageRoutingModule } from './user-mgmt-routing.module';

import { UserMgmtPage } from './user-mgmt.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserMgmtPageRoutingModule
  ],
  declarations: [UserMgmtPage]
})
export class UserMgmtPageModule {}
