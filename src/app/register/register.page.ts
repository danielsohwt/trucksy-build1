import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { auth } from 'firebase/app'
import { Router } from '@angular/router'
import { AngularFirestore } from '@angular/fire/firestore'

import { AlertController } from '@ionic/angular';
import { UserService } from '../user.service';
import * as moment from 'moment';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

    username: string = ""
    password: string = ""
    cpassword: string = ""
    value: any;
    userType: any;

  constructor(
    public afAuth: AngularFireAuth,
    public alert: AlertController,
    public route: Router,
    public afstore: AngularFirestore,
    public user: UserService,
    public alertController: AlertController) { }

  ngOnInit() {
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
    try{
      const res = await this.afAuth.auth.createUserWithEmailAndPassword(username, password)
      console.log(res)
      let now = moment();
      this.afstore.doc(`users/${res.user.uid}`).set({
          username,
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

  }

  async showAlert(header: string, message: string) {
    const alert = await this.alert.create({
      header,
      message,
      buttons: ["Ok"]
    })

    await alert.present()

  }

}
