import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import * as firebase from 'firebase';
import { Router } from '@angular/router'
import { AngularFirestore } from '@angular/fire/firestore'
import {PhoneNumber} from "../PhoneNumber";
import { AlertController } from '@ionic/angular';
import { UserService } from '../user.service';
import {WindowService} from "../window.service";
import * as moment from 'moment';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

    firstName: string = ""
    lastName: string = ""
    username: string = ""
    password: string = ""
    cpassword: string = ""
    hpnumber: string = ""

    value: any;
    userType: any;

    windowRef: any;
    phoneNumber = new PhoneNumber();
    buttonClicked: boolean = false;
    verificationCode: string;

  constructor(
    public afAuth: AngularFireAuth,
    public alert: AlertController,
    public route: Router,
    public afstore: AngularFirestore,
    public user: UserService,
    public alertController: AlertController,
    private win: WindowService) { }

  ngOnInit() {
      this.windowRef = this.win.windowRef;
      this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');

  }

  selectUserType() {
      console.log(this.userType)
  }

  async presentAlert(title: string, content: string) {

      const alert = await this.alertController.create({
          header: title,
          message: content,
          buttons: ['OK']
      })

      await alert.present()
  }

  async register() {

    const { username, password, cpassword } = this
    if(password !== cpassword ) {
      this.showAlert("Error!", "Passwords don't match")
      return console.error("Password don't match")
    }

    this.buttonClicked = true;

    await this.windowRef.recaptchaVerifier.render();

  }


  async showAlert(header: string, message: string) {
    const alert = await this.alert.create({
      header,
      message,
      buttons: ["Ok"]
    })

    await alert.present()

  }

    sendLoginCode() {

        const appVerifier = this.windowRef.recaptchaVerifier;
        this.phoneNumber.line = this.hpnumber
        const num = this.phoneNumber.e164;

        console.log(num);

        firebase.auth().signInWithPhoneNumber(num, appVerifier)
            .then(result => {

                this.windowRef.confirmationResult = result;

            })
            .catch( error => console.log(error) );

    }

    verifyLoginCode() {
        this.windowRef.confirmationResult
            .confirm(this.verificationCode)
            .then(async result => {
                const { username, password } = this
                try{
                    const res = await this.afAuth.auth.createUserWithEmailAndPassword(username, password)
                    console.log(res)
                    let now = moment();
                    this.afstore.doc(`users/${res.user.uid}`).set({
                        firstName: this.firstName,
                        lastName: this.lastName,
                        username,
                        hpNumber: this.phoneNumber.e164,
                        userType: this.userType,
                        userRegisteredDateTime: now.format()
                    })

                    this.user.setUser({
                        username,
                        uid: res.user.uid
                    })

                    this.presentAlert('Success','You are registered!')
                    this.route.navigate(['/tabs'])

                } catch(error) {
                    console.dir(error)
                    this.showAlert("Error", error.message)
                }

            })
            .catch( error => console.log(error, 'Incorrect code entered?'));
    }

}
