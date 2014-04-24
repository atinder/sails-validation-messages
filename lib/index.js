 /*
 * @param model {Object} An instance of a Sails.JS model object.
 * @param validationErrors {Object} A standard Sails.JS validation object.
 *
 * @returns {Object} An object with friendly validation error conversions.
 */ 
module.exports = function(model, validationError) {
  var validationResponse = {};
  var messages = model.validationMessages;
  validationFields = Object.keys(messages);
  validationFields.forEach(function(validationField) {
    
    if(validationError[validationField]) {
      var processField = validationError[validationField];
      processField.forEach(function(rule) {
        if(messages[validationField][rule.rule]) {
          if(!(validationResponse[validationField] instanceof Array)) {
            validationResponse[validationField] = new Array();
          }

          var newMessage={
            'rule' : rule.rule,
            'message' : messages[validationField][rule.rule]
          };

          validationResponse[validationField].push(newMessage);
        }
      });
 
    }
  });
 
  return validationResponse;
};