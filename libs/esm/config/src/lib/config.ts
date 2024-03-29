export interface EsmConfig {
  production: boolean;
  baseUrl: string;
  syncfusionLicense: string;
  recaptcha: {
    siteKey: string;
  };
  defaultPassword: string;
  pusher: {
    key: string;
    cluster: string;
  };
}
