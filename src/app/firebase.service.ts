import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {

    constructor(public db: AngularFirestore) {}

    // getAvatars(){
    //     return this.db.collection('/avatar').valueChanges()
    // }
    //
    // getUser(userKey){
    //     return this.db.collection('users').doc(userKey).snapshotChanges();
    // }
    //
    // updateUser(userKey, value){
    //     value.nameToSearch = value.name.toLowerCase();
    //     return this.db.collection('users').doc(userKey).set(value);
    // }
    //
    // deleteUser(userKey){
    //     return this.db.collection('users').doc(userKey).delete();
    // }

    getOrders(){
        return this.db.collection('order').snapshotChanges();
    }

    getUsers(){
        return this.db.collection('users').snapshotChanges();
    }

    searchUsers(searchValue){
        return this.db.collection('order',ref => ref.where('user', '>=', searchValue)
            .where('user', '<=', searchValue + '\uf8ff'))
            .snapshotChanges()
    }

    searchPaymentStatus(searchValue){
        return this.db.collection('order',ref => ref.where('paymentStatus', '>=', searchValue)
            .where('paymentStatus', '<=', searchValue + '\uf8ff'))
            .snapshotChanges()
    }

    //
    searchOrdersByDate(start,end){
        return this.db.collection('order',ref => ref.orderBy('dateTimeOfOrder').startAt(start).endAt(end)).snapshotChanges();
    }
    //
    //
    // createUser(value, avatar){
    //     return this.db.collection('users').add({
    //         name: value.name,
    //         nameToSearch: value.name.toLowerCase(),
    //         surname: value.surname,
    //         age: parseInt(value.age),
    //         avatar: avatar
    //     });
    // }
}
