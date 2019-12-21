import { Component, OnInit, ViewChild } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'
import { firestore } from 'firebase/app';
import { Router } from '@angular/router'


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

    userPosts
    postID

  constructor(
    public http: HttpClient,
    private afs: AngularFirestore,
    private user:UserService,
    private route: Router,
  ) { 
      const posts = afs.doc(`users/${this.user.getUID()}`)
      this.userPosts = posts.valueChanges()
  }

  goTo(postID: string) {
        this.route.navigate(['/tabs/post/' + postID.split('/')[0]])
  }

  ngOnInit() {
  }

}
