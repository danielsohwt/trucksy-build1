import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DatePicker } from '@ionic-native/date-picker/ngx';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

    customYearValues = [2020, 2016, 2008, 2004, 2000, 1996];
    customDayShortNames = ['s\u00f8n', 'man', 'tir', 'ons', 'tor', 'fre', 'l\u00f8r'];
    customPickerOptions: any;

    barData = [
        { season: 'W1', viewers: 1200 },
        { season: 'W2', viewers: 1020 },
        { season: 'W3', viewers: 1020 },
        { season: 'W4', viewers: 1020 },
        { season: 'W5', viewers: 123 },
        { season: 'W6', viewers: 123 },
        { season: 'W7', viewers: 231 },
        { season: 'W8', viewers: 411 }
      ];
      title = 'Deliver Per Week';
      subtitle = 'Deliveries';
      width: number;
      height: number;
      margin = { top: 20, right: 20, bottom: 30, left: 40 };
      x: any;
      y: any;
      svg: any;
      g: any;    

  constructor(
        private _platform: Platform,
        private datePicker: DatePicker,) {

        
    this.customPickerOptions = {
        buttons: [{
          text: 'Save',
          handler: () => console.log('Clicked Save!')
        }, {
          text: 'Log',
          handler: () => {
            console.log('Clicked Log. Do not Dismiss.');
            return false;
          }
        }]
      }

    this.width = 900 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
   }

   ionViewDidEnter() {
    this.init();
    this.initAxes();
    this.drawAxes();
    this.drawChart();
  }

  init() {
    this.svg = d3.select('#barChart')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', '0 0 900 500');
    this.g = this.svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  initAxes() {
    this.x = d3Scale.scaleBand().rangeRound([0, this.width]).padding(0.1);
    this.y = d3Scale.scaleLinear().rangeRound([this.height, 0]);
    this.x.domain(this.barData.map((d) => d.season));
    this.y.domain([0, d3Array.max(this.barData, (d) => d.viewers)]);
  }

  drawAxes() {
    this.g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3Axis.axisBottom(this.x))
      .attr('font-size', '30');
    this.g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3Axis.axisLeft(this.y))
      .append('text')
      .attr('class', 'axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .attr('fill', 'rgb(34, 167, 240)')
      .attr('font-size', '50')
      .text('viewers');
  }

  drawChart() {
    this.g.selectAll('.bar')
      .data(this.barData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('fill', 'rgb(34, 167, 240)')
      .attr('x', (d) => this.x(d.season))
      .attr('y', (d) => this.y(d.viewers))
      .attr('width', this.x.bandwidth())
      .attr('height', (d) => this.height - this.y(d.viewers));
  }

  ngOnInit() {

  }

}
