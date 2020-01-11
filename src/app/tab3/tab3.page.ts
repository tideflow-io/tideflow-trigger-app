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
  flowUrl: string;

  constructor(
    private tideflowApi: TideflowService,
    private storage: Storage
  ) {
    this.readConfig()
  }

  async readConfig() {
    this.url = await this.storage.get('TF_URL')
    this.token = await this.storage.get('TF_TOKEN')
    this.flow = await this.storage.get('TF_FLOW')
    this.flowUrl = await this.storage.get('TF_FLOW_URL')
    this.canGetflows()
  }

  async canGetflows() {
    const { url, token } = this
    if (!url || !token) {
      console.error('Not all requirements are meet')
      return;
    }

    try {
      this.flows = await this.tideflowApi.getFlows({triggerType:'endpoint'})
    }
    catch(ex) {
      console.error(ex)
    }
  }

  async updateUrl (value) {
    const isValidURL = (str) => {
      var a  = document.createElement('a');
      a.href = str;
      return (a.host && a.host != window.location.host);
    }

    if (isValidURL(value)) {
      await this.storage.set('TF_URL', value || '');
      this.canGetflows()
    }
    else {
      this.flow = ''
      this.flowUrl = ''
      this.flows = []
      await this.storage.remove('TF_URL')
      await this.storage.remove('TF_FLOW')
      await this.storage.remove('TF_FLOW_URL')
    }
  }

  async updateToken (value) {
    const isUUID = (uuid) => {
        let s = "" + uuid;
        let r = s.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
        return r === null ? false : true
    }

    if (isUUID(value)) {
      await this.storage.set('TF_TOKEN', value || '');
      this.canGetflows()
    }
    else {
      this.flow = ''
      this.flowUrl = ''
      this.flows = []
      await this.storage.remove('TF_FLOW')
      await this.storage.remove('TF_FLOW_URL')
    }
  }

  async updateFlow (value) {
    const isValidId = (value) => {
      return value && value.length > 6;
    }

    if (isValidId(value)) {
      this.storage.set('TF_FLOW', value || '');
      const selectedFlow = this.flows.find(f => f._id === value)
      
      try {
        this.flowUrl = `${this.url}/service/endpoint/${selectedFlow.trigger.config.endpoint}`
        await this.storage.set('TF_FLOW_URL', this.flowUrl)
      }
      catch (ex) {
        this.flowUrl = ''
        await this.storage.remove('TF_FLOW_URL')
      }
    }
  }

}
