import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'
import { firestore } from 'firebase/app';
import { Router } from '@angular/router'
import {AngularFireAuth} from "@angular/fire/auth";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {

    userPosts
    userOrder
    orders
    postID
    username: any;
    private mainuser: AngularFirestoreDocument;
    sub
    profilePic: any;
    posts: any;
    firstname: any;
    orderID: any;
    driver: string;
    pickpDate: any;
    pickUpAddress: any;
    dropOffAddress: any;
    orderItemsActual: any;
    orderPrice: any;
    dateTimeOfPickup: any;
    orderStatus: any;
    paymentStatus: any;
    lorryType: string;

    postReference: AngularFirestoreDocument
    order
    desc
    post

    userOrders
    private effect: any;
    private heartType: string;


  constructor(
    public http: HttpClient,
    private afs: AngularFirestore,
    private user:UserService,
    private route: Router,
    private afAuth: AngularFireAuth,
  ) { 
      this.mainuser = afs.doc(`users/${this.user.getUID()}`)
      this.sub = this.userOrder = this.mainuser.valueChanges().subscribe(event => {
          this.orders = event.order,
          this.orderID = event.orderID,
          this.orderStatus = event.orderStatus,
          this.paymentStatus = event.paymentStatus,
          this.firstname = event.firstName,
          this.username = event.username,
          this.profilePic = event.profilePic,
          this.driver = "Micheal Tan",
          this.dateTimeOfPickup = event.dateTimeOfPickup,
          this.pickUpAddress = event.pickupAddress,
          this.dropOffAddress = event.dropOffAddress,
          this.orderItemsActual = event.orderItemsActual,
          this.orderPrice = event.orderPrice,
          this.lorryType = "10ft Lorry"


      })
  }
  ngOnInit() {

      this.userOrders = this.afs.collection('order',ref => ref.where('user', '==', 'test@test.com'));

      console.log(this.userOrders)
      this.getOrderDetails('078db7dc-0851-49d1-a856-e1d0caaa0283');
  }

  getOrderDetails(postID) {
        this.postID = postID;
        // this.postID = '1d942a89-6838-4463-9e9a-8c6e892ed9ce'
        this.postReference = this.post = this.afs.doc(`order/${postID}`)
        this.sub = this.postReference.valueChanges().subscribe(val => {
            this.post = val
            this.effect = val.effect
        })
      console.log(this.post);

  }




  ngOnDestroy() {
        this.sub.unsubscribe()
  }

  goTo(postID: string) {
        this.route.navigate(['/tabs/post/' + postID.split('/')[0]])
  }

  logout(){
      return this.afAuth.auth.signOut().then(() => {
          this.route.navigate(['/login']);
      })
      console.log("Logout Successful");
  }



}
