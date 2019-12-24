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

    priceModel1

    sofaQty
    sofaUnitPrice
    sofaTotal

    bedQty
    bedUnitPrice
    bedTotal

    totalPrice
    sub

    constructor(
        public firebaseService: FirebaseService,
        private afs: AngularFirestore,
        private route: ActivatedRoute,
        private router: Router,
        public user:UserService,
    ) { }

    ngOnInit() {
        this.orderID = this.route.snapshot.paramMap.get('id')
        //Manually set, once AI model implemented will use their values
        this.sofaQty = 2;
        this.bedQty = 3;

        this.priceModel1 = this.afs.doc(`priceModel/1`)
        this.priceModel1.valueChanges().subscribe(val => {
            this.sofaUnitPrice = val.pricing['sofa'],
            this.sofaTotal = this.sofaUnitPrice * this.sofaQty,
            this.bedUnitPrice = val.pricing['bed'],
            this.bedTotal = this.bedUnitPrice * this.bedQty,
            this.totalPrice = this.sofaTotal + this.bedTotal
        })




    }



    updateQtySofa() {
        this.sofaTotal = this.sofaUnitPrice * this.sofaQty
        this.sofaTotal = Math.round(this.sofaTotal * 100 ) / 100
        this.totalPrice = this.sofaTotal + this.bedTotal

    }

    updateQtyBed() {
        this.bedTotal = this.bedUnitPrice * this.bedQty
        this.bedTotal = Math.round(this.bedTotal * 100 ) / 100
        this.totalPrice = this.sofaTotal + this.bedTotal


    }

    // TODO: implement

    ngOnDestroy() {

    }

    placeBooking() {

        //Order Status:
        // 1: "Created Order"
        // 2: "Created Price Estimate"
        // 3: "Created Booking Date"
        // 4: "Completed Payment"
        // 5: "Order Confirmed"
        this.afs.collection('order').doc(this.orderID).update({

            orderStatus: 'Created Price Estimate',
            orderPrice: Math.round(this.totalPrice * 100 ) / 100


        });

        console.log('Pushed to DB: Updated orderPrice to: $' + Math.round(this.totalPrice * 100 ) / 100 );
        console.log('Pushede to DB: Updated orderStatus to: ' + 'Created Price Estimate');

        this.router.navigate(['/booking/'+ this.orderID ])
    }

}
