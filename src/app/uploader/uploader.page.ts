import { Component, Directive, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { Router } from '@angular/router';
import * as tf from '@tensorflow/tfjs';
import { IMAGENET_CLASSES } from '../../assets/imagenet-classes';
import * as moment from 'moment';


const IMAGE_SIZE = 224;
const TOPK_PREDICTIONS = 5;

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.page.html',
  styleUrls: ['./uploader.page.scss'],
})

export class UploaderPage implements OnInit {
    // private model
    model: tf.Model;
    classes: any[];
    imageData: ImageData;
    data = new FormData();

    imageURL; string;
    desc: string;
    busy: boolean = false;
    noFace: boolean = false;
    simulateResponse;
    private test123: string;
    uploadFail;
    lowAccuracyCounter = 0;

    orderStatus;
    orderItemsPredicted;

    image1Classification: any;



    @ViewChild('chosenImage', { static: false }) img: ElementRef;
    @ViewChild('fileUpload', { static: false }) fileUpload: ElementRef;

    // @ViewChild("chosenImage") img: ElementRef;
    // @ViewChild("fileUpload") fileUpload: ElementRef;


    scaleCrop: string = '-/scale_crop/200x200';

    effects = {
        effect1: '',
        effect2: '-/exposure/50/-/saturation/50/-/warmth/-30/',
        effect3: '-/filter/vevera/150/',
        effect4: '-/filter/carris/150/',
        effect5: '-/filter/misiara/150/'
    }

    activeEffect: string = this.effects.effect1
    faces
    event


    @ViewChild('fileButton', { static: false }) fileButton;
    // @ViewChild('fileButton') fileButton
    private image1Confidence: string;
    private image1Probabilty: string;

    constructor(
        public http: HttpClient,
        public afstore: AngularFirestore,
        public user:UserService,
        public route: Router,
        ) { }

    ngOnInit() {
        this.loadModel();
    }


    // AI Stuff

    async loadModel() {
        this.model = await tf.loadModel("../../assets/model.json");
    }

    fileChangeEvent(event: any) {
        const file = event.target.files[0];
        console.log(file)
        if (!file || !file.type.match("image.*")) {
            return;
        }

        this.classes = [];

        const reader = new FileReader();
        reader.onload = e => {
            console.log(e)
            this.img.nativeElement.src = e.target["result"];
            console.log(this.img.nativeElement)
            this.predict(this.img.nativeElement,file);
            console.log(this.predict(this.img.nativeElement,file))
        };
        reader.readAsDataURL(file);
    }

    async predict(imageData: ImageData,file): Promise<any> {
        this.fileUpload.nativeElement.value = "";
        const startTime = performance.now();
        const logits = tf.tidy(() => {
            // tf.fromPixels() returns a Tensor from an image element.
            const img = tf.fromPixels(imageData).toFloat();

            const offset = tf.scalar(127.5);
            // Normalize the image from [0, 255] to [-1, 1].
            const normalized = img.sub(offset).div(offset);

            // Reshape to a single-element batch so we can pass it to predict.
            const batched = normalized.reshape([1, IMAGE_SIZE, IMAGE_SIZE, 3]);

            // Make a prediction through mobilenet.
            return this.model.predict(batched);
        });

        // Convert logits to probabilities and class names.
        this.classes = await this.getTopKClasses(logits, 1,file);
        console.log(this.classes)
        const totalTime = performance.now() - startTime;
        console.log(`Done in ${Math.floor(totalTime)}ms`);
    }

    async getTopKClasses(logits, topK,file): Promise<any[]> {
        console.log(topK);
        const values = await logits.data();

        const valuesAndIndices = [];
        for (let i = 0; i < values.length; i++) {
            valuesAndIndices.push({ value: values[i], index: i });
        }
        valuesAndIndices.sort((a, b) => {
            return b.value - a.value;
        });
        const topkValues = new Float32Array(topK);
        const topkIndices = new Int32Array(topK);
        for (let i = 0; i < topK; i++) {
            topkValues[i] = valuesAndIndices[i].value;
            topkIndices[i] = valuesAndIndices[i].index;
        }

        const topClassesAndProbs = [];
        for (let i = 0; i < topkIndices.length; i++) {
            console.log(topkValues[i])
            var confidence = '';
            if (topkValues[i] < 0.7) {
                confidence= 'Low Confidence';
            }
            else {
                confidence= 'High Confidence';
                            //prepare data

                this.data.append('file', file)
                this.data.append('UPLOADCARE_STORE', '1')
                this.data.append('UPLOADCARE_PUB_KEY', '3f6ba0e51f55fa947944')
                console.log(this.data)

                // post to uploadcare
                this.http.post('https://upload.uploadcare.com/base/', this.data)
                    .subscribe(event => {
                        console.log(event)
                        this.imageURL = event['file']
                        console.log(this.imageURL)
                        this.busy = false
                    })
            }
            topClassesAndProbs.push({
                className: IMAGENET_CLASSES[topkIndices[i]],
                probability: topkValues[i],
                confidence: confidence
            });
        }

        return topClassesAndProbs;

    }

    // End AI Stuff




    uploadFile() {
        this.fileButton.nativeElement.click()
    }

    setSelected(effect: string) {
        this.activeEffect = this.effects[effect]
    }


