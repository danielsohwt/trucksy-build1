import { Component, ViewChild, OnInit} from '@angular/core';
import {FirebaseService} from "../../firebase.service";
import {Chart} from 'chart.js';
import * as moment from 'moment';
import {NgbDate, NgbCalendar,NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import  *  as  data  from  '../../../assets/afinn.json';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './sentiment.component.html',
})
export class SentimentComponent implements OnInit {

  affin:  any  = (data  as  any).default;
  items: Array<any>;
  emoji: any[] = [];
  comparative_list: any[] = [];
  customer: any[] = [];
  messages:any[] = [];
  @ViewChild('barCanvas', { static: true }) barCanvas;
  private barChart: any;


  constructor (public firebaseService: FirebaseService,private calendar: NgbCalendar,
    private http: HttpClient, public formatter: NgbDateParserFormatter) {
   

    this.feedbacks()
  }

  // loading_json() {
  //   this.http.get('./affin.json')
  //   .subscribe((data) => this.displaydata(data));
  // }
    displaydata(data) {this.affin = data;}



  feedbacks() {
    var feedbacklist=[]
    var users = []
    var orderId = [];
    this.firebaseService.getOrders().subscribe(result => {
      this.items = result;
      this.items.forEach(function(child) {
        if (child.payload.doc.data().feedback != undefined) {
          feedbacklist.push(child.payload.doc.data().feedback)
          users.push(child.payload.doc.data().user)
          orderId.push(child.payload.doc.data().image)
        }
      })
      this.messages = feedbacklist
      console.log(this.messages)
      console.log(this.sentiment(feedbacklist))
      console.log(users)
      this.customer = users
      console.log(orderId)
    })
  }
  
  ngOnInit() {
    }

  sentiment(feedbacks) {
    feedbacks.forEach(feedback => {
      console.log(feedback)
      var totalscore = 0;
      var scorewords = [];
      var comparative = 0;
      var words = feedback.split(' ');
      for (var i =0; i< words.length; i++) {
        var word = words[i].toLowerCase();
        if (this.affin.hasOwnProperty(word)){
          totalscore += this.affin[word]
          scorewords.push(word + ":" + this.affin[word]);
        }
      }
      console.log(totalscore);
      console.log(scorewords);
      comparative = totalscore / words.length;
      console.log(comparative);
      this.comparative_list.push(comparative)
      if (comparative >= 0.4) {
        this.emoji.push("😃")
      } else if (comparative > 0) {
        this.emoji.push("🙂")
      }else if(comparative == 0 ){
        this.emoji.push("😐")
      }else {
        this.emoji.push("😕")
      }
      console.log(this.emoji)
      console.log(this.comparative_list)
    });
  }

}