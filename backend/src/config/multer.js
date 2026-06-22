const upload = multer({
 storage,

 limits: {
   fileSize:
    5 * 1024 * 1024,
 },

 fileFilter:
  (req, file, cb) => {

   if (
    file.mimetype !==
    "application/pdf"
   ) {
    return cb(
      new Error(
       "Only PDF allowed"
      )
    );
   }

   cb(null, true);
 },
});