import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import {ReactiveFormsModule} from "@angular/forms";

import { RegisterPageRoutingModule } from './register-routing.module';

import { RegisterPage } from './register.page';
import {WindowService} from "../window.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterPageRoutingModule
  ],
  providers: [WindowService],
  declarations: [RegisterPage]
})
export class RegisterPageModule {}
