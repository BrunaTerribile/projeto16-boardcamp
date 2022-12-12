import joi from 'joi';

export const customerSchema = joi.object({
    name: joi.string().required(),
    phone: joi.number().required().min(10).max(11),
    cpf: joi.number().required().min(11),
    birthday: joi.number().required()
})