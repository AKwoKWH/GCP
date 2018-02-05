import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { FirebaseEnvironment } from '../firebase/firebase';
@Injectable()
export class GoogleCloudAPI {
  constructor(public http: Http) { }
  cloudvision(base64Image,DetectionType) {
    const body = {
      "requests": [
        {
          "image": {
            "content": base64Image
          },
          "features": [
            {
              "type": DetectionType
            }
          ]
        }
      ]
    }
    console.log('body',body)
    return this.http.post('https://vision.googleapis.com/v1/images:annotate?key=' + FirebaseEnvironment.firebaseConfig.googleCloudAPIKey, body);
  }

  cloudvisions(base64Image) {
    const body = {
      "requests": [
        {
          "image": {"content": base64Image},
          "features": [
            {"type":"LANDMARK_DETECTION"},
            {"type":"LABEL_DETECTION"},
            {"type":"LOGO_DETECTION"},
            {"type":"TEXT_DETECTION"},
            {"type":"WEB_DETECTION"},
            {"type":"SAFE_SEARCH_DETECTION"}
          ]
        }
      ]
    }
    console.log('body',body)
    return this.http.post('https://vision.googleapis.com/v1/images:annotate?key=' + FirebaseEnvironment.firebaseConfig.googleCloudAPIKey, body);  
  }

  naturallanguage(string) {
    
  }



}