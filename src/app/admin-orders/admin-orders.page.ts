import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import {FirebaseService} from "../firebase.service";
import { Router } from '@angular/router'
import { UserService } from "../user.service";

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.page.html',
  styleUrls: ['./admin-orders.page.scss'],
})
export class AdminOrdersPage implements OnInit {

  items: Array<any>;
  searchValue: string = "";
  age_filtered_items: Array<any>;
  name_filtered_items: Array<any>;

  constructor(
      public firebaseService: FirebaseService,
      public user:UserService,
      public route: Router,
  ) { }

  ngOnInit() {
    this.firebaseService.getOrders()
        .subscribe(result => {
          this.items = result;
        })
  }

  searchByName(){
    let value = this.searchValue.toLowerCase();
    this.firebaseService.searchUsers(value)
        .subscribe(result => {
          this.name_filtered_items = result;
          // this.items = this.combineLists(result, this.age_filtered_items);
          //temp over ride
          this.items = this.name_filtered_items;
        })
  }

}
