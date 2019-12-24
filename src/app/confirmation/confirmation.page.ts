import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import {FirebaseService} from "../firebase.service";
import { Router } from '@angular/router'
import { UserService } from "../user.service";

import { ActivatedRoute } from '@angular/router';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';

@Component({
    selector: 'app-confirmation',
    templateUrl: './confirmation.page.html',
    styleUrls: ['./confirmation.page.scss'],
})
export class ConfirmationPage implements OnInit {

    orderID

    constructor(
        public firebaseService: FirebaseService,
        private afs: AngularFirestore,
        private route: ActivatedRoute,
        private router: Router,
        public user:UserService,
    ) { }

    ngOnInit() {
        this.orderID = this.route.snapshot.paramMap.get('id')
    }

    completeOrder() {
        //Order Status:
        // 1: "Created Order"
        // 2: "Created Price Estimate"
        // 3: "Created Booking Date"
        // 4: "Completed Payment"
        // 5: "Order Confirmed"

        this.afs.collection('order').doc(this.orderID).update({

            orderStatus: 'Order Confirmed',
        });

        this.router.navigate(['/tabs/feed'])
    }
}
