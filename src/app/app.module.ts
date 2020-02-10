import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {NgDatepickerModule} from 'ng2-datepicker';

import { 
  OwlDateTimeModule, 
  OwlNativeDateTimeModule 
} from 'ng-pick-datetime';

//Firebase
import firebaseConfig from './firebase';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import {HttpClientModule} from '@angular/common/http';
import { HttpClient } from '@angular/common/http';


//Internal app services
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { ShareModule } from './share.module';

//stripe
import { Stripe } from '@ionic-native/stripe/ngx';

import * as tf from '@tensorflow/tfjs';
import { IMAGENET_CLASSES } from '../assets/imagenet-classes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    NbThemeModule,
    NbLayoutModule,
    NbMenuModule,
    NbSidebarModule,
    NbDatepickerModule,
    NbDialogModule,
    NbWindowModule, NbToastrModule, NbChatModule
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {CoreModule} from "./@core/core.module";
import {AdminOrderListingComponent} from "./dashboard/adminOrderListing/AdminOrderListing.component";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
            IonicModule.forRoot(),
            AppRoutingModule,
            AngularFireModule.initializeApp(firebaseConfig),
            AngularFireAuthModule,
            AngularFireDatabaseModule,
            AngularFirestoreModule,
            HttpClientModule,
            ShareModule,
            BrowserAnimationsModule,
            NbThemeModule.forRoot({ name: 'default' }),
            NbLayoutModule,
            NbEvaIconsModule,
            NbSidebarModule.forRoot(),
            NbMenuModule.forRoot(),
            NbDatepickerModule.forRoot(),
            NbDialogModule.forRoot(),
            NbWindowModule.forRoot(),
            NbToastrModule.forRoot(),
              NbChatModule.forRoot({
                  messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
              }),
              CoreModule.forRoot(),
            OwlDateTimeModule,
            OwlNativeDateTimeModule,
          ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    UserService,
    AuthService,
    Stripe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
