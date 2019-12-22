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

  constructor(
      public firebaseService: FirebaseService,
      private route: ActivatedRoute,
      public user:UserService,
  ) { }

  ngOnInit() {
    this.orderID = this.route.snapshot.paramMap.get('id')
  }

}
