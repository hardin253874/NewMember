export const environment = {
  production: true,
  serverUrl: 'https://portalservices-uat.propertyme.com/',
  managerAppUrl: 'https://uat-app.propertyme.com/',
  raygunKey: 'k22LFJ3AGIS3biT75vUzlQ==',
  sessionDuration: 9,
  version: '1.0.0.0'
};

export function sleep(ms = 0) {
  return new Promise(r => setTimeout(r, ms));
}
