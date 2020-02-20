import { Component, ViewChild, OnInit } from '@angular/core';
import {FirebaseService} from "../../firebase.service";
import {Chart} from 'chart.js';
import * as moment from 'moment';
import {NgbDate, NgbCalendar,NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardComponent implements OnInit {
  show: boolean = true
  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;
  lastTenDays: NgbDate;
  items: Array<any>;
  order: any[] = [];
  now: any;
  busy: boolean = false;

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

  constructor (public firebaseService: FirebaseService,private calendar: NgbCalendar,public formatter: NgbDateParserFormatter,) {

    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 1);
    // const firstDay = this.formatter.format(calendar.getNext(calendar.getToday(), 'd', -this.fromDate.day+1));
    // // Convert ngbDate to 2020-10-01 format
    // const nextDate = calendar.getNext(this.fromDate, 'm', 1);
    // const lastDay = this.formatter.format(calendar.getNext(nextDate, 'd', -nextDate.day+1));
    const start = this.formatter.format(this.fromDate);
    const end = this.formatter.format(this.toDate);
    // // retrieveData based on the range date
    this.retrieveData(start, end);
    // this.sales_over_time(firstDay, lastDay);
  }
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      console.log(this.fromDate)
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
      console.log(this.fromDate)
      console.log(this.toDate)
      const start = this.formatter.format(this.fromDate);
      const end = this.formatter.format(this.toDate);
      // const firstDay = this.formatter.format(this.calendar.getNext(this.fromDate, 'd', -this.fromDate.day+1));
      // // Convert ngbDate to 2020-10-01 format
      // const nextDate = this.calendar.getNext(this.toDate, 'm', 1);
      // const lastDay = this.formatter.format(this.calendar.getNext(nextDate, 'd', -nextDate.day+1));
      const startMonth = this.fromDate.month;
      const endMonth = this.toDate.month;
      this.retrieveData(start, end);
      this.sales_over_time(start, end,startMonth, endMonth);
    } else {
      this.toDate = null;
      this.fromDate = date;
      console.log(this.fromDate)
      // var start = this.formatter.format(this.fromDate);
      // var end = this.formatter.format(this.calendar.getNext(this.fromDate, 'd', 1));
      // this.retrieveData(start,end);
    }
  }

  retrieveData(start, end) {
    this.busy = true
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
    var itemsList = [];
    this.firebaseService.searchOrdersByDate(start, end).subscribe(result => {
      this.items = result;
      if (this.items.length === 0) {
        this.total = 0;
        this.totalorder = 0;
        this.failed = 0;
        this.paid = 0;
        this.cashOnDev = 0;
        this.show = false;
      } else {
        this.show = true;
        this.items.forEach(function(child){
          if (child.payload.doc.data().paymentStatus == 'Paid') {
            console.log(child.payload.doc.data().orderPrice)

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
            console.log(child.payload.doc.data().orderPrice)
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
        })
        this.paid = sum1;
        this.notconfirmed = sum2;
        this.cashOnDev = sum3;
        this.total = sum1 + sum3;
        console.log(this.total);
        this.totalorder = total_order;
        this.failed = failedToPaid;
        this.avg_order= this.total / this.totalorder;
        this.avg_paid = sum1 / count1;
        this.avg_cod = sum3 / count3;
        // console.log(order_date_array);
        // Counting the occurrences / frequency of array elements
        occurrences = this.frequency(order_date_array);
        day_occurrences = this.frequency(day_list);
        // console.log(occurrences);

        // occurrences[0].forEach(element => {
        //   console.log(element);
        //   console.log(this.sales_over_time(element));
        // });
        // console.log(this.frequency(sales_per_order));
        // console.log(this.sales_over_time());

        // console.log(occurrences);
        temp_order_date = this.order_per_date(occurrences, start, end);
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
        // this.basicChart2(Yarray,tempcount);
        this.basicChart3(Xday,Yorder1);
       }
    });
  }


  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate, input: string): NgbDate {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

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
  order_per_date(arr,start, end){
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
    var month = {0:'Jan',1:'Feb',2:'March',3:'April',4:'May',5:'Jun',6:'Jul',7:'Aug',
    8:'Sept',9:'Oct',10:'Nov',11:'Dec'};
    this.key= Object.keys(arr);
    this.value = Object.values(arr);
    var a = arr[0], b = arr[1], c = [], d=[], count1 =0, e=count[1];
    // console.log(e)
    for ( var i = 0; i < 12; i++ ) {
      d.push(month[i]);
      if (this.key.includes(i.toString())) {
        count1 += 1;
        // console.log((e[count1-1]));
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

  sales_over_time(start,end,startMonth,endMonth) {
    var day = {};
    var sum = 0;
    var list1 = [];
    var salelist = []
    var dict = {};
    var dict1 = {};
    var Xdate = [];
    var Yorder = [];
    var sales_list = [];
    var order_date_array = [];
    var order_month_array = [];
    var occurrences = [];
    var month = ['Jan','Feb','March','April','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
    var monthDict = {};
    console.log(start);
    console.log(end);
    for ( var i = startMonth - 1; i < endMonth; i++ ) {
      console.log(month[i]);
      monthDict[month[i]] = i + 1;
    }
    console.log(monthDict);

    this.firebaseService.searchOrdersByDate(start, end)
    .subscribe(result => {
      this.items = result;
      this.items.forEach(function(child){
        if (child.payload.doc.data().paymentStatus == 'Paid' ||
        child.payload.doc.data().paymentStatus == 'Cash On Delivery') {
          order_month_array.push(moment(child.payload.doc.data().dateTimeOfOrder).month());
          order_date_array.push(moment(child.payload.doc.data().dateTimeOfOrder).date());
          console.log(order_month_array);
          list1.push(moment(child.payload.doc.data().dateTimeOfOrder).date());
          salelist.push(child.payload.doc.data().orderPrice);

          if(dict1[moment(child.payload.doc.data().dateTimeOfOrder).month()] == undefined){
            dict1[moment(child.payload.doc.data().dateTimeOfOrder).month()] = child.payload.doc.data().orderPrice;
            // dict[moment(child.payload.doc.data().dateTimeOfOrder).date()].push(child.payload.doc.data().orderPrice);

          }else{
            dict1[moment(child.payload.doc.data().dateTimeOfOrder).month()] = 
            dict1[moment(child.payload.doc.data().dateTimeOfOrder).month()] +
          (child.payload.doc.data().orderPrice);}
          console.log(dict1);
          if(dict[moment(child.payload.doc.data().dateTimeOfOrder).date()] == undefined){
            dict[moment(child.payload.doc.data().dateTimeOfOrder).date()] = child.payload.doc.data().orderPrice;
            // dict[moment(child.payload.doc.data().dateTimeOfOrder).date()].push(child.payload.doc.data().orderPrice);

          }else{
          dict[moment(child.payload.doc.data().dateTimeOfOrder).date()] = dict[moment(child.payload.doc.data().dateTimeOfOrder).date()] +
          (child.payload.doc.data().orderPrice);}

        }
      });
      // return dict;
      // console.log(order_date_array);
      // console.log(dict);
      // occurrences = this.frequency(order_date_array);
      // console.log(occurrences);
      occurrences = this.frequency(order_month_array);
      console.log(occurrences)

      this.key = Object.keys(dict1);
      sales_list=this.avg_order_value(dict1,occurrences);
      console.log(sales_list);
      Xdate = sales_list[1];
      Yorder = sales_list[0];
      // console.log(Xdate);
      // console.log(Yorder);
      this.basicChart4(Xdate,Yorder);
      });
    }


  basicChart1(key, value) {

    if(this.barChart) {
			this.barChart.destroy();
    }
    
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

    if(this.bar1Chart) {
			this.bar1Chart.destroy();
    }
		
    this.bar1Chart = new Chart(this.bar1Canvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Sun','Mon','Tues','Wed','Thur','Fri','Sat'],
        datasets: [{
                label: 'Number of Orders on a particular day',
                data: value,
                backgroundColor: ["#0074D9", "#FF4136", "#2ECC40", "#FF851B",'##f707b7','#076964','#bf22a5'],
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
    if(this.lineChart) {
			this.lineChart.destroy();
    }
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: key,
        datasets: [{
                label: 'Number of Order Per Day',
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
                  suggestedMin: 0,
                  suggestedMax: 18,
                  stepSize: 2,
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
    if(this.line1Chart) {
			this.line1Chart.destroy();
    }
    this.line1Chart = new Chart(this.line1Canvas.nativeElement, {
      type: 'line',
      data: {
        labels: key,
        datasets: [{
                label: 'Average Order Value Per Month',
                data: value,
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
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

  // basicChart2(key, value) {
  //   this.pieChart = new Chart(this.pieCanvas.nativeElement, {
  //     type: 'polarArea',
  //     data: {
  //       labels: key,
  //       datasets: [{
  //               label: 'Total Number Of Orders per Payment Status',
  //               fill: true,
  //               lineTension:0.1,
  //               backgroundColor: ["#0074D9", "#FF4136", "#2ECC40", "#FF851B"],
  //               borderCapStyle: 'butt',
  //               data: value,
  //               spanGaps: false,
  //       }]
  //     },
  //     options : {
  //       responsive: true,
  //     }
  //   });
  // }
}
