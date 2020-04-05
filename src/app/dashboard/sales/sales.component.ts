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
  templateUrl: './sales.component.html',
})
export class SalesComponent implements OnInit {

//   affin:  any  = (data  as  any).default;
  items: Array<any>;
  public sales17: number;
  public sales18: number;
  public sales19: number;
  public totalsales: number;

  charData = {
    "past_data" :[1000,100,1600,1990,9955,12870,11930,10320,11845,12660,15220,23390,
      16590,11080,14200,14650,20265,17560,19805,15755,13610,13155,14260,17190,
      13235,6910,12087,11940,19600,18630,8910,16220,11130,12470,11610,18190],
    'linear_regression' : [9685, 9841,	9997,	10153,	10309,	10464,	10620,	10776,	10932,	11088,	11244,	11399,	11555,	11711,	
      11867,	12023,	12179,	12334,	12490,	12646,	12802,	12958,	13114,	13270,	13425,	13581,
      13737,	13893,	14049,	14205,	14360,	14516,	14672,	14828,	14984,	15140],
    'seasonality_analysis' :[8017,	4780,	7486,	9323,	12237,	13786,	11592,	12239,	10740,	11399,	12406,	13378,	9565,	5689,
        8887,	11040,	14457,	16250,	13633,	14363,	12577,	13322,	14470,	15573,	11113,	6597,	10287,	12757,
        16677,	18714,	15674,	16487,	14415,	15245,	16533,	17768]
  };


  predictedData = {
    'linear_regression' :[15295,	15451,	15607, 15763,	15919,	16075,	16231,	16386,	16542,	16698,
      16854,	17010],
    'seasonality_analysis' :[12661,	7506,	11688,	14475,	18897,	21178,
      17715,	18611,	16252,	17167,	18597,	19963]
  }
  @ViewChild('line6Canvas', { static: true }) line6Canvas;
  private lineChart: any;
  @ViewChild('line1Canvas', { static: true }) line1Canvas;
  private line1Chart: any;


  constructor (public firebaseService: FirebaseService,private calendar: NgbCalendar,
    private http: HttpClient, public formatter: NgbDateParserFormatter
    ,public route: Router) {



  }

  ngOnInit() {

    this.basicChart3()
    this.basicChart()
    // this.sales_prediction()
    var arr = [1000,100,1600,1990,9955,12870,11930,10320,11845,12660,15220,23390,
      16590,11080,14200,20265,14650,17560,19805,15755,13610,13155,14260,17190,
      13235,6910,12087,11940,19600,18630,8910,16220,11130,12470,11610,3123]
    // this.linear_regression_function(arr);

  }

  sales_prediction() {
    var year_dict = {}
    var month_dict = {}
    var dict1 = {};
    var dict = {};
    var year17 ={};
    var price17 = 0;
    var year18 ={};
    var price18 = 0;
    var year19 ={};
    var price19 = 0;
    this.firebaseService.getOrders().subscribe(result => {
      this.items = result;
      this.items.forEach(function(child) {
        if (child.payload.doc.data().paymentStatus == 'Cash On Delivery') {
            console.log('This is the date', child.payload.doc.data().dateTimeOfOrder)
              // monthly sales different year
            if (moment(child.payload.doc.data().dateTimeOfOrder).year() == 2017) {
              price17 += child.payload.doc.data().orderPrice
              console.log(moment(child.payload.doc.data().dateTimeOfOrder).date())
              if(year17[moment(child.payload.doc.data().dateTimeOfOrder).month()] == undefined){
                year17[moment(child.payload.doc.data().dateTimeOfOrder).month()] = child.payload.doc.data().orderPrice;
                // dict[moment(child.payload.doc.data().dateTimeOfOrder).date()].push(child.payload.doc.data().orderPrice);
              }else{
                year17[moment(child.payload.doc.data().dateTimeOfOrder).month()] = 
                year17[moment(child.payload.doc.data().dateTimeOfOrder).month()] +
              (child.payload.doc.data().orderPrice);
            }

            } else if (moment(child.payload.doc.data().dateTimeOfOrder).year() == 2018) {
              price18 += child.payload.doc.data().orderPrice
              console.log(moment(child.payload.doc.data().dateTimeOfOrder).date())
              if(year18[moment(child.payload.doc.data().dateTimeOfOrder).month()] == undefined){
                year18[moment(child.payload.doc.data().dateTimeOfOrder).month()] = child.payload.doc.data().orderPrice;
                // dict[moment(child.payload.doc.data().dateTimeOfOrder).date()].push(child.payload.doc.data().orderPrice);
    
              }else{
                year18[moment(child.payload.doc.data().dateTimeOfOrder).month()] = 
                year18[moment(child.payload.doc.data().dateTimeOfOrder).month()] +
              (child.payload.doc.data().orderPrice);}
              } else if (moment(child.payload.doc.data().dateTimeOfOrder).year() == 2019) {
                console.log(moment(child.payload.doc.data().dateTimeOfOrder).date())
                price19 += child.payload.doc.data().orderPrice
                if(year19[moment(child.payload.doc.data().dateTimeOfOrder).month()] == undefined){
                  year19[moment(child.payload.doc.data().dateTimeOfOrder).month()] = child.payload.doc.data().orderPrice;
                  // dict[moment(child.payload.doc.data().dateTimeOfOrder).date()].push(child.payload.doc.data().orderPrice);
                }else{
                  year19[moment(child.payload.doc.data().dateTimeOfOrder).month()] = 
                  year19[moment(child.payload.doc.data().dateTimeOfOrder).month()] +
                (child.payload.doc.data().orderPrice);}
                }
        }
        console.log(year17);
        console.log(year18);
        console.log(year19);
      })
      this.sales17 = price17;
      this.sales18 = price18;
      this.sales19 = price19;
      this.totalsales = price17 + price18 + price19;

    })

    }


