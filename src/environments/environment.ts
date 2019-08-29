// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  serverUrl: 'http://localhost:4210/',
  managerAppUrl: 'http://localhost:8080/',
  // serverUrl: 'https://portalservices-stage.propertyme.com/',
  // managerAppUrl: 'https://stage.propertyme.com/',
  raygunKey: '',
  sessionDuration: 9,
  version: '1.0.0.0'
};

export function sleep(ms = 0) {
  return new Promise(r => setTimeout(r, ms));
}
