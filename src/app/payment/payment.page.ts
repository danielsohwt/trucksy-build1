import { Component, Directive, OnInit, ViewChild, ElementRef } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import { AngularFirestore } from '@angular/fire/firestore';

import { UserService } from '../user.service';
import { FirebaseService } from "../firebase.service";
import { PaymentService } from "./payment.service";

import { environment } from "../../environments/environment";

@Component({
    selector: 'app-payment',
    templateUrl: './payment.page.html',
    styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
    handler: any;
    amount: any;
    orderID

    constructor(
        public firebaseService: FirebaseService,
        private afs: AngularFirestore,
        private route: ActivatedRoute,
        private router: Router,
        public user:UserService,
        private paymentSvc: PaymentService,
    ) { }

    ngOnInit() {
        this.loadStripe();
        this.amount = 5; //hardcode for now
        this.orderID = this.route.snapshot.paramMap.get('id')
    }

    loadStripe() {

        if (!window.document.getElementById('stripe-script')) {
            let s = window.document.createElement('script');
            s.id = 'stripe-script';
            s.type = 'text/javascript';
            s.src = 'https://checkout.stripe.com/checkout.js';
            window.document.body.appendChild(s);
        }
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

    pay(amount) {

        let handler;
        handler = (window as any).StripeCheckout.configure({
            key: environment.stripeKey,
            locale: 'auto',
            token: token => {
                try {
                    this.paymentSvc.processPayment(token, this.amount*100, this.orderID);
                    this.completePayment()
                } catch(err) {
                    console.log(err);
                }
            }
        });

        handler.open({
            name: 'Demo Site',
            description: '2 widgets',
            amount: amount * 100
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
