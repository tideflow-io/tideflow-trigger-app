import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

import { TideflowService } from '../services/tideflow.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  jsonBody: string;

  constructor(
    private tideflowApi: TideflowService,
    private storage: Storage
  ) {
    this.readConfig()
  }

  async readConfig() {
    let stored = await this.storage.get('JSON_TRIGGER_BODY') 
    this.jsonBody = stored || `{
  "greeting": "hello"
}`
  }

  async updateJsonBody(value) {
    await this.storage.set('JSON_TRIGGER_BODY', value || '')
  }

  async perfomRequest() {
    let body = {}
    try {
      body = JSON.parse(this.jsonBody)
    }
    catch (ex) {
      alert('Not valid JSON')
      return;
    }
    const flow = await this.storage.get('TF_FLOW')
    if (!flow) {
      alert('No flow selected')
      return;
    }
    this.tideflowApi.jsonRequest(body)
  }

}
