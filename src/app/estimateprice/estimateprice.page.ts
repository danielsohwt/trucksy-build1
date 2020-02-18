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
    priceModel1

    products: any;
    productsArray: Array<string>;
    quantitiesArray: Array<number>;
    priceList: any;
    subtotal: number;
    svc: number;
    gst: number;
    totalPrice: number;

    actualProducts: any;

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
    }
    retrieveItem() {

        this.orderID = this.route.snapshot.paramMap.get('id');

        this.firebaseService.searchOrdersByID(this.orderID).subscribe(result => {
            let products;
            let productsArray = [];
            let quantitiesArray = [];
            let priceList;
            let subtotal = 0;

            this.items = result;
            this.items.forEach(function(child){
                products = child.payload.doc.data().orderItemsPredicted;
            });

            this.products=products;

            this.priceModel1 = this.afs.doc(`priceModel/1`)
            this.priceModel1.valueChanges().subscribe(val => {
                priceList = val.pricing;
                this.priceList = priceList;

                Object.keys(products).forEach(function(key) {
                    let quantity = products[key]
                    if (!(key in priceList)) {key='others'}
                    productsArray.push(key)
                    quantitiesArray.push(quantity);
                    subtotal += priceList[key] * quantity
                });

                // TODO: find a way to stop the endless updating of these arrays everytime Document is updated in Firestore
                this.productsArray = productsArray;
                this.quantitiesArray = quantitiesArray;
                this.subtotal = subtotal;
                this.svc = Math.round(subtotal*0.10*100 ) / 100;
                this.gst = Math.round((this.subtotal + this.svc)*0.07*100 ) / 100;
                this.totalPrice = this.subtotal + this.svc + this.gst;

                console.log(products);
                console.log()
            })
        });
    }

    updateTotals() {
        let subtotal = 0;
        for (let i=0; i<this.productsArray.length; i++) {
           subtotal += this.priceList[this.productsArray[i]] * this.quantitiesArray[i]
        }
        this.subtotal=subtotal;
        this.svc = Math.round(subtotal*0.10*100 ) / 100;
        this.gst = Math.round((this.subtotal + this.svc)*0.07*100 ) / 100;
        this.totalPrice = Math.round((this.subtotal + this.svc + this.gst)*100 ) / 100;
    }

    // TODO: implement

    ngOnDestroy() {

    }

    placeBooking() {
        this.actualProducts = this.createProductsObject();
        //Order Status:
        // 1: "Created Order"
        // 2: "Created Price Estimate"
        // 3: "Created Booking Date"
        // 4: "Completed Payment"
        // 5: "Order Confirmed"
        this.afs.collection('order').doc(this.orderID).update({

            orderStatus: 'Created Price Estimate',
            orderPrice: Math.round(this.totalPrice * 100) / 100,
            orderItemsActual: this.actualProducts,
        });

        console.log('Pushed to DB: Updated orderPrice to: $' + Math.round(this.totalPrice * 100 ) / 100 );
        console.log('Pushed to DB: Updated orderStatus to: ' + 'Created Price Estimate');

        this.router.navigate(['/booking/'+ this.orderID ])
    }

    createProductsObject() {
        let actualProducts = {};
        for (let i=0; i<this.productsArray.length; i++) {
            actualProducts[this.productsArray[i]] = this.quantitiesArray[i];
        }
        return actualProducts;
    }

    cancelOrder() {
        this.afs.collection('order').doc(this.orderID).delete();
        this.router.navigate(['/tabs/feed']);
    }
}
