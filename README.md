sails-validation-messages
=========================

custom sails js model validation messages ( tested with sails v0.10 only )


# Usage for a User model ( User.js )

```javascript

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



User.create(data).exec(function created (err, data) {

  if(err) {
    if(err.invalidAttributes) {
      validator = require('sails-validation-messages');
      err.invalidAttributes = validator(User, err.invalidAttributes);
      return res.negotiate(err);
    }
  }

});

```

# Blueprint usage example (api/blueprints/create.js)

```javascript

/**
 * Module dependencies
 */
var util = require('util'),
  actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil'),
  validator = require('sails-validation-messages');


/**
 * Create Record
 *
 * post /:modelIdentity
 *
 * An API call to find and return a single model instance from the data adapter
 * using the specified criteria.  If an id was specified, just the instance with
 * that unique id will be returned.
 *
 * Optional:
 * @param {String} callback - default jsonp callback param (i.e. the name of the js function returned)
 * @param {*} * - other params will be used as `values` in the create
 */
module.exports = function createRecord (req, res) {

  var Model = actionUtil.parseModel(req);

  // Create data object (monolithic combination of all parameters)
  // Omit the blacklisted params (like JSONP callback param, etc.)
  var data = actionUtil.parseValues(req);

  // Create new instance of model using data from params
  Model.create(data).exec(function created (err, newInstance) {

    // Differentiate between waterline-originated validation errors
    // and serious underlying issues. Respond with badRequest if a
    // validation error is encountered, w/ validation info.
    if(err) {
      if(err.invalidAttributes) {
        err.invalidAttributes = validator(Model, err.invalidAttributes);
        return res.negotiate(err);
      }
    }
    // if (err) return res.negotiate(err);

    // If we have the pubsub hook, use the model class's publish method
    // to notify all subscribers about the created item
    if (req._sails.hooks.pubsub) {
      if (req.isSocket) {
        Model.subscribe(req, newInstance);
        Model.introduce(newInstance);
      }
      Model.publishCreate(newInstance, !req.options.mirror && req);
    }

    // Send JSONP-friendly response if it's supported
    // (HTTP 201: Created)
    res.status(201);
    res.ok(newInstance.toJSON());
  });
};

```