import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  url = ''
  auth = ''
  flow = ''

  flows = [
    { title: 'asd' }
  ]

  constructor(
    private storage: Storage
  ) {}

  updateUrl (value) {
    console.log('url', value)
    this.storage.set('TF_URL', value || '');
  }

  updateToken (value) {
    console.log('token', value)
    this.storage.set('TF_TOKEN', value || '');
  }

  updateFlow (value) {
    console.log('flow', value)
    this.storage.set('TF_FLOW', value || '');
  }

}
