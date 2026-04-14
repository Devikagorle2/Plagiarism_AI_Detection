const Joi = require('joi');

const expenseSchema = Joi.object({
  amount: Joi.number().positive().required().messages({
    'number.positive': 'Amount must be greater than 0',
    'any.required': 'Amount is required'
  }),
  category: Joi.string().valid('Food', 'Travel', 'Shopping', 'Bills', 'Others').required().messages({
    'any.only': 'Category must be one of: Food, Travel, Shopping, Bills, Others',
    'any.required': 'Category is required'
  }),
  description: Joi.string().optional().max(500),
  date: Joi.date().optional().iso()
});

const budgetSchema = Joi.object({
  monthlyBudget: Joi.number().positive().required().messages({
    'number.positive': 'Budget must be greater than 0',
    'any.required': 'Monthly budget is required'
  }),
  month: Joi.string().pattern(/^\d{4}-\d{2}$/).optional().messages({
    'string.pattern.base': 'Month must be in YYYY-MM format'
  })
});

const validateExpense = (req, res, next) => {
  const { error } = expenseSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: error.details.map(detail => detail.message) 
    });
  }
  next();
};

const validateBudget = (req, res, next) => {
  const { error } = budgetSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: error.details.map(detail => detail.message) 
    });
  }
  next();
};

module.exports = { validateExpense, validateBudget };
