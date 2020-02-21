import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploaderPageRoutingModule } from './uploader-routing.module';

import { UploaderPage } from './uploader.page';
import { ShareModule } from '../share.module';

import { FileUploadModule } from 'ng2-file-upload';

import {MaterialModule} from '../material-module';

import { ImagePredictorComponent } from '../image-predictor/image-predictor.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UploaderPageRoutingModule,
    ShareModule,
    MaterialModule,
    FileUploadModule,
  ],
  declarations: [UploaderPage,ImagePredictorComponent]
})
export class UploaderPageModule {}
