import { NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NbCardModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { SentimentComponent } from './sentiment.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


import { Platform } from '@ionic/angular';
import {FirebaseService} from "../../firebase.service";
import { Router } from '@angular/router'
import { UserService } from "../../user.service";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    NbCardModule,
    ThemeModule,
    FormsModule,
    NgbModule,
  ],
  declarations: [
    SentimentComponent,
  ],
})

export class SentimentModule{

}