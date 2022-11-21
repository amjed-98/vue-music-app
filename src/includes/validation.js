import {
  Form as VeeForm, Field as VeeField, defineRule, ErrorMessage, configure,
} from 'vee-validate';
import {
  max,
  required,
  min,
  alpha_spaces as alphaSpaces,
  email,
  min_value as minVal,
  max_value as maxVal,
  confirmed,
  not_one_of as excluded,
} from '@vee-validate/rules';

export default {
  install(app) {
    app.component('VeeForm', VeeForm);
    app.component('VeeField', VeeField);
    app.component('ErrorMessage', ErrorMessage);

    defineRule('required', required);
    defineRule('tos_required', required);
    defineRule('min', min);
    defineRule('max', max);
    defineRule('alpha_spaces', alphaSpaces);
    defineRule('email', email);
    defineRule('min_value', minVal);
    defineRule('max_value', maxVal);
    defineRule('passwords_mismatch', confirmed);
    defineRule('excluded', excluded);
    defineRule('country_excluded', excluded);

    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: `The field ${ctx.field} is required.`,
          tos_required: 'You must accept the terms of service.',
          min: `The field ${ctx.field} must be at least ${ctx.rule.params}.`,
          max: `The field ${ctx.field} must be at most ${ctx.rule.params}.`,
          alpha_spaces: `The field ${ctx.field} must be alphabetic and spaces only.`,
          email: `The field ${ctx.field} must be a valid email.`,
          min_value: `The field ${ctx.field} must be at least ${ctx.rule.params}.`,
          max_value: `The field ${ctx.field} must be at most ${ctx.rule.params}.`,
          passwords_mismatch: 'The passwords do not match.',
          excluded: `The field ${ctx.field} must not be one of ${ctx.value}.`,
          country_excluded: 'Due to restrictions in your country, we do not accept users from this locations',
        };

        const message = messages[ctx.rule.name] ?? `The field ${ctx.field} is invalid`;
        return message;
      },
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: false,
      validateOnModelUpdate: true,
    });
  },
};
