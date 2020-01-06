import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

import { TideflowService } from '../services/tideflow.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  url: string;
  token: string;
  flow: string;

  flows: any;

  constructor(
    private tideflowApi: TideflowService,
    private storage: Storage
  ) {
    this.readConfig()
  }

  async readConfig() {
    this.url = await this.storage.get('TF_URL')
    this.token = await this.storage.get('TF_TOKEN')
    this.canGetflows()
  }

  canGetflows() {
    if (!this.url || !this.token) {
      console.error('Not all requirements are meet')
      return;
    }
    this.tideflowApi.getFlows({triggerType:'endpoint'})
      .then(flows => {
        console.log({response: flows})
        this.flows = flows
      })
      .catch(ex => console.error(ex)) 
  }

  updateUrl (value) {
    console.log('url', value)

    const isValidURL = (str) => {
      var a  = document.createElement('a');
      a.href = str;
      return (a.host && a.host != window.location.host);
    }

    if (isValidURL(value)) {
      console.log('set')
      this.storage.set('TF_URL', value || '');
    }
    else {
      this.storage.remove('TF_URL')
    }

    this.canGetflows()
  }

  updateToken (value) {
    const isUUID = (uuid) => {
        let s = "" + uuid;
        let r = s.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
        return r === null ? false : true
    }

    if (isUUID(value)) {
      console.log('token', value)
      this.storage.set('TF_TOKEN', value || '');
    }
    else {
      this.storage.remove('TF_TOKEN')
    }

    this.canGetflows()
  }

  updateFlow (value) {
    const isValidId = (value) => {
      return value && value.length > 6;
    }

    if (isValidId(value)) {
      console.log('id', value)
      this.storage.set('TF_FLOW', value || '');
    }
  }

}
