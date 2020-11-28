const { storeFeedback} = require('../models/feedback')

async function submitFeedback(feedback) {
  try {
    // TO DO: Send us an email when someone gives feedback

    // Submit feedback in DB
    const feedbackId = storeFeedback(feedback)
    return feedbackId
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

module.exports = {
  submitFeedback,
}
