import { Component,ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { GoogleCloudAPI } from '../../components/google/google-cloud-vision-service';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Http } from '@angular/http';

declare var google;

@Component({
  selector: 'page-language',
  templateUrl: 'language.html'
})
export class LanguagePage {

  @ViewChild('map') 
  mapElement: ElementRef;
  map: any;

  UploadedImage;
  IdentifiedImageLabel;
  IdentifiedImageLogo;
  IdentifiedImageLandmark;
  IdentifiedImageWeb;
  IdentifiedImageText;
  IdentifiedImageSimilar;
  IdentifiedImageMatch;
  IdentifiedImageHashTag;
  IdentifiedImageLocation;
  IdentifiedImagePartial;
  AnalysisTrial = 0;
  LoginUser;
  itemExpand: {'Map': boolean, 'Similar':boolean, 'Text':boolean} = {'Map': false, 'Similar':false, 'Text':false}


sendtoAPI(String){  
  return new Promise((resolve) => {
    this.GCP.naturallanguage(String).subscribe(result => {
      this.IdentifiedImageLogo = result.json().responses['0'].logoAnnotations
      this.IdentifiedImageLandmark = result.json().responses['0'].landmarkAnnotations
      this.IdentifiedImageLabel = result.json().responses['0'].labelAnnotations
      this.IdentifiedImageText = result.json().responses['0'].textAnnotations
      this.IdentifiedImageWeb = result.json().responses['0'].webDetection.webEntities
      this.IdentifiedImageSimilar = result.json().responses['0'].webDetection.visuallySimilarImages
      this.IdentifiedImageMatch = result.json().responses['0'].webDetection.fullMatchingImages
      this.IdentifiedImagePartial = result.json().responses['0'].webDetection.partialMatchingImages
      resolve(result.json().responses['0'])
    });
  })
}


// FirebaseDatabase: AngularFireList <{imageData: 1, results: 2, user: 3}>;
FirebaseDatabase: AngularFireList<any>;

  constructor(
    public http: Http,
    private camera: Camera,
    private GCP: GoogleCloudAPI,
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private alert: AlertController) {
    // this.FirebaseDatabase = db.list('UploadedImage');
    afAuth.authState.subscribe(user => {
      if (!user) {this.LoginUser = null}
      else {this.LoginUser = user}
    })


  }


SaveResults(imageDataInput, results) {
  console.log({user: this.LoginUser, imageData: imageDataInput, results: results})
  if (this.LoginUser != null){var path = '/Users/' + this.LoginUser.uid}
  else {var path = '/Users/Guest'}
  // this.FirebaseDatabase.push({imageData: imageDataInput, results: results, user: this.LoginUser})
  this.db.list(path).push({imageData: imageDataInput, results: results});
}

showAlert(message) {
  let alert = this.alert.create({
    title: 'Error',
    subTitle: message,
    buttons: ['OK']
  });
  alert.present();
}


}
