import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {UserService} from "../user.service";
import { firestore } from 'firebase/app';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit, OnDestroy {

    postID: string
    post
    heartType: string = "heart-empty";
    postReference: AngularFirestoreDocument
    sub
    effect: string = '';
    pickUpAddress: any;
    private dateTimeOfOrder: any;
    dateTimeOfPickup;
    desc;
    driverID;
    dropOffAddress;
    fulfillmentStatus;
    image;
    note = '-';
    orderPrice;
    orderStatus;
    paymentStatus;
    recipientName;
    recipientNumber;
    private priceModel1: AngularFirestoreDocument<unknown>;
    itemPricing;
    orderItemsPredicted;
    orderItemsPredictedQty;
    subTotal;
    feedback;

    constructor(
        private route: ActivatedRoute, 
        private afs: AngularFirestore,
        private user: UserService,
        public alert: AlertController,
    ) { 

    }

    ngOnInit() {
		this.postID = this.route.snapshot.paramMap.get('id')
        this.postReference = this.post = this.afs.doc(`order/${this.postID}`)
        this.sub = this.postReference.valueChanges().subscribe(val => {
            this.post = val,
            this.dateTimeOfOrder = val.dateTimeOfOrder,
            this.dateTimeOfPickup = val.dateTimeOfPickup,
            this.desc = val.desc,
            this.driverID = val.driverID,
            this.dropOffAddress = val.dropOffAddress,
            this.pickUpAddress = val.pickUpAddress,
            this.fulfillmentStatus = val.fulfillmentStatus,
            this.image = val.image,
            this.note = val.note,
            this.orderPrice = val.orderPrice,
            this.orderStatus = val.orderStatus,
            this.paymentStatus = val.paymentStatus,
            this.recipientName = val.recipientName,
            this.recipientNumber = val.recipientNumber,
            this.feedback = val.feedback,
            this.orderItemsPredicted = Object.keys(val.orderItemsPredicted)[0],
            // console.log(this.orderItemsPredicted),
            this.orderItemsPredictedQty =Object.values(val.orderItemsPredicted)[0]
            // console.log(this.orderItemsPredictedQty)

        })

        this.priceModel1 = this.afs.doc(`priceModel/1`);
        this.priceModel1.valueChanges().subscribe(val => {
            // console.log(val.pricing[item]);
            // @ts-ignore
            this.itemPricing = val.pricing['bed'];
            // return val.pricing[item];
            // console.log(this.itemPricing);

        })
    }

    async showAlert(header: string, message: string) {
        const alert = await this.alert.create({
            header,
            message,
            buttons: ["Ok"]
        })

        await alert.present()

    }

    submitFeedback(){
        this.afs.collection('order').doc(this.postID).update({
            feedback: this.feedback,
        });
        this.showAlert("Feedback Submitted", this.feedback)
    }

    ngOnDestroy():void {
        this.sub.unsubscribe()
    }

    toggleHeart() {
        if(this.heartType == 'heart-empty') {
            this.postReference.update({
                likes: firestore.FieldValue.arrayUnion(this.user.getUID())
            })
        } else {
            this.postReference.update ({
                likes: firestore.FieldValue.arrayRemove(this.user.getUID())
            })
        }
    }
}
