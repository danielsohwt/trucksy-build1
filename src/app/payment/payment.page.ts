import { Component, Directive, OnInit, ViewChild, ElementRef } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';


import { AngularFirestore } from '@angular/fire/firestore';

import { UserService } from '../user.service';
import { FirebaseService } from "../firebase.service";
import { PaymentService } from "./payment.service";

import { environment } from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
declare var Stripe;




@Component({
    selector: 'app-payment',
    templateUrl: './payment.page.html',
    styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
    orderID
    dateTimeOfPickup;
    pickUpAddress: any;
    dropOffAddress: any;
    orderPrice: number;
    token: string;

    imageURL


    stripe = Stripe('pk_test_w6jToOfq5LFI2DmbOdfu2CFv003OEOTjl8');
    card: any;

    constructor(
        public firebaseService: FirebaseService,
        private afs: AngularFirestore,
        private route: ActivatedRoute,
        private router: Router,
        public user:UserService,
        private paymentSvc: PaymentService,
        private http: HttpClient,
    ) { }

    ngOnInit() {
        this.orderID = this.route.snapshot.paramMap.get('id');
        this.getOrderInfo();

        this.setupStripe();
    }

    setupStripe() {
        let elements = this.stripe.elements();
        var style = {
            base: {
                iconColor: '#F2561D',
                color: '#2B3339',
                lineHeight: '24px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                // fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#c6c6c6'
                }
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
            }
        };

        this.card = elements.create('card', {
            iconStyle: 'solid',
            style: style });
        console.log(this.card);
        this.card.mount('#card-element');

        this.card.addEventListener('change', event => {
            var displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });

        var form = document.getElementById('payment-form');
        form.addEventListener('submit', event => {
            event.preventDefault();
            console.log(event)

            this.stripe.createSource(this.card).then(result => {
                if (result.error) {
                    var errorElement = document.getElementById('card-errors');
                    errorElement.textContent = result.error.message;
                } else {
                    console.log(result);
                    try {
                        console.log(result.source.id);
                        this.token = result.source;
                        this.paymentSvc.processPayment(
                            this.token,
                            this.orderPrice*100,
                            this.orderID,
                            this.dateTimeOfPickup,
                            this.pickUpAddress,
                            this.dropOffAddress);
                        this.completePayment()
                    }
                    catch(err) {
                        console.log(err);
                    }
                }
            });
        });
    }

    //
    // makePayment(token) {
    //     this.http
    //         .post('http://localhost:4000/charge', {
    //             amount: 1000,
    //             currency: "SGD",
    //             token: token.id
    //         })
    //         .subscribe(data => {
    //             console.log(data);
    //         });
    // }

    getOrderInfo() {
        this.afs.collection('order').doc(this.orderID).ref.get()
            .then (doc => {
                if (!doc.exists) {
                    console.log('No such order!');
                } else {
                    this.dateTimeOfPickup = doc.data().dateTimeOfPickup;
                    this.pickUpAddress = doc.data().pickUpAddress;
                    this.dropOffAddress = doc.data().dropOffAddress;
                    this.orderPrice = doc.data().orderPrice;
                }
            })
            .catch (err => {
                console.log('Error getting document', err);
            })
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
