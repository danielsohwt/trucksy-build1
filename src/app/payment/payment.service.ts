import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {AngularFireDatabase} from '@angular/fire/database';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  userId: string;
  stripe: any;

  constructor(private db: AngularFireDatabase,
              private afAuth: AngularFireAuth,
              private http: HttpClient) {
    this.afAuth.authState.subscribe((auth) => {
      if (auth) {
        this.userId = auth.uid;
        console.log(this.userId);
      }
    });
  }

  processPayment(token: any, amount, orderId, dateTimeOfPickup, pickUpAddress, dropOffAddress) {
    const payment = {token, amount};
    const paymentId = this.db.list(`payments/${this.userId}/${orderId}`).push(payment).key;
    console.log('amount=', amount);
    console.log('paymentId', paymentId);
    console.log('source=', token.id);

    const userId = this.userId
    const idempotencyKey = paymentId;
    const source = token.id;
    const currency = 'sgd';
    const charge = { userId, amount, currency, source, idempotencyKey, orderId, dateTimeOfPickup, pickUpAddress, dropOffAddress};

    this.http.post(environment.backendURL, charge)
        .subscribe(
        (res) => {
          console.log('Server response: ', res);
          this.db.list(`/payments/${this.userId}/${orderId}/${paymentId}`).set('payment', res);
          this.db.list(`/payments/${this.userId}/${orderId}/${paymentId}/token`).set('used', true);
        },
        (err) => {
          console.log(err);
        });

  }
}
