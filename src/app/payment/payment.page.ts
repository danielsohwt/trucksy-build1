import { Component, Directive, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import {ActivatedRoute, Router} from '@angular/router';
import * as tf from '@tensorflow/tfjs';
import { IMAGENET_CLASSES } from '../../assets/imagenet-classes';
import * as moment from 'moment';
import {FirebaseService} from "../firebase.service";

@Component({
    selector: 'app-payment',
    templateUrl: './payment.page.html',
    styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

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

    orderStatusCompletedPayment() {
        //Order Status:
        // 1: "Created Order"
        // 2: "Created Price Estimate"
        // 3: "Created Booking Date"
        // 4: "Completed Payment"
        // 5: "Order Confirmed"

        this.afs.collection('order').doc(this.orderID).update({

            orderStatus: 'Completed Payment',
        });
    }

    orderStatusPaymentFailed() {
        //Order Status:
        // 1: "Created Order"
        // 2: "Created Price Estimate"
        // 3: "Created Booking Date"
        // 4: "Completed Payment"
        // 5: "Order Confirmed"

        this.afs.collection('order').doc(this.orderID).update({

            orderStatus: 'Payment Failed',
        });
    }


    completePayment() {
        this.orderStatusCompletedPayment()

        this.afs.collection('order').doc(this.orderID).update({
            paymentStatus: 'Paid',
        });
        console.log('Pushed to DB: Updated paymentStatus to: ' + 'Paid');

        this.router.navigate(['/confirmation/' + this.orderID])
    }

    codPayment() {
        this.orderStatusCompletedPayment()
        this.afs.collection('order').doc(this.orderID).update({
            paymentStatus: 'Cash On Delivery',
        });
        console.log('Pushed to DB: Updated paymentStatus to: ' + 'Cash On Delivery');
        this.router.navigate(['/confirmation/' + this.orderID])
    }

    failedPayment() {
        this.orderStatusPaymentFailed()

        this.afs.collection('order').doc(this.orderID).update({
            paymentStatus: 'Failed Payment',
        });

        console.log('Pushed to DB: Updated paymentStatus to: ' + 'Failed Payment');
        this.router.navigate(['/confirmation/' + this.orderID])

    }

}
