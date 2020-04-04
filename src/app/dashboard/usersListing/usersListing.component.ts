import { Platform } from '@ionic/angular';
import { Component, ViewChild, OnInit} from '@angular/core';
import { NbCardModule } from '@nebular/theme';


import { ThemeModule } from '../../@theme/theme.module';


import {FirebaseService} from "../../firebase.service";
import { Router } from '@angular/router'
import { UserService } from "../../user.service";
import { MatTableDataSource } from '@angular/material';
import {MatSort,MatPaginator} from '@angular/material';


@Component({
  selector: 'ngx-dashboard',
  templateUrl: './usersListing.component.html',
  styleUrls: ['./usersListing.page.scss'],
})
export class UsersListingComponent {
  items: Array<any>;
  searchValue: string = "";
  searchEmail: string = "";
  searchPaymentStatus: string = "";
  email_filtered_items: Array<any>;
  paymentStatus_filtered_items: Array<any>;
  userData: MatTableDataSource<any>;
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
    this.firebaseService.getUsers()
        .subscribe(result => {
          let array = result.map(item => {
            const data = item.payload.doc.data() as Account;
            const id = item.payload.doc.id;
            return { id, 
                    ...data };
        })
          this.items = result;
          this.userData = new MatTableDataSource(array);
          console.log(this.userData)
          this.userData.sort = this.sort;
          this.userData.paginator = this.paginator;
      }
      )
  }

  applyFilter(){
    this.userData.filter = this.searchKey.trim().toLocaleLowerCase();
  }

  viewOrder(item){
    this.route.navigate(['/admin-order-detail/'+ item.payload.doc.id]);
  }
}
