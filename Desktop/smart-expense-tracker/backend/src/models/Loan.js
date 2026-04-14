const db = require('../config/mongodb');

class Loan {
  static createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS loans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        name TEXT NOT NULL,
        source TEXT NOT NULL,
        purpose TEXT NOT NULL,
        totalAmount REAL NOT NULL,
        paidAmount REAL DEFAULT 0,
        dueDate TEXT,
        reminderSent INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `;
    db.exec(sql);
  }

  static create(loan) {
    const sql = `INSERT INTO loans (userId, name, source, purpose, totalAmount, paidAmount, dueDate, createdAt)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const stmt = db.prepare(sql);
    const result = stmt.run(
      loan.userId,
      loan.name,
      loan.source,
      loan.purpose,
      loan.totalAmount,
      loan.paidAmount || 0,
      loan.dueDate || null,
      loan.createdAt || new Date().toISOString()
    );
    return { id: result.lastInsertRowid, ...loan };
  }

  static findByUser(userId) {
    const sql = `SELECT * FROM loans WHERE userId = ? ORDER BY createdAt DESC`;
    return db.prepare(sql).all(userId);
  }

  static findById(id) {
    const sql = `SELECT * FROM loans WHERE id = ?`;
    return db.prepare(sql).get(id);
  }

  static updatePayment(id, amount) {
    const sql = `UPDATE loans SET paidAmount = paidAmount + ? WHERE id = ?`;
    return db.prepare(sql).run(amount, id);
  }

  static getPending(userId) {
    const sql = `SELECT * FROM loans WHERE userId = ? AND totalAmount > paidAmount ORDER BY dueDate ASC`;
    return db.prepare(sql).all(userId);
  }

  static delete(id) {
    const sql = `DELETE FROM loans WHERE id = ?`;
    return db.prepare(sql).run(id);
  }

  static updateReminderSent(id) {
    const sql = `UPDATE loans SET reminderSent = 1 WHERE id = ?`;
    return db.prepare(sql).run(id);
  }

  static getDueLoansToday() {
    const today = new Date().toISOString().slice(0,10);
    const sql = `
      SELECT loans.*, users.email, users.name as userName
      FROM loans
      JOIN users ON loans.userId = users.id
      WHERE loans.dueDate = ? AND loans.reminderSent = 0
    `;
    return db.prepare(sql).all(today);
  }
}

module.exports = Loan;
