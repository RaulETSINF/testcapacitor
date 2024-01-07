import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { Network } from '@capacitor/network';
import { Motion } from '@capacitor/motion';

import { NgZone } from '@angular/core';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardContent, IonList, IonItem, IonLabel, IonText, IonCardTitle, IonButton
} from '@ionic/angular/standalone';
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardContent, IonList, IonItem, IonLabel, IonText, IonCardTitle, NgIf, NgForOf, IonButton],
})
export class HomePage {

  platformName: string = '';
  isNativePlatform: boolean;
  isCameraAvailable: boolean;

  deviceName: string|undefined;
  os: string|undefined;
  osVersion: string = '';
  manufacturer: string = '';
  isVirtual: boolean|undefined;
  uuid: string = '';

  batteryLevel: number|undefined;
  isCharging: boolean|undefined;

  isConnected: boolean|undefined;
  connectionType: string|undefined;

  accx: number|undefined;
  accy: number|undefined;
  accz: number|undefined;

  eventLogs: string[] = [];

  constructor(private platform: Platform, private ngZone: NgZone) {

    this.platformName = Capacitor.getPlatform();
    this.isNativePlatform = Capacitor.isNativePlatform();
    this.isCameraAvailable = Capacitor.isPluginAvailable('Camera')

    Device.getInfo().then( result => {
      this.deviceName = result.name;
      this.os = result.operatingSystem;
      this.osVersion = result.osVersion
      this.manufacturer = result.manufacturer;
      this.isVirtual = result.isVirtual;
     })

    Device.getId().then( result => { this.uuid = result.identifier; })

    Device.getBatteryInfo().then( result => {
      this.batteryLevel = result.batteryLevel;
      this.isCharging = result.isCharging
    })


    Network.getStatus().then( status => {
      this.isConnected = status.connected
      this.connectionType = status.connectionType
    });

    Network.addListener('networkStatusChange', status => {
      this.ngZone.run(() => {
        this.isConnected = status.connected
        this.connectionType = status.connectionType
        this.eventLogs.push(`Cambio tipo conexión a ${status.connectionType}`);

      });
    });

    Motion.addListener('accel', event => {
      this.ngZone.run(() => {
          this.accx = event.acceleration.x
          this.accy = event.acceleration.y
          this.accz = event.acceleration.z
          console.log('Interval:', event.interval);
      });
      
    });

    App.addListener('resume', () => {
      this.ngZone.run(() => {
        this.eventLogs.push('onResume');
      });
    });

    App.addListener('pause', () => {
      this.ngZone.run(() => {
        this.eventLogs.push('onPause');
      });
    });

    App.addListener('appStateChange', ({ isActive }) => {
      this.ngZone.run(() => {
        isActive ? this.eventLogs.push('onStart') : this.eventLogs.push('onStop')
      })
    });

    this.platform.backButton.subscribeWithPriority(-1, () => {
      App.exitApp();
    });
  }

}
