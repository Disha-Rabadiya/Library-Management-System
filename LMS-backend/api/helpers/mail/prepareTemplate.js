// const { FS, PATH, HANDLEBARS, SQS_EVENTS, TEMPLATE_BASE_PATH } =
//   sails.config.constants;

const {
  FS,
  PATH,
  HANDLEBARS,
  SQS_EVENTS,
  TEMPLATE_BASE_PATH,
} = require('../../../config/constants');

const prepareTemplate = async function (subtype, payload) {
  try {
    //set language from payload if not provided in payload set to default language
    let lang = payload.lang ? payload.lang : 'en';

    switch (subtype) {
      /* This code block is reading a Handlebars template file, compiling it, and then replacing
          placeholders in the template with values from the `payload` object.
          according to events */
      case SQS_EVENTS.MAIL.USER_FORGOT_PASSWORD:
        let userForgetPwdTemplateFile = await FS.readFileSync(
          PATH.join(TEMPLATE_BASE_PATH, lang, `${subtype}.hbs`),
          {
            encoding: 'utf-8',
          }
        );
        if (userForgetPwdTemplateFile) {
          let template = HANDLEBARS.compile(userForgetPwdTemplateFile);
          let replacements = {
            name: payload.name,
            url: payload.url,
            createdBy: payload.createdBy,
          };
          let htmlToSend = template(replacements);

          return htmlToSend;
        }
        break;

      default:
        break;
    }
  } catch (error) {
    throw error;
  }
};

module.exports = { prepareTemplate };
