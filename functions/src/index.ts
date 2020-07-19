import * as functions from 'firebase-functions';
import firestore = require('@angular/fire')
import admin = require('firebase-admin');
admin.initializeApp();

exports.addAdminRole = functions.https.onCall((data, context) => {
  // check request is made by an admin
  if ( !context.auth!.token.admin ) {
    return { error: 'Only admins can add other admins' }
  }
  // get user and add admin custom claim
  return admin.auth().getUserByEmail(data.email).then((user: { uid: any; }) => {
    return admin.auth().setCustomUserClaims(user.uid, {
      admin: true
    })
  }).then(() => {
    return {
      message: `Success! ${data.email} has been made an admin.`
    }
  }).catch((err: any) => {
    return err;
  });
});
