import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import {FirebaseService} from "../firebase.service";
import { Router } from '@angular/router'
import { UserService } from "../user.service";

import { ActivatedRoute } from '@angular/router';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';

import { firestore } from 'firebase/app'

@Component({
  selector: 'app-admin-order-detail',
  templateUrl: './admin-order-detail.page.html',
  styleUrls: ['./admin-order-detail.page.scss'],
})
export class AdminOrderDetailPage implements OnInit {

  orderID: string
  order
  orderReference: AngularFirestoreDocument
  sub
  dateTimeOfDropoff
  dateTimeOfOrder
  dateTimeOfPickup
  dropOffAddress
  pickUpAddress
  driverID
  fulfillmentStatus
  paymentStatus
  desc
  image

  orderItemsActual
  orderItemsActualTotal = 0;
  orderItemsPredicted
  orderPrice
  items
  key
  value
  priceModel1
  priceList=[]

  constructor(
      public firebaseService: FirebaseService,
      private afs: AngularFirestore,
      private route: ActivatedRoute,
      public user:UserService,
  ) { 
   }

  ngOnInit() {
    this.orderID = this.route.snapshot.paramMap.get('id')
    this.orderReference = this.order = this.afs.doc(`order/${this.orderID}`)
    this.sub = this.orderReference.valueChanges().subscribe(val => {
      // for(let i in val.orderItemsActual){
      //   console.log(val.orderItemsActual.keys());

      this.order = val
      this.user = val.user
      this.dateTimeOfOrder = val.dateTimeOfOrder

      this.dateTimeOfDropoff = val.dateTimeOfDropoff
      this.dateTimeOfPickup = val.dateTimeOfPickup

      this.dropOffAddress = val.dropOffAddress
      this.pickUpAddress = val.pickUpAddress


      this.driverID = val.driverID

      this.fulfillmentStatus = val.fulfillmentStatus
      this.paymentStatus = val.paymentStatus

      this.desc = val.desc
      this.image = val.image

      // this.orderItemsActual = val.orderItemsActual
      this.value=Object.values(val.orderItemsActual);

      // Sum up all items
      for (let item of this.value) {
        this.orderItemsActualTotal += item;
      }
      console.log(this.orderItemsActualTotal);

      this.key = Object.keys(val.orderItemsActual);
      console.log(this.key);
      this.key.forEach(element => {
        console.log(element);
        console.log(this.unitPrice(element));
      });
      // this.orderItemsActual = val.child('orderItemsActual');
      this.orderItemsPredicted = val.orderItemsPredicted
      this.orderPrice = val.orderPrice


      // this.heartType = val.likes.includes(this.user.getUID()) ? 'heart' : 'heart-empty'
    })
  }

  ngOnDestroy():void {
    this.sub.unsubscribe()
  }

  unitPrice(item) {
    console.log(item)
    var item_price = {};
    var count = 0;
    this.priceModel1 = this.afs.doc(`priceModel/1`);
    this.priceModel1.valueChanges().subscribe(val => {
      console.log(val.pricing[item]);
      this.priceList.push(val.pricing[item])
      console.log(this.priceList);
      // return val.pricing[item];
      });
  }


}
