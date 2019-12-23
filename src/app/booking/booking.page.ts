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
    now: any;
    currentDateTime
    dateTimeOfPickup
    pickUpAddress
    dropOffAddress

    constructor(
        public firebaseService: FirebaseService,
        private afs: AngularFirestore,
        private route: ActivatedRoute,
        private router: Router,
        public user:UserService,
    ) { }

    ngOnInit() {
        this.orderID = this.route.snapshot.paramMap.get('id')
        let now = moment(); // add this 2 of 4
        this.currentDateTime = now.format()
        console.log(now.format())
        console.log(this.orderID)
        console.log(this.date)
    }
    setDate(){
        this.dateTimeOfPickup = this.date;
        console.log(this.dateTimeOfPickup);
    }

    placePayment() {

        //Order Status:
        // 1: "Created Order"
        // 2: "Created Price Estimate"
        // 3: "Created Booking Date"
        // 4: "Completed Payment"
        // 5: "Order Confirmed"
        this.afs.collection('order').doc(this.orderID).update({
            dateTimeOfPickup: this.dateTimeOfPickup,
            pickUpAddress: this.pickUpAddress,
            dropOffAddress: this.dropOffAddress,
            orderStatus: 'Created Booking Date',

        });

        console.log('Pushed to DB: Updated dateTimeOfPickup to: ' + this.dateTimeOfPickup);
        console.log('Pushed to DB: Updated pickupAddress to: ' + this.pickUpAddress);
        console.log('Pushed to DB: Updated dropOffAddress to: ' + this.dropOffAddress);
        console.log('Pushede to DB: Updated orderStatus to: ' + 'Created Booking Date');

        this.router.navigate(['/payment/'+ this.orderID])
    }
}
