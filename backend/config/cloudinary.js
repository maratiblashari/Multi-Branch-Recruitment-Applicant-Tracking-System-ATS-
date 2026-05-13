const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for resumes (PDF only)
const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ats/resumes',
    allowed_formats: ['pdf'],
    resource_type: 'raw',
  },
});

// Storage for cover letters (PDF or DOCX)
const coverLetterStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ats/cover_letters',
    allowed_formats: ['pdf', 'docx'],
    resource_type: 'raw',
  },
});

// Storage for profile pictures
const profilePicStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ats/profile_pics',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    resource_type: 'image',
  },
});

const uploadResume = multer({ storage: resumeStorage });
const uploadCoverLetter = multer({ storage: coverLetterStorage });
const uploadProfilePic = multer({ storage: profilePicStorage });

module.exports = {
  cloudinary,
  uploadResume,
  uploadCoverLetter,
  uploadProfilePic,
};
