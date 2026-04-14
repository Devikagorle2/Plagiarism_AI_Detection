const db = require('../config/mongodb');

class Liability {
  static createTable() {
    db.exec(`
      CREATE TABLE IF NOT EXISTS liabilities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        value REAL NOT NULL,
        date TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);
  }

  static create(liability) {
    const sql = `INSERT INTO liabilities (userId, name, type, value, date, createdAt)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    return db.prepare(sql).run(
      liability.userId, liability.name, liability.type, liability.value, liability.date, new Date().toISOString()
    );
  }

  static findByUser(userId) {
    return db.prepare(`SELECT * FROM liabilities WHERE userId = ? ORDER BY date DESC`).all(userId);
  }

  static delete(id) {
    return db.prepare(`DELETE FROM liabilities WHERE id = ?`).run(id);
  }

  static getTimeline(userId) {
    return db.prepare(`
      SELECT date, SUM(value) as total 
      FROM liabilities 
      WHERE userId = ? 
      GROUP BY date 
      ORDER BY date ASC
    `).all(userId);
  }
}

module.exports = Liability;
