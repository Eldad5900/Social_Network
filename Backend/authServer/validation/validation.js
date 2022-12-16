import Joi from "@hapi/joi";

export const signUpValidation = (data) => {
  const schema = new Joi.object().keys({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    imageUrl: Joi.string(),
  });

  return Joi.attempt(data, schema);
};

export const loginValidation = (data) => {
  const schema = new Joi.object().keys({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });

  return Joi.attempt(data, schema);
};

export const resetPasswordValidation = (data) => {
  const schema = new Joi.object().keys({
    password1: Joi.string().min(6).required(),
    password2: Joi.string().min(6).required().equal(Joi.ref("password1")),
  });

  return Joi.attempt(data, schema);
};
