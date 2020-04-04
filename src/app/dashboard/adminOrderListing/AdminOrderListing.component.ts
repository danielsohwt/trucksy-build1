import { Platform } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NbCardModule } from '@nebular/theme';


import { ThemeModule } from '../../@theme/theme.module';

import {FirebaseService} from "../../firebase.service";
import { Router } from '@angular/router'
import { UserService } from "../../user.service";
import { MatTableDataSource } from '@angular/material';
import {MatSort,MatPaginator} from '@angular/material';


@Component({
  selector: 'ngx-dashboard',
  templateUrl: './AdminOrderListing.component.html',
})
export class AdminOrderListingComponent {

  
  items: Array<any>;
  searchValue: string = "";
  searchEmail: string = "";
  searchPaymentStatus: string = "";
  email_filtered_items: Array<any>;
  paymentStatus_filtered_items: Array<any>;
  listData: MatTableDataSource<any>;
  displayColumns: string[] = ['dateTimeOfOrder','user','paymentStatus',
  'fulfillmentStatus','orderPrice','actions'];
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  constructor(
      public firebaseService: FirebaseService,
      public user:UserService,
      public route: Router,
  ) { }


  ngOnInit() {
    this.firebaseService.getOrders()
        .subscribe(result => {
          let array = result.map(item => {
            const data = item.payload.doc.data() as Account;
            const id = item.payload.doc.id;
            return { id, 
                    ...data };
          })
          this.items = result;
          this.listData = new MatTableDataSource(array);
          console.log(this.listData)
          this.listData.sort = this.sort;
          this.listData.paginator = this.paginator;
          console.log(this.listData)
        }
        )
  }

  searchByName(){
    let value = this.searchEmail.toLowerCase();
    this.firebaseService.searchUsers(value)
        .subscribe(result => {
          console.log(result)
          let array = result.map(item => {
            const data = item.payload.doc.data() as Account;
            const id = item.payload.doc.id;
            return { id, 
                    ...data };
          })
          this.items = result;
          this.listData = new MatTableDataSource(array);
          this.listData.sort = this.sort;
          this.listData.paginator = this.paginator;
          console.log(this.listData)
          // this.email_filtered_items = result;
          // this.items = this.combineLists(result, this.email_filtered_items);
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
    this.route.navigate(['/admin-order-detail/'+ item.id]);
  }
}
