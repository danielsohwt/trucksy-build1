import { Component, OnInit } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.page.html',
  styleUrls: ['./uploader.page.scss'],
})
export class UploaderPage implements OnInit {
    
    imageURL; string

    constructor(public http: HttpClient) { }

  ngOnInit() {
  }

  fileChanged(event) {
    const files = event.target.files

    const data = new FormData()
    data.append('file', files[0])
    data.append('UPLOADCARE_STORE', '1')
    data.append('UPLOADCARE_PUB_KEY', 'b9cc3f94e77d60a02f90')

    this.http.post('https://upload.uploadcare.com/base/', data)
    .subscribe(event => {
        console.log(event)
        this.imageURL = event.file
    })
}

}
