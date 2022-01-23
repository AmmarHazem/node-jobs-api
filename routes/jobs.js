const express = require("express");
const {
  getAllJobs,
  getJob,
  createJob,
  updatedJob,
  deleteJob,
} = require("../controllers/jobs");

const router = express.Router();

router.get("/", getAllJobs);
router.get("/:id", getJob);
router.post("/", createJob);
router.delete("/:id", deleteJob);
router.patch("/:id", updatedJob);

module.exports = router;
