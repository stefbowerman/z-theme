/**
 * AJAX Chimp
 * -----------------------------------------------------------------------------
 * Heavily modified version of the original jQuery plugin - https://github.com/scdoshi/jquery-ajaxchimp
 * Handles AJAX form submission and provides hooks for lifecycle events.
 *
 * @namespace ajaxChimp
 */


slate.AjaxChimp = (function($) {

  function AjaxChimp(form, options) {

    this.name = 'ajaxChimp'
    this.namespace = '.' + this.name;
    this.events = {
      SUBMIT: 'submit' + this.namespace
    };

    var _this = this;
    var defaults = {
      onInit: $.noop,
      onDestroy: $.noop,
      onBeforeSend: $.noop,
      onSubmitDone: $.noop,
      onSubmitFail: $.noop
    };

    if (form.length === 0) {
      return false;
    }

    this.$form    = form instanceof jQuery ? form : $(form);
    this.$input   = this.$form.find('input[type="email"]');
    this.$submit  = this.$form.find('[type="submit"]');
    this.settings = $.extend({}, defaults, options);

    this.$form.on(this.events.SUBMIT, this.onFormSubmit.bind(_this));

    this.settings.onInit();

    return this;
  };

  AjaxChimp.prototype = $.extend({}, AjaxChimp.prototype, {
    regexes: {
      error: {
        1: /Please enter a value/,
        2: /An email address must contain a single @/,
        3: /The domain portion of the email address is invalid \(the portion after the @: (.+)\)/,
        4: /The username portion of the email address is invalid \(the portion before the @: (.+)\)/,
        5: /This email address looks fake or invalid. Please enter a real email address/,
        6: /.+\#6592.+/,
        7: /(.+@.+) is already subscribed to list (.+)\..+<a href.+/
      }
    },
    responses: {
      success: 'Thank you for subscribing!',
      error: {
        1: 'Please enter an email address',
        2: 'There was a problem with your entry. Please check the address and try again.',
        3: 'There was a problem with your entry. Please check the address and try again.',
        4: 'There was a problem with your entry. Please check the address and try again.',
        5: 'There was a problem with your entry. Please check the address and try again.',
        6: 'Too many subscribe attempts for this email address. Please try again in about 5 minutes.',
        7: 'You\'re already subscribed. Thank you!'
      }
    },
    getRegexMatch: function(string, stringKey) {
      var regexPatterns = this.regexes[stringKey];
      var matchedId;
      $.each(regexPatterns, function(id, regexPattern) {
        if (string.match(regexPattern) !== null) {
          matchedId = id;
          return false;
        }
      });
      return matchedId;
    },
    getMessageForResponse: function(response) {
      var msg;
      if (response.result === 'success') {
        msg = this.responses.success;
      } else {
        var index = -1;
        try {
          var parts = response.msg.split(' - ', 2);
          if (parts[1] === undefined) {
            msg = response.msg;
          } else {
            msg = parts[1];
          }
        } catch (e) {
          msg = response.msg;
        }

        // Now that we have the relevant part of the message, lets get the actual string for it
        var regexPattern = this.regexes.error;
        var matchedId = this.getRegexMatch(msg, 'error');
        if (matchedId && regexPattern[matchedId] && this.responses.error[matchedId]) {
          return msg.replace(regexPattern[matchedId], this.responses.error[matchedId]);
        }
      }

      return msg;
    },
    destroy: function() {
      this.$form.off(this.events.SUBMIT);
      this.settings.onDestroy();
    },
    onBeforeSend: function() {
      this.settings.onBeforeSend();
      if (this.$input.val() && this.$input.val().length) {
        this.$submit.prop('disabled', true);
        return true;
      } else {
        this.$input.parents('.form-group').addClass('alert-info');
      }
      return false;
    },
    onSubmitDone: function(response) {
      var success = response.result === 'success';
      var rspMsg = this.getMessageForResponse(response);

      this.$submit.prop('disabled', false);
      this.settings.onSubmitDone(success, rspMsg);
    },
    onSubmitFail: function() {
      this.settings.onSubmitFail();
    },
    onFormSubmit: function(e) {
      e.preventDefault();
      var _this = this;
      var $form = this.$form;
      var data = {};
      var dataArray = $form.serializeArray();

      // See - https://github.com/scdoshi/jquery-ajaxchimp/blob/master/jquery.ajaxchimp.js
      $.each(dataArray, function(index, item) {
        data[item.name] = item.value;
      });

      $.ajax({
          url: $form.attr('action').replace('/post?', '/post-json?').concat('&c=?'),
          dataType: 'jsonp',
          data: data,
          beforeSend: _this.onBeforeSend.bind(_this)
        })
        .done(function(response) {
          _this.onSubmitDone(response);
        })
        .fail(function(response) {
          _this.onSubmitFail();
        });

      return false;
    }
  });

  return AjaxChimp;
})(jQuery)