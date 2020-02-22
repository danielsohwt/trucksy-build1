import { Component, ViewChild, OnInit} from '@angular/core';
import {FirebaseService} from "../../firebase.service";
import {Chart} from 'chart.js';
import * as moment from 'moment';
import {NgbDate, NgbCalendar,NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import  *  as  data  from  '../../../assets/afinn.json';
import { Router } from '@angular/router'

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
  final_list:any[] = [];
  @ViewChild('barCanvas', { static: true }) barCanvas;
  private barChart: any;


  constructor (public firebaseService: FirebaseService,private calendar: NgbCalendar,
    private http: HttpClient, public formatter: NgbDateParserFormatter
    ,public route: Router) {

    this.feedbacks(this.affin)
  }

  loading_json() {
    this.http.get('./affin.json')
    .subscribe((data) => this.displaydata(data));
  }
    displaydata(data) {this.affin = data;}

  feedbacks(affin) {
    var all = [];
    var feedbacklist=[]
    var users = []
    var orderId = [];
    var text = ''
    var postive = 0
    var negative = 0
    var neutral = 0
    var value = []
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
            postive +=1
          } else if (comparative > 0) {
            all_dict['feel']=("🙂")
            postive +=1
          }else if(comparative == 0 ){
            all_dict['feel']=("😐")
            neutral +=1
          }else {
            all_dict['feel']=("😕")
            negative +=1
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
      this.final_list = all
      value.push(postive, negative , neutral)
      this.basicChart3(value)
    })
  }
  ngOnInit() {
    // this.feedbacks(this.affin);
    // }
  } 



  basicChart3(value) {
    console.log(value)
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Positive','Negative','Neutral'],
        datasets: [{
                label: 'Sentiment analysis',
                data: value,
                backgroundColor: ["#0074D9", "#FF4136", "#2ECC40"],
                spanGaps: false,
        }]
      },
      options : {
        responsive: true,
        scales: {
          xAxes: [{
              display: true,
              scaleLabel: {
                  display: true,
                  labelString: "Feeling",
              }
          }],
          yAxes: [{
              ticks: {
                  beginAtZero: true,
              },
              display: true,
              scaleLabel: {
                  display: true,
                  labelString: "Count",
              }
          }]
      }
      }
    });

  }
}