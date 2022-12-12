import joi from 'joi';

export const customerSchema = joi.object({
    name: joi.string().required(),
    phone: joi.number().min(10),
    cpf: joi.number().min(11),
    birthday: joi.required()
})