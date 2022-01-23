const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const JobModel = require("../models/Job");

const getAllJobs = async (request, response) => {
  const jobs = await JobModel.find({ createdBy: request.user.id })
    .sort("createdAt")
    .select("-__v");
  response.json({
    count: jobs.length,
    jobs,
  });
};

const getJob = async (request, response) => {
  const userID = request.user.id;
  const jobID = request.params.id;
  try {
    const job = await JobModel.findOne({
      _id: jobID,
      createdBy: userID,
    }).select("-__v");
    if (!job) {
      throw new NotFoundError("Job not found");
    }
    response.json(job);
  } catch (e) {
    throw new NotFoundError("Job not found");
  }
};

const createJob = async (request, response) => {
  request.body.createdBy = request.user.id;
  const job = await JobModel.create(request.body);
  response.status(StatusCodes.CREATED).json(job);
};

const updatedJob = async (request, response) => {
  const userID = request.user.id;
  const jobID = request.params.id;
  const { company, position } = request.body;
  if (!company || !position) {
    throw new BadRequestError("company and position are required");
  }
  const job = await JobModel.findOneAndUpdate(
    {
      _id: jobID,
      createdBy: userID,
    },
    { company, position },
    { new: true, runValidators: true }
  );
  if (!job) {
    throw new NotFoundError("Job not found");
  }
  response.json(job);
};

const deleteJob = async (request, response) => {
  const jobID = request.params.id;
  const userID = request.user.id;
  const job = await JobModel.findOneAndRemove({
    _id: jobID,
    createdBy: userID,
  });
  if (!job) {
    throw new NotFoundError("Job not found");
  }
  response.json(job);
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updatedJob,
  deleteJob,
};
