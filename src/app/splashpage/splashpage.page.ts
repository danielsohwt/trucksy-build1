import { Component, OnInit, ViewChild } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { Router } from '@angular/router'

@Component({
  selector: 'app-splashpage',
  templateUrl: './splashpage.page.html',
  styleUrls: ['./splashpage.page.scss'],
})
export class SplashpagePage implements OnInit {

    constructor(public route: Router) { }

    ngOnInit() {
    }

    toLogin() {
        this.route.navigate(['/login'])
    }

    toRegister() {
        this.route.navigate(['/register'])
    }
  
}
