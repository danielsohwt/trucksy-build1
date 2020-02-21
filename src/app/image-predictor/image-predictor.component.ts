import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-image-predictor',
  templateUrl: './image-predictor.component.html',
  styleUrls: ['./image-predictor.component.css']
})
export class ImagePredictorComponent implements OnInit {

  @Input() classifier;
  @Input() image;

  src = '../../assets/images/cat.jpg';
  results = [{
    label : null,
    confidence: null,
  }];

  inferenceTime = null;

  IMAGE_SIZE = 224;

  ngOnInit() {
    this.setImageSrc();
    this.classifyImage(this.image);
  }

  async classifyImage(image) {
    console.log(image)
    console.log(this.image.rawFile)
    image.width = this.IMAGE_SIZE;
    image.height = this.IMAGE_SIZE;

    const startTime = performance.now();
    this.results = await this.classifier.classifyImage(image);
    console.log(this.results)
    this.inferenceTime = Math.floor(performance.now() - startTime);

  }


  

  async setImageSrc() {
    const reader = new FileReader();
    console.log(reader)

    reader.onload = (event) => { // called once readAsDataURL is completed
      this.src = event.target['result'];
      console.log(this.src)
    };
    console.log(this.image)
    console.log(this.image.rawFile)

    reader.readAsDataURL(this.image.rawFile); // read file as data url
  }
}
