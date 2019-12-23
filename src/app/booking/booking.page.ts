import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import {FirebaseService} from "../firebase.service";
import { Router } from '@angular/router'
import { UserService } from "../user.service";

import { ActivatedRoute } from '@angular/router';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import * as moment from 'moment';

@Component({
    selector: 'app-booking',
    templateUrl: './booking.page.html',
    styleUrls: ['./booking.page.scss'],
})
export class BookingPage implements OnInit {

    orderID
    date

    constructor(
        public firebaseService: FirebaseService,
        private afs: AngularFirestore,
        private route: ActivatedRoute,
        private router: Router,
        public user:UserService,
    ) { }

    ngOnInit() {
        this.orderID = this.route.snapshot.paramMap.get('id')
        console.log(this.orderID)
        console.log(this.date)
    }
    test(){
        console.log(this.date);
    }

    placePayment() {

        //Order Status:
        // 1: "Created Order"
        // 2: "Created Price Estimate"
        // 3: "Created Booking Date"
        // 4: "Completed Payment"
        // 5: "Order Confirmed"
        this.afs.collection('order').doc(this.orderID).update({

            orderStatus: 'Created Booking Date',
        });

        this.router.navigate(['/payment/'+ this.orderID])
    }
}
