const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// @route   GET api/stats
// @desc    Get donation statistics
// @access  Public
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();

    const totalRaised = projects.reduce((acc, project) => acc + project.raised, 0);
    const projectsFunded = projects.length;
    
    const allDonors = projects.flatMap(project => project.donors);
    const activeDonors = new Set(allDonors.map(donor => donor.toString())).size;

    const scholarshipsAwarded = projects.filter(project => project.category === 'scholarships').length;

    res.json({
      totalRaised,
      activeDonors,
      projectsFunded,
      scholarshipsAwarded,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

// @route   GET api/stats/charts
// @desc    Get data for charts
// @access  Public
router.get('/charts', async (req, res) => {
  try {
    const projects = await Project.find();

    // Donation distribution by category
    const donationDistribution = projects.reduce((acc, project) => {
      const category = project.category || 'Other';
      acc[category] = (acc[category] || 0) + project.raised;
      return acc;
    }, {});

    const donationData = Object.keys(donationDistribution).map(category => ({
      category,
      value: donationDistribution[category],
    }));

    // Monthly donation trends
    const monthlyData = Array(12).fill(0).map((_, i) => ({ month: i, amount: 0 }));
    projects.forEach(project => {
      if (project.donations) {
        project.donations.forEach(donation => {
          const month = new Date(donation.date).getMonth();
          monthlyData[month].amount += donation.amount;
        });
      }
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyDataWithName = monthlyData.map((data, i) => ({
      month: monthNames[i],
      amount: data.amount,
    }));

    res.json({ donationData, monthlyData: monthlyDataWithName });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
