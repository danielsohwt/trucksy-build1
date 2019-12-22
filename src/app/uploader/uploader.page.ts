import { Component, Directive, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { Router } from '@angular/router'

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.page.html',
  styleUrls: ['./uploader.page.scss'],
})
export class UploaderPage implements OnInit {
    
    imageURL; string;
    desc: string;
    busy: boolean = false;
    noFace: boolean = false;


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
    }

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
            paymentStatus: "",
            //Payment Status: 1: Paid 2: Cash on delivery 3:Payment failed
            fulfillmentStatus: "",
            //fulfillment Status: 1: Delivery Done 2: Pick Up Done 3:Enroute Pickup 4: Order placed
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
            pickUpAddress: "",
            dropOffAddress: "",
            dateTimeOfOrder: "",
            dateTimeOfPickup: "",
            dateTimeOfDropoff: "",
            driverID: "",
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
