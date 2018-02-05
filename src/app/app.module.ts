import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera } from '@ionic-native/camera';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FirebaseEnvironment } from '../components/firebase/firebase';
import { FirebaseComponent } from '../components/firebase/firebase';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LanguagePage } from '../pages/language/language';
import { GoogleCloudAPI } from '../components/google/google-cloud-vision-service';
 
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LanguagePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AngularFireModule.initializeApp(FirebaseEnvironment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,    
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LanguagePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GoogleCloudAPI,
    FirebaseComponent
  ]
})
export class AppModule {}
