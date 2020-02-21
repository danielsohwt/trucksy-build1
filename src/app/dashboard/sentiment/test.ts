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
   

    this.feedbacks(this.affin)
  }

  // loading_json() {
  //   this.http.get('./affin.json')
  //   .subscribe((data) => this.displaydata(data));
  // }
    displaydata(data) {this.affin = data;}

  feedbacks(affin) {
    var all = [];
    var feedbacklist=[]
    var users = []
    var orderId = [];
    var text = ''
    this.firebaseService.getOrders().subscribe(result => {
      this.items = result;
      this.items.forEach(function(child) {
        var all_dict = {};
        if (child.payload.doc.data().feedback != undefined) {
          feedbacklist.push(child.payload.doc.data().feedback)
          text=child.payload.doc.data().feedback
          var totalscore = 0;
          var scorewords = [];
          var comparative = 0;
          var words = text.split(' ');
          for (var i =0; i< words.length; i++) {
            var word = words[i].toLowerCase();
            if (affin.hasOwnProperty(word)){
              totalscore += affin[word]
              scorewords.push(word + ":" + affin[word]);
            }
          }
          comparative = totalscore / words.length;
          all_dict['score'] = comparative
          if (comparative >= 0.4) {
            all_dict['feel']=("😃")
          } else if (comparative > 0) {
            all_dict['feel']=("🙂")
          }else if(comparative == 0 ){
            all_dict['feel']=("😐")
          }else {
            all_dict['feel']=("😕")
          }

          all_dict['feedback'] = child.payload.doc.data().feedback
          users.push(child.payload.doc.data().user)
          all_dict['user'] = child.payload.doc.data().user
          orderId.push(child.payload.doc.data().image)
          all_dict['id'] = child.payload.doc.data().image
          all.push(all_dict)
        }
      })

      this.messages = feedbacklist
      console.log(this.messages)
      console.log(users)
      this.customer = users
      console.log(orderId)
      console.log(all)
    })
  }
  
  ngOnInit() {
    this.feedbacks(this.affin);
    }

}