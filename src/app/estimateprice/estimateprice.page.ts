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
    items: Array<any>;
    public product
    priceModel1

    sofaQty
    sofaUnitPrice
    sofaTotal

    bedQty
    bedUnitPrice
    bedTotal

    totalPrice
    sub

    imageURL;

    constructor(
        public firebaseService: FirebaseService,
        private afs: AngularFirestore,
        private route: ActivatedRoute,
        private router: Router,
        public user:UserService,
    ) { }

    ngOnInit() {
        this.retrieveItem();
        //Manually set, once AI model implemented will use their values
        this.sofaQty = 1;
    }
    retrieveItem() {
        var products = '';
        this.orderID = this.route.snapshot.paramMap.get('id');
        this.firebaseService.searchOrdersByID(this.orderID).subscribe(result => {
            this.items = result;
            this.items.forEach(function(child){
                products = child.payload.doc.data().orderItemsPredicted;
                console.log(products)
            });
            this.product=products;
            console.log(this.product);
            this.priceModel1 = this.afs.doc(`priceModel/1`)
            this.priceModel1.valueChanges().subscribe(val => {
            this.sofaUnitPrice = val.pricing[this.product],
            this.sofaTotal = this.sofaUnitPrice * this.sofaQty,
            console.log(this.sofaUnitPrice)
            this.totalPrice = this.sofaTotal;
            })


        });
    }




    updateQtySofa() {
        this.sofaTotal = this.sofaUnitPrice * this.sofaQty
        this.sofaTotal = Math.round(this.sofaTotal * 100 ) / 100
        this.totalPrice = this.sofaTotal

    }

    // updateQtyBed() {
    //     this.bedTotal = this.bedUnitPrice * this.bedQty
    //     this.bedTotal = Math.round(this.bedTotal * 100 ) / 100
    //     this.totalPrice = this.sofaTotal + this.bedTotal


    // }

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
