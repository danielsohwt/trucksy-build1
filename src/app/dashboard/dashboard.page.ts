import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import {FirebaseService} from "../firebase.service";
import { Router } from '@angular/router'
import { UserService } from "../user.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

    items: Array<any>;

  constructor(
      public firebaseService: FirebaseService,
      private _platform: Platform,
      public user:UserService,
      public route: Router,
        ) {

   }


   ngOnInit() {
      this.firebaseService.getOrders()
          .subscribe(result => {
                this.items = result;
          })
    }

    viewOrders(item){
        this.route.navigate(['/details/'+ item.payload.doc.id]);
    }s
}
