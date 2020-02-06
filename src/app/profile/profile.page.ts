import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'
import { firestore } from 'firebase/app';
import { Router } from '@angular/router'


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
    private profilePic: any;
    private posts: any;
    private firstname: any;
    private orderID: any;
    private driver: string;
    private pickpDate: any;
    private pickUpAddress: any;
    private dropOffAddress: any;
    private orderItemsActual: any;
    private orderPrice: any;
    private dateTimeOfPickup: any;
    private orderStatus: any;
    private paymentStatus: any;
    private lorryType: string;

    postReference: AngularFirestoreDocument
    order
    desc
    post


  constructor(
    public http: HttpClient,
    private afs: AngularFirestore,
    private user:UserService,
    private route: Router,
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

  getOrderDetails(orderID: string) {
      this.postID = orderID;
      this.postReference = this.post = this.afs.doc(`posts/${this.postID}`)
      this.sub = this.postReference.valueChanges().subscribe(val => {
          this.order = val
          this.desc = val.desc
          // this.heartType = val.likes.includes(this.user.getUID()) ? 'heart' : 'heart-empty'
      })
  }

  ngOnDestroy() {
        this.sub.unsubscribe()
  }

  goTo(postID: string) {
        this.route.navigate(['/tabs/post/' + postID.split('/')[0]])
  }

  ngOnInit() {
  }

}
