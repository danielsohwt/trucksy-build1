import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { NgForm, FormGroup } from '@angular/forms';
import {AlertController} from "@ionic/angular";

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    username: string = "";
    password: string = "";
    isSubmitted = false;
    form: FormGroup;

    constructor(public afAuth: AngularFireAuth,
                public user: UserService,
                public alert: AlertController,
                public alertController: AlertController,
                public router: Router,) { }

    ngOnInit() {
    }

    async presentAlert(title: string, content: string) {

        const alert = await this.alertController.create({
            header: title,
            message: content,
            buttons: ['OK']
        })

        await alert.present()
    }


    async showAlert(header: string, message: string) {
        const alert = await this.alert.create({
            header,
            message,
            buttons: ["Ok"]
        })

        await alert.present()

    }

    async login() {
        const { username, password } = this
        try {
            //to do fix email
            const res = await this.afAuth.auth.signInWithEmailAndPassword(username, password)
            if(res.user){
                this.user.setUser({
                    username,
                    uid: res.user.uid
                })
                this.router.navigate(['/tabs'])
            }


        } catch (err) {
            console.dir(err)
            this.showAlert("Error", err.code)
            // if(err.code === "auth/user-not-found") {
            //     console.log("User not found")
            // }
        }
    }

    onSubmit(myForm: NgForm) {
        this.isSubmitted = true;
        console.log('onSubmit');
        console.log(myForm);
    }

}
