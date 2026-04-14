const db = require('../config/mongodb');

class SavingsGoal {
  static createTable() {
    db.exec(`
      CREATE TABLE IF NOT EXISTS savings_goals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        name TEXT NOT NULL,
        target REAL NOT NULL,
        current REAL DEFAULT 0,
        deadline TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);
  }

  static create(goal) {
    const sql = `INSERT INTO savings_goals (userId, name, target, current, deadline, createdAt)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    return db.prepare(sql).run(goal.userId, goal.name, goal.target, goal.current || 0, goal.deadline, new Date().toISOString());
  }

  static findByUser(userId) {
    return db.prepare(`SELECT * FROM savings_goals WHERE userId = ?`).all(userId);
  }

  static updateCurrent(id, amount) {
    return db.prepare(`UPDATE savings_goals SET current = current + ? WHERE id = ?`).run(amount, id);
  }

  static delete(id) {
    return db.prepare(`DELETE FROM savings_goals WHERE id = ?`).run(id);
  }
}

module.exports = SavingsGoal;
