import { Component, ViewChild, OnInit } from '@angular/core';
import {FirebaseService} from "../../firebase.service";
import {Chart} from 'chart.js';
import * as moment from 'moment';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardComponent implements OnInit {
  items: Array<any>;
  order: any[] = [];
  now: any;
  // public Xarray: any[] = [];
  // public Yarray: any[] = [];
  public paid: number;
  public notconfirmed: number;
  public cashOnDev: number;
  public failed: number;
  public total: number;
  public totalorder: number;
  public avg_order: number;
  public count_order: any[]=[];
  public sales: number;
  public avg_paid: number;
  public avg_cod: number;
  key;
  value;
  @ViewChild('barCanvas', { static: true }) barCanvas;
  private barChart: any;
  @ViewChild('bar1Canvas', { static: true }) bar1Canvas;
  private bar1Chart: any;
  @ViewChild('lineCanvas', { static: true }) lineCanvas;
  private lineChart: any;
  @ViewChild('line1Canvas', { static: true }) line1Canvas;
  private line1Chart: any;
  @ViewChild('pieCanvas', { static: true }) pieCanvas;
  private pieChart: any;
  
  constructor (public firebaseService: FirebaseService,) {
    
    this.getall();
    console.log(this.sales_over_time());
  }

  getall() {
    var sum1 = 0;
    var sum2 = 0;
    var sum3 = 0;
    var sum4 = 0;
    var count1 = 0;
    var count2 = 0;
    var count3 = 0;
    var count4 = 0;
    var Xarray = [];
    var Yarray = [];
    var order_date_array = [];
    var Xdate = [];
    var Yorder = [];
    var Xday = [];
    var Yorder1 = [];
    var occurrences = [];
    var temp_order_date= [];
    var temp_order_day= [];
    var total_order = 0;
    var failedToPaid = 0;
    var tempcount= [];
    var day_list=[];
    var day_occurrences = [];

    this.firebaseService.getOrders()
        .subscribe(result => {
          this.items = result;
          this.items.forEach(function(child){
            if (child.payload.doc.data().paymentStatus == 'Paid') {
              sum1 += (child.payload.doc.data().orderPrice);
              total_order += 1;
              count1+=1
              day_list.push(moment(child.payload.doc.data().dateTimeOfOrder).day());
              order_date_array.push(moment(child.payload.doc.data().dateTimeOfOrder).date());
              // console.log(Xarray);
              // console.log(sum1);
            } else if (child.payload.doc.data().paymentStatus == 'Booking Date Not Confirmed') {
              sum2 += (child.payload.doc.data().orderPrice);
              // console.log(sum2);
              count2+=1
            } else if (child.payload.doc.data().paymentStatus == 'Cash On Delivery') {
              total_order += 1;
              count3+=1
              order_date_array.push(moment(child.payload.doc.data().dateTimeOfOrder).date());
              sum3 += (child.payload.doc.data().orderPrice);
              day_list.push(moment(child.payload.doc.data().dateTimeOfOrder).day());
              // console.log(sum3);
            } else if (child.payload.doc.data().paymentStatus == 'Payment Failed' || 'Failed Payment') {
              sum4 += (child.payload.doc.data().orderPrice);
              failedToPaid += 1;
              count4+=1
              // console.log(sum4);

            }
            // console.log(order_date_array);
          });
          this.paid = sum1;
          this.notconfirmed = sum2;
          this.cashOnDev = sum3;
          this.total = sum1 + sum3;
          this.totalorder = total_order;
          this.failed = failedToPaid;
          this.avg_order= this.total / this.totalorder;
          this.avg_paid = sum1 / count1;
          this.avg_cod = sum3 / count3;
          console.log(order_date_array);
          // Counting the occurrences / frequency of array elements
          occurrences = this.frequency(order_date_array);
          day_occurrences = this.frequency(day_list);
          console.log(occurrences);

          // occurrences[0].forEach(element => {
          //   console.log(element);
          //   console.log(this.sales_over_time(element));
          // });
          // console.log(this.frequency(sales_per_order));
          console.log(this.sales_over_time());

          // console.log(occurrences);
          temp_order_date = this.order_per_date(occurrences);
          Xdate = temp_order_date[1];
          Yorder = temp_order_date[0];
          this.basicChart(Xdate, Yorder);
          temp_order_day = this.order_per_day(day_occurrences);
          // console.log(temp_order_date);
          Xday = temp_order_day[1];
          Yorder1 = temp_order_day[0];
          Xarray.push(sum1,sum2,sum3,sum4);
          // console.log(Xarray)
          Yarray = ['Paid','Booking Not Confirmed','COD','Payment Failed']
          // console.log(Yarray)
          tempcount.push(count1,count2,count3,count4);
          this.count_order=tempcount;
          this.basicChart1(Yarray, Xarray);
          this.basicChart2(Yarray,tempcount);
          this.basicChart3(Xday,Yorder1);
        });
      }
            // console.log(child.payload.doc.data().orderPrice);
            // console.log(child.payload.doc.data().paymentStatus);)
  ngOnInit() {
  }

  // Counting the occurrences / frequency of array elements
  frequency(arr) {
    var a = [], b = [], prev;

    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = arr[i];
    }

    return [a, b];
  }
  // assume 31 days each month
  order_per_date(arr){
    var a = arr[0], b = arr[1], c = [], d=[], count =0;
    for ( var i = 1; i < 32; i++ ) {
      d.push(i);
      if (a.includes(i)) {
        count += 1;
        c.push(b[count - 1]);
      } else {
        c.push(0);
      }
    }
    return [c, d];
  }
  avg_order_value(arr,count){
    this.key= Object.keys(arr);
    this.value = Object.values(arr);
    var a = arr[0], b = arr[1], c = [], d=[], count1 =0, e=count[1];
    console.log(e)
    for ( var i = 1; i < 32; i++ ) {
      d.push(i);
      if (this.key.includes(i.toString())) {
        count1 += 1;
        console.log((e[count1-1]));
        c.push(Math.round(((this.value[count1 - 1])/(e[count1-1]))*100)/100);
      } else {
        c.push(0);
      }
    }
    return [c, d];
  }

  order_per_day(arr){
    var a = arr[0], b = arr[1], c = [], d=[],count1 =0;
    for ( var i = 0; i < 7; i++ ) {
      d.push(i);
      if (a.includes(i)) {
        count1 += 1;
        c.push(b[count1 - 1]);
      } else {
        c.push(0);
      }
    }
    return [c, d];
  }

  sales_over_time() {
    var day = {};
    var sum = 0;
    var list1 = [];
    var salelist = []
    var dict = {};
    var Xdate = [];
    var Yorder = [];
    var sales_list = [];
    var order_date_array = [];
    var occurrences = [];

    this.firebaseService.getOrders()
    .subscribe(result => {
      this.items = result;
      this.items.forEach(function(child){
        if (child.payload.doc.data().paymentStatus == 'Paid' ||
        child.payload.doc.data().paymentStatus == 'Cash On Delivery') {
          order_date_array.push(moment(child.payload.doc.data().dateTimeOfOrder).date());
          list1.push(moment(child.payload.doc.data().dateTimeOfOrder).date());
          salelist.push(child.payload.doc.data().orderPrice);
          if(dict[moment(child.payload.doc.data().dateTimeOfOrder).date()] == undefined){
            dict[moment(child.payload.doc.data().dateTimeOfOrder).date()] = child.payload.doc.data().orderPrice;
            // dict[moment(child.payload.doc.data().dateTimeOfOrder).date()].push(child.payload.doc.data().orderPrice);

          }
          dict[moment(child.payload.doc.data().dateTimeOfOrder).date()] = dict[moment(child.payload.doc.data().dateTimeOfOrder).date()]+
          (child.payload.doc.data().orderPrice);

        }
      });
      // return dict;
      console.log(order_date_array);
      console.log(dict);
      occurrences = this.frequency(order_date_array);
      console.log(occurrences);

      this.key = Object.keys(dict);
      sales_list=this.avg_order_value(dict,occurrences);
      Xdate = sales_list[1];
      Yorder = sales_list[0];
      console.log(Xdate);
      console.log(Yorder);
      this.basicChart4(Xdate,Yorder);
      });
    }


  basicChart1(key, value) {
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: key,
        datasets: [{
                label: 'Payment Status',
                data: value,
                backgroundColor: ["#0074D9", "#FF4136", "#2ECC40", "#FF851B"],
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
                  labelString: "Payment Status",
              }
          }],
          yAxes: [{
              ticks: {
                  beginAtZero: true,
                  stepsize:2000,
              },
              display: true,
              scaleLabel: {
                  display: true,
                  labelString: "SGD",
              }
          }]
      }
      }
    });

  }

  basicChart3(key, value) {
    this.bar1Chart = new Chart(this.bar1Canvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Sun','Mon','Tues','Wedn','Thurs','Fri','Sat'],
        datasets: [{
                label: 'Number of Orders on a particular day',
                data: value,
                backgroundColor: ["#0074D9", "#FF4136", "#2ECC40", "#FF851B"],
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
                  labelString: "Day",
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

  basicChart(key, value) {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: key,
        datasets: [{
                label: 'Number of Order per day',
                fill: false,
                pointRadius:0,
                data: value,
                borderColor: '#0074D9',
                backgroundColor: '#0074D9',
                lineTension: 0,
        }]
      },
      options : {
        responsive: true,
        scales: {
          xAxes: [{
              display: true,
              scaleLabel: {
                  display: true,
                  labelString: "Date",
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

  basicChart4(key, value) {
    this.line1Chart = new Chart(this.line1Canvas.nativeElement, {
      type: 'line',
      data: {
        labels: key,
        datasets: [{
                label: 'Number of Order per day',
                fill: false,
                pointRadius:0,
                data: value,
                borderColor: '#fe8b36',
                backgroundColor: '#fe8b36',
                lineTension: 0,
        }]
      },
      options : {
        responsive: true,
        scales: {
          xAxes: [{
              display: true,
              scaleLabel: {
                  display: true,
                  labelString: "Date",
              }
          }],
          yAxes: [{
              ticks: {
                  beginAtZero: true,
              },
              display: true,
              scaleLabel: {
                  display: true,
                  labelString: "Avg Order Value",
              }
          }]
      }
      }
    });
  }

  basicChart2(key, value) {
    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'polarArea',
      data: {
        labels: key,
        datasets: [{
                label: 'Total Number Of Orders per Payment Status',
                fill: true,
                lineTension:0.1,
                backgroundColor: ["#0074D9", "#FF4136", "#2ECC40", "#FF851B"],
                borderCapStyle: 'butt',
                data: value,
                spanGaps: false,
        }]
      },
      options : {
        responsive: true,
      }
    });
  }





}
