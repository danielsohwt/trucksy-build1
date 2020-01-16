import { Platform } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { NbCardModule } from '@nebular/theme';


import { ThemeModule } from '../../@theme/theme.module';


import {FirebaseService} from "../../firebase.service";
import { Router } from '@angular/router'
import { UserService } from "../../user.service";

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './usersListing.component.html',
})
export class UsersListingComponent {
  items: Array<any>;
  searchValue: string = "";
  searchEmail: string = "";
  searchPaymentStatus: string = "";
  email_filtered_items: Array<any>;
  paymentStatus_filtered_items: Array<any>;

  constructor(
      public firebaseService: FirebaseService,
      public user:UserService,
      public route: Router,
  ) { }


  ngOnInit() {
    this.firebaseService.getUsers()
        .subscribe(result => {
          this.items = result;
        })
  }

  searchByName(){
    let value = this.searchEmail.toLowerCase();
    this.firebaseService.searchUsers(value)
        .subscribe(result => {
          this.email_filtered_items = result;
          this.items = this.combineLists(result, this.email_filtered_items);
          //temp over ride
          // this.items = this.name_filtered_items;
        })
  }

  searchByPaymentStatus(){
    let value = this.searchPaymentStatus.toLowerCase();
    this.firebaseService.searchPaymentStatus(value)
        .subscribe(result => {
          this.paymentStatus_filtered_items = result;
          this.items = this.combineLists(result, this.paymentStatus_filtered_items);
          //temp over ride
          // this.items = this.name_filtered_items;
        })
  }

  combineLists(a, b){
    let result = [];

    a.filter(x => {
      return b.filter(x2 =>{
        if(x2.payload.doc.id == x.payload.doc.id){
          result.push(x2);
        }
      });
    });
    return result;
  }

  viewOrder(item){
    this.route.navigate(['/admin-order-detail/'+ item.payload.doc.id]);
  }
}