    fileChanged(event: any) {
        this.busy = true
        const files = event.target.files
        console.log(files)

        // Call classification API to determine class and confidence level

        // Simulate Response from AI API
        //Write post request to AI classifier here and map response to simulateResponse1

        //prepare data
                const data = new FormData()


                this.http.post('https://8080-dot-10558302-dot-devshell.appspot.com/predict/', data)
                    .subscribe(event => {
                        console.log(event)
                        // this.imageURL = event['file']
                        // console.log(this.imageURL)
                        this.busy = false
                    })





        let simulateResponse1;

        simulateResponse1 = {
            "Classification": "sofa 2-seater",
            "Confidence": "Low Confidence",
            "Probabilty": "97.26%"
        }

        this.image1Classification = simulateResponse1.Classification
        this.image1Confidence = simulateResponse1.Confidence
        this.image1Probabilty = simulateResponse1.Probabilty

        if (this.image1Confidence === "Low Confidence") {
            this.image1Classification = null;
        }


        if (this.image1Confidence === "High Confidence")
        {
            //prepare data
            const data = new FormData()
            data.append('file', files[0])
            data.append('UPLOADCARE_STORE', '1')
            data.append('UPLOADCARE_PUB_KEY', '3f6ba0e51f55fa947944')

            // post to uploadcare
            this.http.post('https://upload.uploadcare.com/base/', data)
                .subscribe(event => {
                    console.log(event)
                    this.imageURL = event['file']
                    console.log(this.imageURL)
                    this.busy = false
                })


        }
        else

        {
            this.uploadFail = true;

            //user uploaded twice with low accuracy
            if (this.lowAccuracyCounter === 1 ) {
                //post to firebase, and continue flow without quotation.
                this.uploadFail = null;

                //prepare data
                const data = new FormData()
                data.append('file', files[0])
                data.append('UPLOADCARE_STORE', '1')
                data.append('UPLOADCARE_PUB_KEY', '3f6ba0e51f55fa947944')

                // post to uploadcare
                this.http.post('https://upload.uploadcare.com/base/', data)
                    .subscribe(event => {
                        console.log(event)
                        this.imageURL = event['file']
                        console.log(this.imageURL)
                        this.busy = false
                    })

                    //TODO: send info to skip price estimate page

            } else {

                this.lowAccuracyCounter += 1;
                console.log(this.lowAccuracyCounter);
                this.busy = false;
            }


        }



        // // post method for image classification
        // this.http.post('https://8080-dot-10558302-dot-devshell.appspot.com/predict/', data)
        //     .subscribe(event => {
        //         console.log(event)
        //         // this.imageURL = event['file']
        //         // console.log(this.imageURL)
        //         // this.busy = false
        //
        //     })


        //TODO:
        // Write AI function here
}

    createOrder() {
        let now = moment(); // add this 2 of 4
        this.busy = true
        const orderID = this.imageURL
        const activeEffect = this.activeEffect
        const desc = this.desc

        this.afstore.doc(`users/${this.user.getUID()}`).update({
            // posts: firestore.FieldValue.arrayUnion(image)
            order: firestore.FieldValue.arrayUnion(`${orderID}`)
        })

        this.afstore.doc(`posts/${orderID}`).set({
            desc,
            author: this.user.getUsername(),
            likes: [],
            effect: activeEffect
        })

        //TODO use server time
        // require('firebase-admin').firestore.FieldValue;

        //Pre-configure variables before pushing to firestore

        if (this.lowAccuracyCounter === 1) {
            this.orderStatus = "Require Manual Verification";
        } else {
            this.orderStatus = "Created Order";
        }

        this.orderItemsPredicted = {image1Classification:1}


        // Push to firestore
        this.afstore.doc(`order/${orderID}`).set({
            image: orderID,
            user: this.user.getUsername(),
            desc,

            // Order flow Upload Image -> Price Estimate -> Booking Date -> Payment -> Confirmation

            //Order Status:
            // 1: "Require Manual Verification"
            // 2: "Created Order"
            // 3: "Created Price Estimate"
            // 4: "Created Booking Date"
            // 5: "Completed Payment"
            // 6: "Order Confirmed"

            orderStatus: this.orderStatus,


            //Payment Status:
            // 0: "Booking Date Not Confirmed" Have not reached booking page
            // 1: "Paid"
            // 2: "Cash on delivery'
            // 3: "Payment failed"
            // ** Only after orderStatus == "Confirmed" fulfillmentStatus == "Order Placed"
            paymentStatus: "Booking Date Not Confirmed",


            //fulfillment Status:
            // 0: "Order Not Confirmed" Order not confirmed
            // 1: "Delivery Done"
            // 2: "Pick Up Done"
            // 3: "Enroute Pickup"
            // 4: "Order Placed"
            // ** Only after orderStatus == "Confirmed" fulfillmentStatus == "Order Placed"
            fulfillmentStatus: "Order Not Confirmed",
            orderItemsPredicted:this.classes[0]['className'],



            dateTimeOfOrder: now.format(),
            driverID: "Driver1234",
        })

        this.busy = false;
        this.imageURL = "";
        this.desc = "";

        if (this.lowAccuracyCounter === 1) {
            //skip estimate price, go to booking page directly
            this.route.navigate(['/booking/'+ orderID])
        } else {
            this.route.navigate(['/estimateprice/'+ orderID])
        }
    }

}
