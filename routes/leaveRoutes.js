const express = require("express");

const validateToken = require("../middleware/validateTokenHandler");
const { postLeave, getLeave } = require("../controllers/leaveController");

const router = express.Router();

router.use(validateToken);
router.route("/postleave").post(postLeave);
router.route("/getleave").get(getLeave);


module.exports = router;