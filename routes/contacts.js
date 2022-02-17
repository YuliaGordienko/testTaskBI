const express = require("express");
const router = express.Router();
const getAll = require("../controllers/getAll");

router.get("/", getAll);
module.exports = router;
