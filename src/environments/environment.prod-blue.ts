export const environment = {
  production: true,
  serverUrl: 'https://portalservices-blue.propertyme.com/',
  managerAppUrl: 'https://app.propertyme.com/',
  raygunKey: 'ISy8uVCqrp/JuDHUrvTqKg==',
  sessionDuration: 29,
  version: '1.0.0.0'
};

export function sleep(ms = 0) {
  return new Promise(r => setTimeout(r, ms));
}
