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
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

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

GoogleVisionIdentify(event){

  this.AnalysisTrial += 1; 

  if (this.AnalysisTrial > 3 && this.LoginUser == null) {
    alert('You have uploaded 3 pics, please login to continue')
    return false 
  }

  this.UploadedImage = null 
  this.IdentifiedImageLabel = null
  this.IdentifiedImageLandmark = null
  this.IdentifiedImageLogo = null
  this.IdentifiedImageWeb = null
  this.IdentifiedImageText = null
  this.IdentifiedImageSimilar = null
  this.IdentifiedImageMatch = null
  this.IdentifiedImageHashTag = null
  this.IdentifiedImageLocation = null
  this.IdentifiedImagePartial = null
  this.toggleSection(null)

  var fileCaptured = event.target.files[0];
  console.log(fileCaptured)
  if (fileCaptured != null){
    this.base64Converter(fileCaptured).then(data => {
      this.ImageResize('data:image/jpeg;base64,' + data).then(ResizedImg => {
        this.ImagePreview(ResizedImg)
        this.sendtoAPI(ResizedImg).then(ImgAnalysisResult => this.SaveResults(ResizedImg,ImgAnalysisResult))
      })
    })
  }

  // FULL SIZE IMAGE
  // this.base64Converter(fileCaptured).then(data => {
  //   this.sendtoAPI(data)
  //   this.ImagePreview(data)
  // })
}

ImagePreview(ConvertedBase64Img){
  var Base64Img = 'data:image/jpeg;base64,' + ConvertedBase64Img
  this.UploadedImage = Base64Img
  // document.getElementById('UploadedImagePreview').src = Base64Img
}

ImageResize(fileCaptured){    
  return new Promise((resolve) => {
    var img = document.createElement("img");
    var canvas = document.createElement('canvas')
    img.src = fileCaptured
  
    img.onload = function() {
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var MAX_WIDTH = 800;
      var MAX_HEIGHT = 600;
      var width = img.width;
      var height = img.height;

      if (width <= MAX_WIDTH && height <= MAX_HEIGHT){
        console.log('No need to resize')
        var ConvertedBase64Img = fileCaptured.replace(/^data:image\/(png|jpeg|jpg);base64,/, "")
        resolve (ConvertedBase64Img)
      } else {
        console.log('Need to resize')
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        var Base64Img = canvas.toDataURL("image/png");
        var ConvertedBase64Img = Base64Img.replace(/^data:image\/(png|jpeg|jpg);base64,/, "")
        resolve (ConvertedBase64Img)
      }
    }
  })
}


base64Converter(file){
  return new Promise((resolve) => {
    var reader = new FileReader();
    reader.onload = (event) => {
      var Base64Img = event.target.result;
      var ConvertedBase64Img = Base64Img.replace(/^data:image\/(png|jpeg|jpg);base64,/, "")
      resolve (ConvertedBase64Img)
    };
    reader.readAsDataURL(file);
  })
}

sendtoAPI(ConvertedBase64Img){  
  return new Promise((resolve) => {
    this.GCP.cloudvisions(ConvertedBase64Img).subscribe(result => {
      // console.log(result.json().responses['0']);
      this.IdentifiedImageLogo = result.json().responses['0'].logoAnnotations
      this.IdentifiedImageLandmark = result.json().responses['0'].landmarkAnnotations
      this.IdentifiedImageLabel = result.json().responses['0'].labelAnnotations
      this.IdentifiedImageText = result.json().responses['0'].textAnnotations
      this.IdentifiedImageWeb = result.json().responses['0'].webDetection.webEntities
      this.IdentifiedImageSimilar = result.json().responses['0'].webDetection.visuallySimilarImages
      this.IdentifiedImageMatch = result.json().responses['0'].webDetection.fullMatchingImages
      this.IdentifiedImagePartial = result.json().responses['0'].webDetection.partialMatchingImages

      if (this.IdentifiedImageLandmark != null){
        this.IdentifiedImageLocation = this.IdentifiedImageWeb[0].description + ' ' + this.IdentifiedImageLandmark[0].description
        // console.log(this.IdentifiedImageLocation)
      }

      resolve(result.json().responses['0'])
    // this.IdentifiedImageHashTag = this.CombineArray(this.IdentifiedImageLandmark.concat(this.IdentifiedImageWeb).concat(this.IdentifiedImageLogo))
    });
  })
}


CombineArray(arrArg){
  arrArg.filter((elem, pos, arr) => arr.indexOf(elem) == pos)
}

toggleSection(Section) {

  if (Section != null) {
    if (this.itemExpand[Section]){
      this.itemExpand[Section] = false
    } else {
      this.itemExpand[Section] = true
    }
    if(Section=='Map' && this.itemExpand['Map'] && this.IdentifiedImageLocation != null){
      this.initializeMapWithLocation(this.IdentifiedImageLocation)
    }
  }else {
    this.itemExpand['Text']=false
    this.itemExpand['Map']=false
    this.itemExpand['Similar']=false
  } 
}

// getPlaceCoords(place){
//   return this.http.post('https://maps.googleapis.com/maps/api/geocode/json?address=Winnetka&key=AIzaSyB6qegPGtnrhFLUulqw2V4InNG604toSa8')
// }

GetLocation(SearchAddress) {
  return new Promise((resolve) => {
    var geocoder = new google.maps.Geocoder();
    var address = SearchAddress
    geocoder.geocode({'address': address}, (results) => {
      var latitude = results[0].geometry.location.lat();
      var longitude = results[0].geometry.location.lng();
      var AddressGeoCode = {lat: latitude, lng: longitude}
      resolve (AddressGeoCode)
    });
})}

initializeMapCurrentLocation() {
    // console.log(this.GetLocation('SHATIN'))
    let locationOptions = {timeout: 20000, enableHighAccuracy: true};    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            var LocationCenter = {lat: position.coords.latitude, lng: position.coords.longitude}
            let options = {
              center: new google.maps.LatLng(LocationCenter),
              zoom: 16,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            this.map = new google.maps.Map(document.getElementById("map"), options);

            let marker = new google.maps.Marker({
              map: this.map,
              animation: google.maps.Animation.DROP,
              position: this.map.getCenter()
            });
 
            let content = "<h4>Information!</h4>";         
            let infoWindow = new google.maps.InfoWindow({content: content});
            google.maps.event.addListener(marker, 'click', () =>  infoWindow.open(this.map, marker)  );

        }
  );
}

initializeMapWithLocation(Address) {
    // console.log(this.GetLocation('SHATIN'))
    this.GetLocation(Address).then(result => {
            var LocationCenter = result
            let options = {
              center: new google.maps.LatLng(LocationCenter),
              zoom: 16,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            this.map = new google.maps.Map(document.getElementById("map"), options);

            let marker = new google.maps.Marker({
              map: this.map,
              animation: google.maps.Animation.DROP,
              position: this.map.getCenter()
            });
 
            let content = Address;         
            let infoWindow = new google.maps.InfoWindow({content: content});
            google.maps.event.addListener(marker, 'click', () =>  infoWindow.open(this.map, marker)  );

        }
  );
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
