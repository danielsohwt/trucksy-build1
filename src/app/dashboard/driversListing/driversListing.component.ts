import { Platform } from '@ionic/angular';
import { Component, OnInit,ViewChild } from '@angular/core';
import { NbCardModule } from '@nebular/theme';


import { ThemeModule } from '../../@theme/theme.module';


import {FirebaseService} from "../../firebase.service";
import { Router } from '@angular/router'
import { UserService } from "../../user.service";
import { MatTableDataSource } from '@angular/material';
import {MatSort,MatPaginator} from '@angular/material';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './driversListing.component.html',
  styleUrls: ['./driversListing.page.scss'],
})
export class DriversListingComponent {
  items: Array<any>;
  searchValue: string = "";
  searchEmail: string = "";
  searchPaymentStatus: string = "";
  email_filtered_items: Array<any>;
  paymentStatus_filtered_items: Array<any>;
  driverData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  searchKey: string;
  displayColumns: string[] = ['firstName','lastName',
  'username','userRegisteredDateTime'];

  constructor(
      public firebaseService: FirebaseService,
      public user:UserService,
      public route: Router,
  ) { }


  ngOnInit() {
    this.firebaseService.getDrivers()
        .subscribe(result => {
          let array = result.map(item => {
            const data = item.payload.doc.data() as Account;
            const id = item.payload.doc.id;
            return { id, 
                    ...data };
        })
          this.items = result;
          this.driverData = new MatTableDataSource(array);
          console.log(this.driverData)
          this.driverData.sort = this.sort;
          this.driverData.paginator = this.paginator;
      }
      )
  }

  applyFilter(){
    this.driverData.filter = this.searchKey.trim().toLocaleLowerCase();
  }

}
