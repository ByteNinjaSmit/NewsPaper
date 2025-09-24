const express = require("express");
const router = express.Router();

const multer = require('multer');
const path = require('path');
const mediaControllers= require('../controllers/media-controller');



// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads'); // Directory where files are stored
    },
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname + "_" + Date.now() +"_"+Math.round(Math.random() * 1e9) + path.extname(file.originalname) // Unique file name
      );
    },
  });

const upload = multer({
    storage:storage,
})


router.route("/new").post(upload.array('files',20),mediaControllers.imageUploader);
router.route('/data').get(mediaControllers.getMedia);


module.exports  = router;