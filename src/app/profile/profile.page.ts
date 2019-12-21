import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
export class ProfilePage implements OnInit, OnDestroy {

    userPosts
    postID
    username: any;
    private mainuser: AngularFirestoreDocument;
    sub
    private profilePic: any;
    private posts: any;

  constructor(
    public http: HttpClient,
    private afs: AngularFirestore,
    private user:UserService,
    private route: Router,
  ) { 
      this.mainuser = afs.doc(`users/${this.user.getUID()}`)
      this.sub = this.userPosts = this.mainuser.valueChanges().subscribe(event => {
          this.posts = event.posts
          this.username = event.username
          this.profilePic = event.profilePic
      })
  }

  ngOnDestroy() {
        this.sub.unsubscribe()
  }

  goTo(postID: string) {
        this.route.navigate(['/tabs/post/' + postID.split('/')[0]])
  }

  ngOnInit() {
  }

}
