module.exports = (req, res, next) => {
  if (req.session && req.session.user) {
    next()
  }
  else {
    next({ api: 403, apiMessage: 'not authorized' })
  }
}