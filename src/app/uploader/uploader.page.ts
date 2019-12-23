import { Component, Directive, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { Router } from '@angular/router';
import * as tf from '@tensorflow/tfjs';
import { IMAGENET_CLASSES } from '../../assets/imagenet-classes';


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

    imageURL; string;
    desc: string;
    busy: boolean = false;
    noFace: boolean = false;



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
        if (!file || !file.type.match("image.*")) {
            return;
        }

        this.classes = [];

        const reader = new FileReader();
        reader.onload = e => {
            this.img.nativeElement.src = e.target["result"];
            this.predict(this.img.nativeElement);
        };
        reader.readAsDataURL(file);
    }

    async predict(imageData: ImageData): Promise<any> {
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
        this.classes = await this.getTopKClasses(logits, TOPK_PREDICTIONS);
        const totalTime = performance.now() - startTime;
        console.log(`Done in ${Math.floor(totalTime)}ms`);
    }

    async getTopKClasses(logits, topK): Promise<any[]> {
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
            topClassesAndProbs.push({
                className: IMAGENET_CLASSES[topkIndices[i]],
                probability: topkValues[i]
            });
        }
        return topClassesAndProbs;
    }

    // End AI Stuff

    createPost() {
        this.busy = true
        const image = this.imageURL
        const activeEffect = this.activeEffect
        const desc = this.desc

        this.afstore.doc(`users/${this.user.getUID()}`).update({
            // posts: firestore.FieldValue.arrayUnion(image)
            posts: firestore.FieldValue.arrayUnion(`${image}/${activeEffect}`)
        })

        this.afstore.doc(`posts/${image}`).set({
            desc,
            author: this.user.getUsername(),
            likes: [],
            effect: activeEffect
        })

        // Todo set this order to auto increment
        this.afstore.doc(`order/${image}`).set({
            image: image,
            user: this.user.getUsername(),
            desc,
            paymentStatus: "Paid",
            //Payment Status: 1: "Paid" 2: "Cash on delivery' 3: "Payment failed"
            fulfillmentStatus: "Order Placed",
            //fulfillment Status: 1: "Delivery Done" 2: "Pick Up Done" 3: "Enroute Pickup" 4: "Order Placed"
            orderItemsPredicted: {
                        chairs: 2,
                        tables: 3,
                        washer: 1
                        },
            orderItemsActual: {
                            chairs: 2,
                            tables: 3,
                            washer: 1
                            },
            orderPrice: 100.12,
            pickUpAddress: "Blk 123 Pick Up Road",
            dropOffAddress: "Blk 123 Drop off Road",
            dateTimeOfOrder: "22 Dec 19 12pm",
            dateTimeOfPickup: "23 Dec 19 1pm",
            dateTimeOfDropoff: "23 Dec 19 2pm",
            driverID: "Driver1234",
        })

        this.busy = false;
        this.imageURL = "";
        this.desc = "";
        this.route.navigate(['/estimateprice'])
    }

    uploadFile() {
        this.fileButton.nativeElement.click()
    }

    setSelected(effect: string) {
        this.activeEffect = this.effects[effect]
    }


    fileChanged(event) {
        this.busy = true
        const files = event.target.files

        const data = new FormData()
        data.append('file', files[0])
        data.append('UPLOADCARE_STORE', '1')
        data.append('UPLOADCARE_PUB_KEY', 'b9cc3f94e77d60a02f90')

        // post method
        this.http.post('https://upload.uploadcare.com/base/', data)
        .subscribe(event => {
            console.log(event)
            this.imageURL = event['file']
            console.log(this.imageURL)
            this.busy = false
            this.http.get(`https://ucarecdn.com/${this.imageURL}/detect_faces/`)
                .subscribe(event => {
                    this.noFace = event['faces'] == 0
                })
        })
}

}
