import {Component, Directive, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { Router } from '@angular/router'
import {AlertController} from "@ionic/angular";

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.page.html',
    styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit, OnDestroy {

    profilePic: any;
    mainuser: AngularFirestoreDocument
    sub: any;
    username: string;
    busy: boolean = false;
    password: string
    newpassword: string

    @ViewChild('fileBtn', { static: false }) fileBtn;

    constructor(
        public http: HttpClient,
        private afs: AngularFirestore,
        private user: UserService,
        public route: Router,
        private alertController: AlertController,
    ) {
        this.mainuser = afs.doc(`users/${user.getUID()}`)
        this.sub = this.mainuser.valueChanges().subscribe(event => {
            this.username = event.username
            this.profilePic = event.profilePic
        })
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.sub.unsubscribe()
    }

    updateProfilePic() {
        this.fileBtn.nativeElement.click()
    }

    uploadPic(event) {
        const files = event.target.files

        const data = new FormData()
        data.append('file', files[0])
        data.append('UPLOADCARE_STORE', '1')
        data.append('UPLOADCARE_PUB_KEY', '3f6ba0e51f55fa947944')

        // post method
        this.http.post('https://upload.uploadcare.com/base/', data)
            .subscribe(event => {
                const uuid = event['file']
                this.mainuser.update({
                    profilePic: uuid
                })

            })

    }

    async presentAlert(title: string, content: string) {
        const alert = await this.alertController.create({
            header: title,
            message: content,
            buttons: ['OK']
        })

        await alert.present()
    }

    async updateDetails() {
        this.busy = true

        if(!this.password) {
            this.busy = false
            return this.presentAlert('Error!', 'You have to enter a password')
        }

        try {
            // console.log(this.user.getUsername())
            // console.log(this.password)
            await this.user.reAuth(this.user.getUsername(), this.password)
        } catch(error) {
            this.busy = false
            console.log(error)
            return this.presentAlert('Error!', 'Wrong password!')
        }

        if(this.newpassword) {
            await this.user.updatePassword(this.newpassword)
        }

        if(this.username !== this.user.getUsername()) {
            await this.user.updateEmail(this.username)
            this.mainuser.update({
                username: this.username
            })
        }

        this.password = ""
        this.newpassword = ""
        this.busy = false

        await this.presentAlert('Done!', 'Your profile was updated!')

        this.route.navigate(['/tabs/feed'])


    }
}
