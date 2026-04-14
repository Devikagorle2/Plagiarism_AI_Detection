const db = require('../config/mongodb');

class Expense {
  constructor(data) {
    this.id = data.id || null;
    this.userId = data.userId;
    this.amount = data.amount;
    this.category = data.category;
    this.description = data.description || '';
    this.date = data.date || new Date().toISOString();
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  static validate(data) {
    const errors = [];
    
    if (!data.amount || data.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }
    
    if (!data.category) {
      errors.push('Category is required');
    }
    
    const validCategories = ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Others'];
    if (data.category && !validCategories.includes(data.category)) {
      errors.push('Invalid category');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static createFromRequest(data, userId) {
    return new Expense({
      ...data,
      userId,
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString()
    });
  }

  async save() {
    if (this.id) {
      // Update existing expense
      const stmt = db.prepare(`
        UPDATE expenses 
        SET amount = ?, category = ?, description = ?, date = ?
        WHERE id = ?
      `);
      stmt.run(this.amount, this.category, this.description, this.date, this.id);
      return this;
    } else {
      // Insert new expense
      const stmt = db.prepare(`
        INSERT INTO expenses (userId, amount, category, description, date, createdAt)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(
        this.userId,
        this.amount,
        this.category,
        this.description,
        this.date,
        this.createdAt
      );
      this.id = result.lastInsertRowid;
      return this;
    }
  }

  static async find(query) {
    const conditions = [];
    const params = [];

    if (query.userId) {
      conditions.push('userId = ?');
      params.push(query.userId);
    }

    if (query.date) {
      if (query.date.$gte) {
        conditions.push('date >= ?');
        params.push(new Date(query.date.$gte).toISOString());
      }
      if (query.date.$lte) {
        conditions.push('date <= ?');
        params.push(new Date(query.date.$lte).toISOString());
      }
    }

    if (query.category) {
      conditions.push('category = ?');
      params.push(query.category);
    }

    let sql = 'SELECT * FROM expenses';
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    let stmt = db.prepare(sql);
    let rows = stmt.all(...params);

    return rows.map(row => new Expense({
      id: row.id,
      userId: row.userId,
      amount: row.amount,
      category: row.category,
      description: row.description,
      date: row.date,
      createdAt: row.createdAt
    }));
  }

  static async findById(expenseId) {
    const stmt = db.prepare('SELECT * FROM expenses WHERE id = ?');
    const row = stmt.get(expenseId);
    
    if (row) {
      return new Expense({
        id: row.id,
        userId: row.userId,
        amount: row.amount,
        category: row.category,
        description: row.description,
        date: row.date,
        createdAt: row.createdAt
      });
    }
    return null;
  }

  static async findByIdAndDelete(expenseId) {
    const stmt = db.prepare('DELETE FROM expenses WHERE id = ?');
    stmt.run(expenseId);
  }

  static async countDocuments(query) {
    const conditions = [];
    const params = [];

    if (query.userId) {
      conditions.push('userId = ?');
      params.push(query.userId);
    }

    if (query.date) {
      if (query.date.$gte) {
        conditions.push('date >= ?');
        params.push(new Date(query.date.$gte).toISOString());
      }
      if (query.date.$lte) {
        conditions.push('date <= ?');
        params.push(new Date(query.date.$lte).toISOString());
      }
    }

    if (query.category) {
      conditions.push('category = ?');
      params.push(query.category);
    }

    let sql = 'SELECT COUNT(*) as count FROM expenses';
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    const stmt = db.prepare(sql);
    const result = stmt.get(...params);
    return result.count;
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      amount: this.amount,
      category: this.category,
      description: this.description,
      date: this.date,
      createdAt: this.createdAt
    };
  }
}

module.exports = Expense;
