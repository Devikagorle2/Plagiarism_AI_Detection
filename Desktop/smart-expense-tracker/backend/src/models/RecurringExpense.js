const db = require('../config/mongodb');

class RecurringExpense {
  static createTable() {
    db.exec(`
      CREATE TABLE IF NOT EXISTS recurring_expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        frequency TEXT,
        nextDue TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);
  }

  static create(recurring) {
    const sql = `INSERT INTO recurring_expenses (userId, amount, category, description, frequency, nextDue, createdAt)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    return db.prepare(sql).run(
      recurring.userId, recurring.amount, recurring.category, recurring.description, recurring.frequency, recurring.nextDue, new Date().toISOString()
    );
  }

  static findByUser(userId) {
    return db.prepare(`SELECT * FROM recurring_expenses WHERE userId = ?`).all(userId);
  }

  static delete(id) {
    return db.prepare(`DELETE FROM recurring_expenses WHERE id = ?`).run(id);
  }

  static getDueToday() {
    const today = new Date().toISOString().slice(0, 10);
    return db.prepare(`SELECT * FROM recurring_expenses WHERE nextDue <= ?`).all(today);
  }

  static updateNextDue(id, nextDue) {
    return db.prepare(`UPDATE recurring_expenses SET nextDue = ? WHERE id = ?`).run(nextDue, id);
  }
}

module.exports = RecurringExpense;
