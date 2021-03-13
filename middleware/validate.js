import Joi from 'joi';

export const validateBody = (schema) => {
  return (req, res, next) => {
    const result = schema.validate(req.body);
    if (result.error) {
      return res.status(400).json(result.error);
    }
    if (!req.value) {
      req.value = {};
    }
    req.value['body'] = result.value;
    next();
  };
};

export const validateParam = (schema, name) => {
  return (req, res, next) => {
    const result = schema.validate({ param: req['params'][name] }, shema);
    if (result.error) {
      return res.status(400).json(result.error);
    } else {
      if (!req.value) {
        req.value = {};
      }
      if (!req.value['params']) req.value['params'] = {};
      req.value['params'][name] = value;
      next();
    }
  };
};

export const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6)
});
export const signUpSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  confirmpassword: Joi.any().valid(Joi.ref('password')).required()
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});
export const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  confirmpassword: Joi.any().valid(Joi.ref('password')).required()
});

export const idSchema = Joi.object().keys({
  userId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
});
