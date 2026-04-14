const Asset = require('../models/Asset');
const Liability = require('../models/Liability');

const addAsset = async (req, res) => {
  try {
    const { name, type, value, date } = req.body;
    Asset.create({ userId: req.user.id, name, type, value, date });
    res.json({ message: 'Asset added' });
  } catch (error) {
    console.error('Error adding asset:', error);
    res.status(500).json({ error: 'Failed to add asset' });
  }
};

const addLiability = async (req, res) => {
  try {
    const { name, type, value, date } = req.body;
    Liability.create({ userId: req.user.id, name, type, value, date });
    res.json({ message: 'Liability added' });
  } catch (error) {
    console.error('Error adding liability:', error);
    res.status(500).json({ error: 'Failed to add liability' });
  }
};

const getNetWorth = async (req, res) => {
  try {
    const assets = Asset.findByUser(req.user.id);
    const liabilities = Liability.findByUser(req.user.id);
    const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
    const totalLiabilities = liabilities.reduce((sum, l) => sum + l.value, 0);
    const netWorth = totalAssets - totalLiabilities;

    // Get timeline (last 6 months)
    const assetTimeline = Asset.getTimeline(req.user.id);
    const liabilityTimeline = Liability.getTimeline(req.user.id);
    
    // Merge dates
    const allDates = [...new Set([...assetTimeline.map(a => a.date), ...liabilityTimeline.map(l => l.date)])].sort();
    const timeline = allDates.map(date => {
      const assetsOnDate = assetTimeline.find(a => a.date === date)?.total || 0;
      const liabilitiesOnDate = liabilityTimeline.find(l => l.date === date)?.total || 0;
      return { date, assets: assetsOnDate, liabilities: liabilitiesOnDate, netWorth: assetsOnDate - liabilitiesOnDate };
    });

    res.json({ assets, liabilities, totalAssets, totalLiabilities, netWorth, timeline });
  } catch (error) {
    console.error('Error getting net worth:', error);
    res.status(500).json({ error: 'Failed to get net worth' });
  }
};

const deleteAsset = async (req, res) => {
  try {
    Asset.delete(req.params.id);
    res.json({ message: 'Asset deleted' });
  } catch (error) {
    console.error('Error deleting asset:', error);
    res.status(500).json({ error: 'Failed to delete asset' });
  }
};

const deleteLiability = async (req, res) => {
  try {
    Liability.delete(req.params.id);
    res.json({ message: 'Liability deleted' });
  } catch (error) {
    console.error('Error deleting liability:', error);
    res.status(500).json({ error: 'Failed to delete liability' });
  }
};

module.exports = {
  addAsset,
  addLiability,
  getNetWorth,
  deleteAsset,
  deleteLiability
};
