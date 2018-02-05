import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FirebaseComponent } from '../components/firebase/firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase} from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { HomePage } from '../pages/home/home';
import { LanguagePage } from '../pages/language/language';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any = HomePage;
  currentUser
  UserInfo
  UserName
  UserPhoto

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
  private afAuth: AngularFireAuth,private afDB: AngularFireDatabase, public fbc: FirebaseComponent ) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });

    afAuth.authState.subscribe(user => {
      if (!user) {
        this.currentUser = null;
        return;
      }
      this.currentUser = user; 
      console.log(this.currentUser)
      
      this.UserInfo = {
        Name: user.displayName, 
        UID: user.uid,
        Email: user.email,
        UserImg: user.photoURL,
        Phone: user.phoneNumber,
      };

    this.UserName = user.displayName;
    this.UserPhoto = user.photoURL

      console.log(this.UserInfo);
    });

  }

  SignInWithFacebook() {
    this.afAuth.auth.signInWithRedirect(new firebase.auth.FacebookAuthProvider());
    firebase.auth().getRedirectResult().then(function(authData) {
	    console.log(authData);
    }).catch(function(error) {
	    console.log(error);
    });
  }
 
  SignOut() {
    this.afAuth.auth.signOut();
  }

  openPage(page) {
    if (page == "LANGUAGE") {
        this.nav.setRoot(LanguagePage);
    }
    if (page == "VISION") {
        this.nav.setRoot(HomePage);
    }
  }


}


