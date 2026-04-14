const bcrypt = require('bcryptjs');
const db = require('../config/mongodb');

class User {
  constructor(data) {
    this.id = data.id || null;
    this.email = data.email;
    this.password = data.password;
    this.name = data.name;
    this.photoURL = data.photoURL || '';
    this.provider = data.provider || 'email';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.lastLoginAt = data.lastLoginAt || new Date().toISOString();
  }

  static validate(data) {
    const errors = [];
    
    if (!data.email) {
      errors.push('Email is required');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
      errors.push('Invalid email format');
    }
    
    if (!data.name || data.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }
    
    if (data.provider === 'email' && !data.password) {
      errors.push('Password is required for email login');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async save() {
    if (this.id) {
      // Update existing user
      const stmt = db.prepare(`
        UPDATE users
        SET name = ?, photoURL = ?, lastLoginAt = ?
        WHERE id = ?
      `);
      stmt.run(this.name, this.photoURL, this.lastLoginAt, this.id);
      return this;
    } else {
      // Insert new user
      const hashedPassword = await bcrypt.hash(this.password, 10);
      const stmt = db.prepare(`
        INSERT INTO users (email, password, name, photoURL, provider, createdAt, lastLoginAt)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(
        this.email,
        hashedPassword,
        this.name,
        this.photoURL,
        this.provider,
        this.createdAt,
        this.lastLoginAt
      );
      this.id = result.lastInsertRowid;
      return this;
    }
  }

  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  static async findOne(query) {
    let sql = 'SELECT * FROM users WHERE ';
    const conditions = [];
    const params = [];

    if (query.email) {
      conditions.push('email = ?');
      params.push(query.email);
    }
    if (query._id) {
      conditions.push('id = ?');
      params.push(query._id);
    }

    sql += conditions.join(' AND ');
    const stmt = db.prepare(sql);
    const row = stmt.get(...params);
    
    if (row) {
      return new User({
        id: row.id,
        email: row.email,
        password: row.password,
        name: row.name,
        photoURL: row.photoURL,
        provider: row.provider,
        createdAt: row.createdAt,
        lastLoginAt: row.lastLoginAt
      });
    }
    return null;
  }

  static async findById(userId) {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const row = stmt.get(userId);
    
    if (row) {
      return new User({
        id: row.id,
        email: row.email,
        password: row.password,
        name: row.name,
        photoURL: row.photoURL,
        provider: row.provider,
        createdAt: row.createdAt,
        lastLoginAt: row.lastLoginAt
      });
    }
    return null;
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      photoURL: this.photoURL,
      provider: this.provider,
      createdAt: this.createdAt,
      lastLoginAt: this.lastLoginAt
    };
  }
}

module.exports = User;
