import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {AngularFireDatabase} from '@angular/fire/database';
import { HttpClient } from '@angular/common/http';

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

    const idempotencyKey = paymentId;
    const source = token.id;
    const currency = 'sgd';
    const charge = {amount, currency, source, idempotencyKey, dateTimeOfPickup, pickUpAddress, dropOffAddress};

    //TODO: change host
    this.http.post('http://localhost:4000/charge',
        {amount, currency, source, idempotencyKey, dateTimeOfPickup, pickUpAddress, dropOffAddress
        }).subscribe(
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
