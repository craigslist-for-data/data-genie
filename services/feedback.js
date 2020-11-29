const { storeFeedback} = require('../models/feedback')
const {sendEmail} = require('../models/emails.js')

async function submitFeedback(feedback) {
  try {
    // TO DO: Send us an email when someone gives feedback
    const msg = {
      to: 'craigslistfordata@gmail.com',
      from: 'craigslistfordata@gmail.com',
      subject: 'Data Genie User Feedback!',
      text: `${feedback.message}`,
      // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }
    sendEmail(msg)

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
