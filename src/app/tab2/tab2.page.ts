import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File, FileEntry } from '@ionic-native/File/ngx';

import { TideflowService } from '../services/tideflow.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(
    private tideflowApi: TideflowService,
    private barcodeScanner: BarcodeScanner,
    private storage: Storage,
    private camera: Camera,
    private file: File,
    private router: Router
  ) {}

  async goTo(page) {
    console.log({page})
    this.router.navigateByUrl(page);
    // window.location.href = page
  }

  async barcode() {
    const flow = await this.storage.get('TF_FLOW')
    if (!flow) return alert('No flow selected')

    this.barcodeScanner.scan().then(barcodeData => {
      this.tideflowApi.jsonRequest(barcodeData)
    }).catch(err => {
      console.error(err)
      alert('An error ocurred')
    });
  }

  async photo() {
    const flow = await this.storage.get('TF_FLOW')
    if (!flow) return alert('No flow selected')

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    const getBlob = (b64Data:string, contentType:string, sliceSize:number= 512) => {
      contentType = contentType || '';
      sliceSize = sliceSize || 512;
  
      let byteCharacters = atob(b64Data);
      let byteArrays = [];
  
      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          let slice = byteCharacters.slice(offset, offset + sliceSize);
  
          let byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
          }
  
          let byteArray = new Uint8Array(byteNumbers);
  
          byteArrays.push(byteArray);
      }
  
      let blob = new Blob(byteArrays, {type: contentType});
      return blob;
  }

    this.camera.getPicture(options)
      .then(f => {
        return getBlob(f, 'image/jpeg')
      })
      .then(file => {
        this.tideflowApi.fileRequest({
          file,
          name: 'image.jpg',
          type: 'image/jpeg'
        })
      })
  }
}
