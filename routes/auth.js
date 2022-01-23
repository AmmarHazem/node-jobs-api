const expres = require("express");
const { register, login } = require("../controllers/auth");

const router = expres.Router();

router.post("/login", login);
router.post("/register", register);

module.exports = router;
