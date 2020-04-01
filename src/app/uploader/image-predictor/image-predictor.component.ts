import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormControl} from "@angular/forms";


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

  validation_item;
  src = '../../../assets/img/cat.jpg';

  results = [{
    className : null,
    probability: null,
  }];

  IMAGE_SIZE = 224;

  constructor(
      public http: HttpClient,
  ) { }

  ngOnInit() {
    this.setImageSrc();
  }

  async classifyImage(image, i) {
    image.width = this.IMAGE_SIZE;
    image.height = this.IMAGE_SIZE;

    this.results = await this.sendImage(image.rawFile);
    this.orderList[i] = this.results[0].className
  }

  async setImageSrc() {
    const reader = new FileReader();

    reader.onload = (event) => { // called once readAsDataURL is completed
      this.src = event.target['result'];
    };

    reader.readAsDataURL(this.image.rawFile); // read file as data url

  }

  async sendImage(image) {
    const data = new FormData();
    data.append('image_file', image)

    let results = [];
    let postResult = await this.http.post('https://furnitureclassifier1.appspot.com/predict/', data).toPromise();
    results.push({className : postResult["Classification"], probability: postResult["Probabilty"]})
    console.log(postResult)
    return results;
  }


}

class ItemValidator {
  static validItem(fc:FormControl) {
    if (fc.value in productList)
        }
}

