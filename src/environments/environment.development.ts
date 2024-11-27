/**
 * **Development environment**
 *
 * serve command: ng serve --configuration=development
 * build command: ng build --configuration=development
 */
export const environment = {
  production: true,
  host: 'http://127.0.0.1:3000/api',
  // host: 'http://192.168.0.10:3000/api',
  // host: 'https://dev-api.untatter.com/v1',
  google_client_id:
    '486481973625-6kne7jrg0sj7f2qfp1vakau2vak9fte2.apps.googleusercontent.com',
  microsoft_client_id: '48b101f5-2056-468e-ae95-8477026839a8',
  // microsoft_client_id: '0611ccc3-9521-45b6-b432-039852002705',
  encryption: {
    encryptedRequest: false,
    key: 'TXRZ3jThBP2dWnUN',
    iv: '256e51ec9e69k729',
  },
};
