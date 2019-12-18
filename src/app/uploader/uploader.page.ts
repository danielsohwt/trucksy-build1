import { Component, OnInit, ViewChild } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
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
    
    imageURL; string
    desc: string

    @ViewChild('fileButton') fileButton

    constructor(
        public http: HttpClient,
        public afstore: AngularFirestore,
        public user:UserService,
        public route: Router,
        ) { }

    ngOnInit() {
    }

    createPost() {
        const image = this.imageURL
        const desc = this.desc

        this.afstore.doc(`users/${this.user.getUID()}`).update({
            posts: firestore.FieldValue.arrayUnion(image)
        })

        this.afstore.doc(`posts/${image}`).set({
            desc,
            author: this.user.getUsername(),
            likes: []
        })

        // Todo set this order to auto increment
        this.afstore.doc(`order/${image}`).set({
            desc,
            user: this.user.getUsername(),
            likes: []  
        })


        this.route.navigate(['/estimateprice'])
    }

    uploadFile() {
        this.fileButton.nativeElement.click()
    }

    fileChanged(event) {
        const files = event.target.files

        const data = new FormData()
        data.append('file', files[0])
        data.append('UPLOADCARE_STORE', '1')
        data.append('UPLOADCARE_PUB_KEY', 'b9cc3f94e77d60a02f90')

        this.http.post('https://upload.uploadcare.com/base/', data)
        .subscribe(event => {
            console.log(event)
            this.imageURL = event.file
        })
}

}
