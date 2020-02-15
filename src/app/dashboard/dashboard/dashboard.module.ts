import { NgModule } from '@angular/core';
import { NbCardModule } from '@nebular/theme';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ShareModule} from "../../share.module";
import {DpDatePickerModule} from 'ng2-date-picker';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        NbCardModule,
        ThemeModule,
        NgbModule,
        ShareModule,
        DpDatePickerModule
    ],
  declarations: [
    DashboardComponent,
  ],
})
export class DashboardModule { }
