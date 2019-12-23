import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import {FirebaseService} from "../firebase.service";
import { Router } from '@angular/router'
import { UserService } from "../user.service";

import { ActivatedRoute } from '@angular/router';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';

import { firestore } from 'firebase/app'

@Component({
    selector: 'app-estimateprice',
    templateUrl: './estimateprice.page.html',
    styleUrls: ['./estimateprice.page.scss'],
})
export class EstimatepricePage implements OnInit {

    orderID: string;

    constructor(
        public firebaseService: FirebaseService,
        private afstore: AngularFirestore,
        private route: ActivatedRoute,
        private router: Router,
        public user:UserService,
    ) { }

    ngOnInit() {
        this.orderID = this.route.snapshot.paramMap.get('id')
    }

    placeBooking() {

        //Order Status:
        // 1: "Created Order"
        // 2: "Created Price Estimate"
        // 3: "Created Booking Date"
        // 4: "Completed Payment"
        // 5: "Order Confirmed"
        this.afstore.collection('order').doc(this.orderID).update({

            orderStatus: 'Created Price Estimate',
        });

        this.router.navigate(['/booking/'+ this.orderID ])
    }

}
