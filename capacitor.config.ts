import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ionic.testcapacitor',
  appName: 'testcapacitor',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
