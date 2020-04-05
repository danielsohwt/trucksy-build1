import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {timeout} from "rxjs/operators";


@Component({
  selector: 'image-predictor',
  templateUrl: './image-predictor.component.html',
  styleUrls: ['./image-predictor.component.scss'],
})
export class ImagePredictorComponent implements OnInit {
  @Input() image;
  @Input() productList;
  @Input() orderList;
  @Input() i;
  @Input() timedout;

  busy = [];
  src = '../../../assets/img/cat.jpg';

  results = [{
    className : null,
    probability: null,
  }];

  constructor(
      public http: HttpClient,
  ) { }

  ngOnInit() {
    this.setImageSrc();
  }

  async classifyImage(image, i) {
    this.results = await this.sendImage(image.rawFile, i);
    this.orderList[i] = this.results[0].className
  }

  async setImageSrc() {
    const reader = new FileReader();

    reader.onload = (event) => { // called once readAsDataURL is completed
      this.src = event.target['result'];
    };

    reader.readAsDataURL(this.image.rawFile); // read file as data url

  }

  async sendImage(image, i) {
    this.busy[i] = true;
    const data = new FormData();
    data.append('image_file', image)

    let results;
    try {
      results = [];
      let postResult = await this.http.post('https://furnitureclassifier1.appspot.com/predict/', data).pipe(
          timeout(15000)
      ).toPromise();
      this.timedout[i] = false;
      results.push({className: postResult["Classification"], probability: postResult["Probabilty"]})
      console.log(postResult)
    } catch {
      console.log("Timed out");
      results="Timed out";
      this.timedout[i] = true;
    }
    this.busy[i] = false;
    return results;
  }

  onChange(event, i) {
    this.timedout[i] = false;
  }
}
