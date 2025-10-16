/**
 * Hero Section Controller
 * Handles CRUD operations for the Hero section
 */

const prisma = require('../utills/db');

/**
 * Get Hero Section Data
 * GET /api/hero
 */
const getHero = async (req, res) => {
  try {
    // Get the first (and only) hero section
    const hero = await prisma.heroSection.findFirst({
      where: { isActive: true }
    });

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: 'Hero section not found'
      });
    }

    res.status(200).json({
      success: true,
      data: hero
    });
  } catch (error) {
    console.error('Error fetching hero:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hero section',
      error: error.message
    });
  }
};

/**
 * Update Hero Section
 * PUT /api/hero/:id
 */
const updateHero = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      badge,
      title,
      description,
      imageUrl,
      button1Text,
      button1Link,
      button2Text,
      button2Link,
      stat1Value,
      stat1Label,
      stat2Value,
      stat2Label,
      isActive
    } = req.body;

    // Validate required fields
    if (!title || !description || !imageUrl || !button1Link || !button2Link) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Update hero section
    const updatedHero = await prisma.heroSection.update({
      where: { id },
      data: {
        badge: badge || 'FEATURED PRODUCT',
        title,
        description,
        imageUrl,
        button1Text: button1Text || 'BUY NOW',
        button1Link,
        button2Text: button2Text || 'LEARN MORE',
        button2Link,
        stat1Value: stat1Value || '50K+',
        stat1Label: stat1Label || 'Happy Customers',
        stat2Value: stat2Value || '4.9',
        stat2Label: stat2Label || 'Rating',
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: new Date()
      }
    });

    res.status(200).json({
      success: true,
      message: 'Hero section updated successfully',
      data: updatedHero
    });
  } catch (error) {
    console.error('Error updating hero:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update hero section',
      error: error.message
    });
  }
};

/**
 * Create Hero Section (if not exists)
 * POST /api/hero
 */
const createHero = async (req, res) => {
  try {
    const {
      badge,
      title,
      description,
      imageUrl,
      button1Text,
      button1Link,
      button2Text,
      button2Link,
      stat1Value,
      stat1Label,
      stat2Value,
      stat2Label
    } = req.body;

    // Validate required fields
    if (!title || !description || !imageUrl || !button1Link || !button2Link) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if hero already exists
    const existingHero = await prisma.heroSection.findFirst();
    if (existingHero) {
      return res.status(400).json({
        success: false,
        message: 'Hero section already exists. Use PUT to update.'
      });
    }

    // Create new hero section
    const newHero = await prisma.heroSection.create({
      data: {
        badge: badge || 'FEATURED PRODUCT',
        title,
        description,
        imageUrl,
        button1Text: button1Text || 'BUY NOW',
        button1Link,
        button2Text: button2Text || 'LEARN MORE',
        button2Link,
        stat1Value: stat1Value || '50K+',
        stat1Label: stat1Label || 'Happy Customers',
        stat2Value: stat2Value || '4.9',
        stat2Label: stat2Label || 'Rating',
        isActive: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Hero section created successfully',
      data: newHero
    });
  } catch (error) {
    console.error('Error creating hero:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create hero section',
      error: error.message
    });
  }
};

module.exports = {
  getHero,
  updateHero,
  createHero
};