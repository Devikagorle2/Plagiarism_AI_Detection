const db = require('../config/mongodb');

class Budget {
  constructor(data) {
    this.id = data.id || null;
    this.userId = data.userId;
    this.monthlyBudget = data.monthlyBudget;
    this.month = data.month || new Date().toISOString().slice(0, 7);
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  static validate(data) {
    const errors = [];
    
    if (!data.monthlyBudget || data.monthlyBudget <= 0) {
      errors.push('Monthly budget must be greater than 0');
    }
    
    if (!data.month) {
      errors.push('Month is required');
    }
    
    // Validate month format (YYYY-MM)
    const monthRegex = /^\d{4}-\d{2}$/;
    if (data.month && !monthRegex.test(data.month)) {
      errors.push('Month must be in YYYY-MM format');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static createFromRequest(data, userId) {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return new Budget({
      ...data,
      userId,
      month: data.month || currentMonth
    });
  }

  async save() {
    this.updatedAt = new Date().toISOString();
    
    if (this.id) {
      // Update existing budget
      const stmt = db.prepare(`
        UPDATE budgets 
        SET monthlyBudget = ?, updatedAt = ?
        WHERE id = ?
      `);
      stmt.run(this.monthlyBudget, this.updatedAt, this.id);
      return this;
    } else {
      // Insert new budget
      const stmt = db.prepare(`
        INSERT INTO budgets (userId, monthlyBudget, month, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?)
      `);
      const result = stmt.run(
        this.userId,
        this.monthlyBudget,
        this.month,
        this.createdAt,
        this.updatedAt
      );
      this.id = result.lastInsertRowid;
      return this;
    }
  }

  static async findOne(query) {
    let sql = 'SELECT * FROM budgets WHERE ';
    const conditions = [];
    const params = [];

    if (query.userId) {
      conditions.push('userId = ?');
      params.push(query.userId);
    }
    if (query.month) {
      conditions.push('month = ?');
      params.push(query.month);
    }

    sql += conditions.join(' AND ');
    const stmt = db.prepare(sql);
    const row = stmt.get(...params);
    
    if (row) {
      return new Budget({
        id: row.id,
        userId: row.userId,
        monthlyBudget: row.monthlyBudget,
        month: row.month,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt
      });
    }
    return null;
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      monthlyBudget: this.monthlyBudget,
      month: this.month,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Budget;
