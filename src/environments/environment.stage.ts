export const environment = {
  production: true,
  serverUrl: 'https://portalservices-stage.propertyme.com/',
  managerAppUrl: 'https://stage.propertyme.com/',
  raygunKey: 'k22LFJ3AGIS3biT75vUzlQ==',
  sessionDuration: 9,
  version: '1.0.0.0'
};

export function sleep(ms = 0) {
  return new Promise(r => setTimeout(r, ms));
}
