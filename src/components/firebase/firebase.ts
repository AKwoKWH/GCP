import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
// import { NavController } from 'ionic-angular';
// import { StatusBar } from '@ionic-native/status-bar';
// import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
// import { FirebaseListObservable} from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { HomePage } from '../../pages/home/home';

// @Component({})
export const FirebaseEnvironment = {
  firebaseConfig: {
    apiKey: "AIzaSyBnvds4WnPcvsJhP1d3XXMOcnogA7QbAgk",
    authDomain: "cloudapi-3a10c.firebaseapp.com",
    databaseURL: "https://cloudapi-3a10c.firebaseio.com",
    projectId: "cloudapi-3a10c",
    storageBucket: "cloudapi-3a10c.appspot.com",
    messagingSenderId: "312614667449",
    // API KEY
    // googleCloudAPIKey: 
    // MY API KEY
    googleCloudAPIKey: "AIzaSyB6qegPGtnrhFLUulqw2V4InNG604toSa8"
  }

}

export class FirebaseComponent {

  @ViewChild(Nav) nav: Nav;

  // pages: Array<{title: string, component: any}>;
  currentUser;
  // firebaseData: FirebaseListObservable<any>;
  
  UserInfo: {
    Name: string;
    UID: string;
    Email: string;
    UserImg: string;
    Phone: string;
    Other: string;
  };

  // constructor(    afAuth: AngularFireAuth,     afDB: AngularFireDatabase
  // ){}
  // constructor(
  //   public platform: Platform, 
  //   private afAuth: AngularFireAuth,
  //   private afDB: AngularFireDatabase
  // ) {}

    // afAuth.authState.subscribe(user => {
    //   if (!user) {
    //     this.currentUser = null;
    //     return;
    //   }
    //   this.currentUser = user; 
    //   console.log(this.currentUser)

    //   this.UserInfo = {
    //     Name: user.displayName, 
    //     UID: user.uid,
    //     Email: user.email,
    //     UserImg: user.photoURL,
    //     // UserImg: "https://graph.facebook.com/" + user.uid + "/picture?height=500",
    //     Phone: user.phoneNumber,
    //     TutorStatus: true,
    //     StudentStatus: false,
    //     Other: "NA",
    //   };

    //   console.log(this.UserInfo);
    // });

  // }

  // FirebaseSignInWithFacebook() {
  //   console.log('function FirebaseSignInWithFacebook Called');
  //   this.afAuth.auth.signInWithRedirect(new firebase.auth.FacebookAuthProvider());
  //   firebase.auth().getRedirectResult().then(function(authData) {
	//     console.log(authData);
  //   }).catch(function(error) {
	//     console.log(error);
  //   });
  // }

  // FirebaseSignOut() {
  //   console.log('function FirebaseSignOut Called');
  //   this.afAuth.auth.signOut();
  // }

  // FirebaseQuery(path) {
  //   console.log('function FirebaseQuery Called, Path = ' + path);
  //   this.firebaseData =this.afDB.list(path) 
  //   console.log('QueryResult = ',this.firebaseData)
  //   return this.firebaseData;
  // }

  // FirebaseUser() {
  //   return this.UserInfo;
  // }

  // FirebasePushData(path,data) {
  //   console.log('function FirebasePushData Called, Path = ' + path + ', Data = ' + data);
  //   this.afDB.list(path).push(data);
  // }

  // FirebaseUpdateData(path,dataID,data) {
  //   console.log('function FirebaseUpdateData Called, Path = ' + path + ', Data = ' + dataID + ' ' + data);
  //   this.afDB.list(path).update(dataID, data);
  // } 

  // FirebaseRemoveData(path) {
  //   console.log('function FirebaseRemoveData Called, Path = ' + path);
  //   this.afDB.list(path).remove();
  // }

  // SnapshotToArray(snapshot) {
  //   let returnArr = [];
  //   snapshot.forEach(function(childSnapshot) {
  //       let item = childSnapshot.val(); 
  //       item.key = childSnapshot.key;
  //       returnArr.push(item);
  //   });
  //   return returnArr;
  // };

}
