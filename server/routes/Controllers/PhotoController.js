const firebaseDatabase = require('../../firebaseDb');
const detectFace = require('../../facerecofuncs/detect'); 
const enrollFace = require('../../facerecofuncs/enroll');
const recognizeFace = require('../../facerecofuncs/recognize'); 
const hostImage = require('../../imagehosting/hosting');
const axios = require('axios'); 

const PhotoController = {
    getPhoto: ((req, res) => {
        let url = req.originalUrl.slice(1)
        axios.get('http://'+ url, {responseType: 'arraybuffer'})
        .then((response, body) => {
            res.type('image/jpeg'); 
            res.end(response.data, 'binary'); 
        })
        .catch((error) => {
            console.log('error', error)
        }); 
    }),
    createPhoto : ((req, res) => {
        let photo = req.file.path;
        let photo_URL;
        
        hostImage.hostImage(photo, (url) => {
            photo_URL = url.imageUrl; 
            recognizeFace.recognizeFace('http://' + photo_URL, (result) => {
                let returnObj = {faceRectangle : result.faceRectangle}  
                returnObj.photo_URL = photo_URL;            
                if (result.candidates && result.candidates[0].confidence > 0.50) {
                    returnObj.name = result.candidates[0].subject_id; 
                }
                else {
                    returnObj.name = "Anonomyous"
                }
                res.status(201).send(returnObj); 
            });
        })
    }),
    getAllPhotos : ((req, res) => {
        firebaseDatabase.getAllPhotos(function(allPhotos) {
            res.status(200).send(allPhotos);
          });
    }), 
    increaseLike : ((req, res) => {
        firebaseDatabase.increaseLike(req.body.photo_ID);
        res.status(201).send("Increased a Like! spread the love! <3");
    }), 
    decreaseLike : ((req, res) => {
        firebaseDatabase.decreaseLike(req.body.photo_URL);
        // console.log("decreaseLike routes responding!", req);
        res.status(201).send("Decresased a Like :( why tho..");
    }),
    getPhotoInfo : ((req, res) => {
        firebaseDatabase.getPhotoInfo(req.query.photo_URL, function(photoInfo) {
            res.status(200).send(photoInfo);
          })
    }),
    addPhotoTags : ((req, res) => {
        let faceRectangle = req.body.faceRectangle;
        let caption = req.body.caption; 
        let photo_URL = req.body.photo_URL;
        let photo_ID = photo_URL.split('/')[1] + photo_URL.split('/')[2]; 

        let user_ID = req.body.user_ID || 'Anonymous';
        firebaseDatabase.createPhoto(photo_ID, photo_URL, user_ID);
        enrollFace.enrollFace('http://' + photo_URL, req.body.tag_name, (bool) => {
        if (bool) {
                firebaseDatabase.addPhotoTags(photo_ID, req.body.tag_name, faceRectangle);
                res.status(201).send('successfully added a tag on the photo');
            }
            else {
                res.status(500).send('could not add tag on the photo')
            }
        })
    }), 
    getPhotoByTag : ((req, res) => {
        firebaseDatabase.getPhotoByTag(req.query.tag_name, function(photos) {
            res.status(200).send(photos);
          });
    }), 
    addCaption : ((req, res) => {
        let photo_ID = req.body.photo_URL.split('/')[1] + req.body.photo_URL.split('/')[2]; 
        firebaseDatabase.addCaption(photo_ID, req.body.caption)
        res.status(201).send();
    }),
    getPhotoByUserID : ((req, res) => {
        console.log('this is headers', req.headers)
        firebaseDatabase.getPhotoByUserID(req.query.user_ID, function(photos) {
                                    //if req.query.user_ID does not work,
                                    //it would depend on how you are sending the
                                    //GET request. I do it little bit differently
                                    //than u guys i think. :)
            res.status(200).send(photos);  
        });
    })
}
module.exports = PhotoController; 