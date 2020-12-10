const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.all("*", (req, res, next) => {
	if (req.originalUrl.startsWith("/api")) {
		// skip any /api routes
		next();
	} else {
		res.sendFile(path.join(__dirname, "../dist/index.html"));
	}
});

module.exports = router;

