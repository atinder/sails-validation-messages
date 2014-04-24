sails-validation-messages
=========================

custom sails js model validation messages ( tested with sails v0.10 only )


# Usage

module.exports = {
  attributes: {
    name: {
      type: "string",
      required: true,
      maxLength: 50
    }
    email: {
      type: "email",
      required: true,
      unique: true,
      maxLength: 50
    }
  },
  validationMessages: {
    name: {
      required: 'Name is required'
      maxLength : 'Name can not be greater than 50 characters'
    },
    email: {
      required : 'Email is required',
      email : 'Enter valid email',
      maxLength : 'Email can not be greater than 50 characters'
    },
  }
};
