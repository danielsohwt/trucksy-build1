import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SplashpagePageRoutingModule } from './splashpage-routing.module';

import { SplashpagePage } from './splashpage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SplashpagePageRoutingModule
  ],
  declarations: [SplashpagePage]
})
export class SplashpagePageModule {}
