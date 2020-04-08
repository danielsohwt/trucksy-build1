import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Router } from '@angular/router'
import {AngularFirestore} from "@angular/fire/firestore";

import {firestore} from "firebase/app";
import * as moment from 'moment';

import { FileUploader } from 'ng2-file-upload';

import {UserService} from "../user.service";

const URL = '.';

@Component({
    selector: 'app-uploader',
    templateUrl: './uploader.page.html',
    styleUrls: ['./uploader.page.scss'],
})

export class UploaderPage implements OnInit {
    public uploader: FileUploader = new FileUploader({ url: URL });
    productList: any;
    busy = [];
    orderList = [];
    timedout = [];
    checked:boolean;

    constructor(
        public route: Router,
        private afs: AngularFirestore,
        public user:UserService,
        public http: HttpClient,
    ) {}

    ngOnInit() {
        // this.route.reload();
        this.getProductList();
    }

    getProductList() {
        let priceModel1 = this.afs.doc(`priceModel/1`)
        priceModel1.valueChanges().subscribe(val => {
            // @ts-ignore
            let priceList = val.pricing;
            let productList = [];
            //FULL list of products (vs productsArray - ordered products)
            Object.keys(priceList).forEach(function(key) {
                productList.push(key)
            });
            this.productList = productList;
        })
    }

    async createOrder() {
        console.log(this.orderList)
        let data = new FormData();
        let file = this.uploader.queue[0].file.rawFile;

        data.append('file', file)
        data.append('UPLOADCARE_STORE', '1')
        data.append('UPLOADCARE_PUB_KEY', '408edb3f01d67ae0afe0')
        console.log(data)

        // post to uploadcare just to get orderID
        let postResult = await this.http.post('https://upload.uploadcare.com/base/', data).toPromise();
        let imageURL = postResult['file']

        let now = moment(); // add this 2 of 4
        const orderID = imageURL;

        let predictedItems = this.createProductsObject();

        this.afs.doc(`users/${this.user.getUID()}`).update({
            order: firestore.FieldValue.arrayUnion(`${orderID}`)
        })

        this.afs.doc(`posts/${orderID}`).set({
            author: this.user.getUsername(),
            likes: [],
        })

        let orderStatus = "Created Order";

        // Push to firestore
        this.afs.doc(`order/${orderID}`).set({
            image: orderID,
            user: this.user.getUsername(),

            // Order flow Upload Image -> Price Estimate -> Booking Date -> Payment -> Confirmation

            //Order Status:
            // 1: "Require Manual Verification"
            // 2: "Created Order"
            // 3: "Created Price Estimate"
            // 4: "Created Booking Date"
            // 5: "Completed Payment"
            // 6: "Order Confirmed"

            orderStatus: orderStatus,


            //Payment Status:
            // 0: "Booking Date Not Confirmed" Have not reached booking page
            // 1: "Paid"
            // 2: "Cash on delivery'
            // 3: "Payment failed"
            // ** Only after orderStatus == "Confirmed" fulfillmentStatus == "Order Placed"
            paymentStatus: "Booking Date Not Confirmed",


            // ** Only after orderStatus == "Confirmed" fulfillmentStatus == "Order Placed"
            fulfillmentStatus: "Order Not Confirmed",
            // orderItemsPredicted: this.classes[0]['className'],
            orderItemsPredicted: predictedItems,


            dateTimeOfOrder: now.format(),
            driverID: "Driver1234",
        })

        this.route.navigate(['/estimateprice/'+ orderID])
    }

    createProductsObject() {
        let predictedProducts = {};
        for (let i=0; i<this.orderList.length; i++) {
            if (this.orderList[i] in predictedProducts) {
                predictedProducts[this.orderList[i]] ++
            } else {
                predictedProducts[this.orderList[i]] = 1;
            }
        }
        return predictedProducts;
    }
}
