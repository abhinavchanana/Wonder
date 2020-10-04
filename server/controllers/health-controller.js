// get health of application
exports.getHealth = (req,data, res) => {
  console.log('In controller - getHealth');
  res.json({
    status: 'UP',
  });
};
