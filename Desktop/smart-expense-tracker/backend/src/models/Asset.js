const db = require('../config/mongodb');

class Asset {
  static createTable() {
    db.exec(`
      CREATE TABLE IF NOT EXISTS assets (
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

  static create(asset) {
    const sql = `INSERT INTO assets (userId, name, type, value, date, createdAt)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    return db.prepare(sql).run(
      asset.userId, asset.name, asset.type, asset.value, asset.date, new Date().toISOString()
    );
  }

  static findByUser(userId) {
    return db.prepare(`SELECT * FROM assets WHERE userId = ? ORDER BY date DESC`).all(userId);
  }

  static delete(id) {
    return db.prepare(`DELETE FROM assets WHERE id = ?`).run(id);
  }

  static getTimeline(userId) {
    return db.prepare(`
      SELECT date, SUM(value) as total 
      FROM assets 
      WHERE userId = ? 
      GROUP BY date 
      ORDER BY date ASC
    `).all(userId);
  }
}

module.exports = Asset;
