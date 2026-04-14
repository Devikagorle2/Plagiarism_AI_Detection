const SavingsGoal = require('../models/SavingsGoal');

const createGoal = async (req, res) => {
  try {
    const { name, target, current, deadline } = req.body;
    SavingsGoal.create({ userId: req.user.id, name, target, current: current || 0, deadline });
    res.json({ message: 'Goal created' });
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ error: 'Failed to create goal' });
  }
};

const getGoals = async (req, res) => {
  try {
    const goals = SavingsGoal.findByUser(req.user.id);
    res.json(goals);
  } catch (error) {
    console.error('Error getting goals:', error);
    res.status(500).json({ error: 'Failed to get goals' });
  }
};

const addToGoal = async (req, res) => {
  try {
    const { amount } = req.body;
    SavingsGoal.updateCurrent(req.params.id, amount);
    res.json({ message: 'Added to goal' });
  } catch (error) {
    console.error('Error adding to goal:', error);
    res.status(500).json({ error: 'Failed to add to goal' });
  }
};

const deleteGoal = async (req, res) => {
  try {
    SavingsGoal.delete(req.params.id);
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ error: 'Failed to delete goal' });
  }
};

module.exports = {
  createGoal,
  getGoals,
  addToGoal,
  deleteGoal
};
