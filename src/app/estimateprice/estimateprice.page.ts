import { Component, OnInit, ViewChild } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { Router } from '@angular/router'

@Component({
  selector: 'app-estimateprice',
  templateUrl: './estimateprice.page.html',
  styleUrls: ['./estimateprice.page.scss'],
})
export class EstimatepricePage implements OnInit {

  constructor(public route: Router,
    ) { }

    ngOnInit() {
    }

    placeBooking() {
        this.route.navigate(['/booking'])
    }

}
