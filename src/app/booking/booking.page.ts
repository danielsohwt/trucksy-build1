import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import {FirebaseService} from "../firebase.service";
import { Router } from '@angular/router'
import { UserService } from "../user.service";

import { ActivatedRoute } from '@angular/router';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import * as moment from 'moment';

// TODO: add unit numbers
// TODO: add error handling for unfound/invalid postal codes

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
    stAddr
    pickUpAddress: any;
    dropOffAddress: any;
    pickUpPostalCode: any;
    dropOffPostalCode: any;
    pickUpUnitNo: any;
    dropOffUnitNo: any;

    recName: any;
    recNumber: any;
    note: string = ' ';

    constructor(
        public firebaseService: FirebaseService,
        private afs: AngularFirestore,
        private route: ActivatedRoute,
        private router: Router,
        public user:UserService,
        private httpClient: HttpClient,
    ) { }

    ngOnInit() {
        this.orderID = this.route.snapshot.paramMap.get('id')
        let now = moment();
        this.currentDateTime = now.format()
        console.log(now.format())
        console.log(this.orderID)
        console.log(this.date)
    }
    setDate(){
        this.dateTimeOfPickup = this.date;
        console.log(this.dateTimeOfPickup);
    }

    searchPickUp() {
        this.postalSearch(this.pickUpPostalCode)
            .then(data => {
                console.log(data);
                this.pickUpAddress = data;
            })
    }

    searchDropOff() {
        this.postalSearch(this.dropOffPostalCode)
            .then(data => {
                console.log(data);
                this.dropOffAddress = data;
            })
    }

    postalSearch(postalCode: any) {
        // @ts-ignore
        return new Promise((resolve, reject) => {
            this.httpClient.get(`https://geocode.xyz/${postalCode}+SG?json=1`)
                .subscribe((data: Response) => {
                    console.log(data);
                    // @ts-ignore
                    this.stAddr = data.standard.addresst + ' ' + data.standard.city + ' ' + data.standard.postal;
                    resolve(this.stAddr)
                },
                error => {
                    reject(error);
                });
        })
    };

    placePayment() {

        if (this.pickUpUnitNo) {
            this.pickUpAddress = '#' + this.pickUpUnitNo + ', ' + this.pickUpAddress;
        }

        if (this.dropOffUnitNo) {
            this.dropOffAddress = '#' + this.dropOffUnitNo + ', ' + this.dropOffAddress
        }

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
            recipientName: this.recName,
            recipientNumber: this.recNumber,
            orderStatus: 'Created Booking Date',
            note: this.note.slice(0,2000)

        });

        console.log('Pushed to DB: Updated dateTimeOfPickup to: ' + this.dateTimeOfPickup);
        console.log('Pushed to DB: Updated pickupAddress to: ' + this.pickUpAddress);
        console.log('Pushed to DB: Updated dropOffAddress to: ' + this.dropOffAddress);
        console.log('Pushed to DB: Updated orderStatus to: ' + 'Created Booking Date');

        this.router.navigate(['/payment/'+ this.orderID])
    }
}