    linear_regression_function (arr) {
      var intercept = 9529;
      var slope = 155;

      for ( var i = 1; i < arr.length + 13; i++ ) {
        console.log(i);
        console.log(intercept + slope * i)
      }
    }

    seasonality_index () {

    }




  basicChart3() {
    var sales_17 = [1000,100,1600,1990,12870,9955,11930,10320,11845,12660,15220,23390]
    
    var sales_18 = [16590,11080,14200,14650,20265,17560,19805,15755,13610,13155,14260,17190,]

    var sales_19 = [13235,6910,12087,11940,19600,18630,8910,16220,11130,12470,11610,18190]
    var sales_20 = [12662,7506,11688,14475,18897,21178,17716,18612,16252,17168,18597,19963]

    this.lineChart = new Chart(this.line6Canvas.nativeElement, {
      type: 'line',
      data: {
        labels: ['Jan','Feb','March','April','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'],
        datasets: [{
                label: 'Sales 2017',
                data: sales_17,
                fill: false,
                pointRadius:0,
                borderColor: '#D5DBDB',
                backgroundColor: '#0074D9',
                lineTension: 0,
        },{
                label: "Sales 2018",
                fill: false,
                pointRadius:0,
                borderColor: '#BB8FCE',
                backgroundColor: '#0074D9',
                lineTension: 0,
                data: sales_18
        },
          {
                label: 'Sales 2019',
                data: sales_19,
                fill: false,
                pointRadius:0,
                borderColor: '#F4D03F',
                backgroundColor: '#0074D9',
                lineTension: 0,
        },{
                label: "Sales 2020",
                fill: false,
                pointRadius:0,
                borderColor: '#FA0101',
                backgroundColor: '#0074D9',
                lineTension: 0,
                data: sales_20
        }
      ]
      },
      options : {
        responsive: false,
        scales: {
          xAxes: [{
              display: true,
              scaleLabel: {
                  display: true,
                  labelString: "Month",
              }
          }],
          yAxes: [{
              ticks: {
                  beginAtZero: true,
              },
              display: true,
              scaleLabel: {
                  display: true,
                  labelString: "Sales",
              }
          }]
      }
      }
    });

  }
  basicChart() {

    this.line1Chart = new Chart(this.line1Canvas.nativeElement, {
      type: 'line',
      data: {
        labels: ['Jan-17','Feb-17','March-17','April-17','May-17','Jun-17','Jul-17','Aug-17','Sept-17','Oct-17','Nov-17','Dec-17',
        'Jan-18','Feb-18','March-18','April-18','May-18','Jun-18','Jul-18','Aug-18','Sept-18','Oct-18','Nov-18','Dec-18',
        'Jan-19','Feb-19','March-19','April-19','May-19','Jun-19','Jul-19','Aug-19','Sept-19','Oct-19','Nov-19','Dec-19'],
        datasets: [{
                label: 'Past Sales',
                data: this.charData.past_data,
                fill: false,
                pointRadius:0,
                borderColor: '#D5DBDB',
                backgroundColor: '#0074D9',
                lineTension: 0,
        },
        {
                label: "linear_regression",
                fill: false,
                pointRadius:0,
                borderColor: '#BB8FCE',
                backgroundColor: '#0074D9',
                lineTension: 0,
                data: this.charData.linear_regression
        },
          {
                label: 'seasonality_analysis',
                data: this.charData.seasonality_analysis,
                fill: false,
                pointRadius:0,
                borderColor: '#F4D03F',
                backgroundColor: '#0074D9',
                lineTension: 0,
        },
      ]
      },
      options : {
        responsive: false,
        scales: {
          xAxes: [{
              display: true,
              scaleLabel: {
                  display: true,
                  labelString: "Month",
              }
          }],
          yAxes: [{
              ticks: {
                  beginAtZero: true,
              },
              display: true,
              scaleLabel: {
                  display: true,
                  labelString: "Sales",
              }
          }]
      }
      }
    });

  }

  addData(data) {
    var label = ['Jan-20','Feb-20','March-20','April-20','May-20','Jun-20','Jul-20','Aug-20','Sept-20','Oct-20','Nov-20','Dec-20'];
    label.forEach(element => {
      this.line1Chart.data.labels.push(element);
    });
    this.predictedData.linear_regression.forEach(element => {
      this.line1Chart.data.datasets[1].data.push(element);
    });

    this.predictedData.seasonality_analysis.forEach(element => {
      this.line1Chart.data.datasets[2].data.push(element);
    });
    this.line1Chart.update();
}


removeData(data) {
  var label = ['Jan-20','Feb-20','March-20','April-20','May-20','Jun-20','Jul-20','Aug-20','Sept-20','Oct-20','Nov-20','Dec-20'];
  label.forEach(element => {
    this.line1Chart.data.labels.pop(element);
  });
  this.predictedData.linear_regression.forEach(element => {
    this.line1Chart.data.datasets[1].data.pop(element);
  });

  this.predictedData.seasonality_analysis.forEach(element => {
    this.line1Chart.data.datasets[2].data.pop(element);
  });
  this.line1Chart.update();
}

}