const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp|svg|bmp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb('Error: File upload only supports the following filetypes - ' + filetypes);
  }
});

// @route   POST api/projects/upload
// @desc    Upload an image for a project
// @access  Private
router.post('/upload', auth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }
  res.json({ imageUrl: `http://localhost:5000/${req.file.path.replace(/\\/g, '/')}` });
});

// @route   POST api/projects
// @desc    Create a project
// @access  Private
router.post('/', auth, upload.single('image'), async (req, res) => {
  const {
    title,
    description,
    goal,
    category,
  } = req.body;
  
  let imageUrl = req.body.image; // Default to image URL from body

  if (req.file) {
    imageUrl = `http://localhost:5000/${req.file.path.replace(/\\/g, '/')}`;
  }

  try {
    const newProject = new Project({
      title,
      description,
      goal,
      category,
      image: imageUrl,
      createdBy: req.user.id,
    });

    const project = await newProject.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/projects
// @desc    Get all projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().populate('createdBy', ['name', 'profilePicture']).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/projects/:id
// @desc    Get project by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('donors', ['name', 'profilePicture'])
      .populate('createdBy', ['name', 'profilePicture']);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/projects/:id
// @desc    Update a project
// @access  Private
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  const {
    title,
    description,
    goal,
    category,
  } = req.body;

  let imageUrl = req.body.image; // Default to image URL from body

  if (req.file) {
    imageUrl = `http://localhost:5000/${req.file.path.replace(/\\/g, '/')}`;
  }

  const projectFields = {};
  if (title) projectFields.title = title;
  if (description) projectFields.description = description;
  if (goal) projectFields.goal = goal;
  if (category) projectFields.category = category;
  if (imageUrl) projectFields.image = imageUrl;

  try {
    let project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ msg: 'Project not found' });

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: projectFields },
      { new: true }
    );

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/projects/:id
// @desc    Delete a project
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ msg: 'Project not found' });

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Project removed' });
  } catch (err) {
    console.error(err); // Log the full error object
    res.status(500).send('Server Error');
  }
});

// @route   POST api/projects/:id/donate
// @desc    Donate to a project
// @access  Private
router.post('/:id/donate', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    const donationAmount = parseInt(req.body.amount, 10);

    if (isNaN(donationAmount) || donationAmount <= 0) {
      return res.status(400).json({ msg: 'Invalid donation amount' });
    }

    project.raised += donationAmount;

    if (!project.donors.some(donor => donor.toString() === req.user.id)) {
        project.donors.push(req.user.id);
    }

    await project.save();

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
