const db = require('../config/mongodb');

class BudgetCategory {
  static createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS budget_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        month TEXT NOT NULL,
        category TEXT NOT NULL,
        allocated REAL NOT NULL,
        spent REAL DEFAULT 0,
        FOREIGN KEY (userId) REFERENCES users(id),
        UNIQUE(userId, month, category)
      )
    `;
    db.exec(sql);
  }

  static setAllocation(userId, month, category, allocated) {
    const sql = `INSERT INTO budget_categories (userId, month, category, allocated, spent)
                 VALUES (?, ?, ?, ?, 0)
                 ON CONFLICT(userId, month, category)
                 DO UPDATE SET allocated = excluded.allocated`;
    return db.prepare(sql).run(userId, month, category, allocated);
  }

  static getByUserAndMonth(userId, month) {
    const sql = `SELECT * FROM budget_categories WHERE userId = ? AND month = ?`;
    return db.prepare(sql).all(userId, month);
  }

  static updateSpent(userId, month, category, spentDelta) {
    const sql = `UPDATE budget_categories
                 SET spent = spent + ?
                 WHERE userId = ? AND month = ? AND category = ?`;
    return db.prepare(sql).run(spentDelta, userId, month, category);
  }

  static deleteByUserAndMonth(userId, month) {
    const sql = `DELETE FROM budget_categories WHERE userId = ? AND month = ?`;
    return db.prepare(sql).run(userId, month);
  }

  static getTotalBudget(userId, month) {
    const sql = `SELECT SUM(allocated) as total FROM budget_categories WHERE userId = ? AND month = ?`;
    const result = db.prepare(sql).get(userId, month);
    return result.total || 0;
  }

  static getSavingsRemaining(userId, month) {
    const sql = `SELECT allocated - spent as remaining FROM budget_categories WHERE userId = ? AND month = ? AND category = 'Savings'`;
    const result = db.prepare(sql).get(userId, month);
    return result ? result.remaining : 0;
  }
}

module.exports = BudgetCategory;
