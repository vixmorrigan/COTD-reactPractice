// Generated by CoffeeScript 1.11.0
(function() {
  var XhrPollingReceiver, XhrStreamingReceiver, transport, utils,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  transport = require('./transport');

  utils = require('./utils');

  XhrStreamingReceiver = (function(superClass) {
    extend(XhrStreamingReceiver, superClass);

    function XhrStreamingReceiver() {
      return XhrStreamingReceiver.__super__.constructor.apply(this, arguments);
    }

    XhrStreamingReceiver.prototype.protocol = "xhr-streaming";

    XhrStreamingReceiver.prototype.doSendFrame = function(payload) {
      return XhrStreamingReceiver.__super__.doSendFrame.call(this, payload + '\n');
    };

    return XhrStreamingReceiver;

  })(transport.ResponseReceiver);

  XhrPollingReceiver = (function(superClass) {
    extend(XhrPollingReceiver, superClass);

    function XhrPollingReceiver() {
      return XhrPollingReceiver.__super__.constructor.apply(this, arguments);
    }

    XhrPollingReceiver.prototype.protocol = "xhr-polling";

    XhrPollingReceiver.prototype.max_response_size = 1;

    return XhrPollingReceiver;

  })(XhrStreamingReceiver);

  exports.app = {
    xhr_options: function(req, res) {
      res.statusCode = 204;
      res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
      res.setHeader('Access-Control-Max-Age', res.cache_for);
      return '';
    },
    xhr_send: function(req, res, data) {
      var d, i, jsonp, len, message, x;
      if (!data) {
        throw {
          status: 500,
          message: 'Payload expected.'
        };
      }
      try {
        d = JSON.parse(data);
      } catch (error) {
        x = error;
        throw {
          status: 500,
          message: 'Broken JSON encoding.'
        };
      }
      if (!d || d.__proto__.constructor !== Array) {
        throw {
          status: 500,
          message: 'Payload expected.'
        };
      }
      jsonp = transport.Session.bySessionId(req.session);
      if (!jsonp) {
        throw {
          status: 404
        };
      }
      for (i = 0, len = d.length; i < len; i++) {
        message = d[i];
        jsonp.didMessage(message);
      }
      res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
      res.writeHead(204);
      res.end();
      return true;
    },
    xhr_cors: function(req, res, content) {
      var headers, origin;
      if (!req.headers['origin']) {
        origin = '*';
      } else {
        origin = req.headers['origin'];
        res.setHeader('Access-Control-Allow-Credentials', 'true');
      }
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
      headers = req.headers['access-control-request-headers'];
      if (headers) {
        res.setHeader('Access-Control-Allow-Headers', headers);
      }
      return content;
    },
    xhr_poll: function(req, res, _, next_filter) {
      res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
      res.writeHead(200);
      transport.register(req, this, new XhrPollingReceiver(req, res, this.options));
      return true;
    },
    xhr_streaming: function(req, res, _, next_filter) {
      res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
      res.writeHead(200);
      res.write(Array(2049).join('h') + '\n');
      transport.register(req, this, new XhrStreamingReceiver(req, res, this.options));
      return true;
    }
  };

}).call(this);