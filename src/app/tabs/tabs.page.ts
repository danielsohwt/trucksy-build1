import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

    // @ViewChild('tabs') tabs: IonTabs
    @ViewChild('tabs', { static: true }) tabs: IonTabs;
    // tabs: any;
    
    constructor() { }

    ngOnInit() {
        this.tabs.select('feed')
    }



}
