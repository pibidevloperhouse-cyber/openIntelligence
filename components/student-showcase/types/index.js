/**
 * Student Showcase Project Definitions (JavaScript)
 *
 * @typedef {Object} StudentProject
 * @property {string} id
 * @property {string} title
 * @property {string} tagline
 * @property {string} description
 * @property {string} category
 * @property {string} leadStudent
 * @property {string[]} teamMembers
 * @property {string} institution
 * @property {string} image
 * @property {string[]} tags
 * @property {number} upvotes
 * @property {number} [rank]
 * @property {string} [prizeAmountINR]
 * @property {string} [prizeAmountUSD]
 * @property {boolean} openIntelligenceFeatured
 * @property {string} [demoUrl]
 * @property {string} [githubUrl]
 * @property {string} [videoUrl]
 * @property {string[]} architectureHighlights
 * @property {string} impactMetric
 */

/**
 * @typedef {Object} FaqItem
 * @property {string} question
 * @property {string} answer
 * @property {string} category
 */

/**
 * @typedef {Object} TimelineStep
 * @property {string} date
 * @property {string} title
 * @property {string} description
 * @property {'completed' | 'active' | 'upcoming'} status
 */

export const CATEGORIES = [
  'AI & ML',
  'Robotics & GreenTech',
  'Cybersecurity & Web3',
  'IoT & Hardware',
  'Healthcare & Assistive',
];

export default {
  CATEGORIES,
};
