// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  language: 'vi',
  baseUrl: 'http://localhost:4200',
  // apiUrl: 'https://dev-nexthcm-api.banvien.com.vn',
  apiUrl: 'http://192.168.200.173:8089',
  authUrl: 'http://192.168.2.20:31125',
  orgUrl: 'https://dev-nexthcm-api.banvien.com.vn',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
