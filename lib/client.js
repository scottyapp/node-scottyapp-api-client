(function() {
  var qs, xhr;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  xhr = require('request');
  qs = require('querystring');
  /**
  The client class used to connect with scottyapp.com
  */
  exports.Client = (function() {
    /**
    The base url of the web service. Exposed for testing against local install.
    */    Client.prototype.baseUrl = "https://api.scottyapp.com";
    Client.prototype.versionPath = "/v1";
    Client.prototype.accessToken = null;
    /**
    Initializes a new instance of @see Client
    @param (String) key the api key obtained from scottyapp.com/developers
    @param (String) secret the api secret
    @param (String) scope defaults to "read write".
    */
    function Client(key, secret, scope) {
      this.key = key;
      this.secret = secret;
      this.scope = scope != null ? scope : "read write";
      this._request = __bind(this._request, this);
      this._delete = __bind(this._delete, this);
      this._put = __bind(this._put, this);
      this._post = __bind(this._post, this);
      this._postAsForm = __bind(this._postAsForm, this);
      this._get = __bind(this._get, this);
      this.info = __bind(this.info, this);
      this.deleteApp = __bind(this.deleteApp, this);
      this.updateApp = __bind(this.updateApp, this);
      this.app = __bind(this.app, this);
      this.createApp = __bind(this.createApp, this);
      this.appsForOrganization = __bind(this.appsForOrganization, this);
      this.deleteOrganization = __bind(this.deleteOrganization, this);
      this.createOrganization = __bind(this.createOrganization, this);
      this.updateOrganization = __bind(this.updateOrganization, this);
      this.organization = __bind(this.organization, this);
      this.organizations = __bind(this.organizations, this);
      this.organizationsForUser = __bind(this.organizationsForUser, this);
      this.updateUser = __bind(this.updateUser, this);
      this.createUser = __bind(this.createUser, this);
      this.updateMe = __bind(this.updateMe, this);
      this.me = __bind(this.me, this);
      this.authenticate = __bind(this.authenticate, this);
      this.setAccessToken = __bind(this.setAccessToken, this);
      if (!(this.key && this.secret)) {
        throw new Error("You need to pass a key and secret");
      }
    }
    Client.prototype.setAccessToken = function(accessToken) {
      return this.accessToken = accessToken;
    };
    /**
    Authenticates against the API using username and password. 
    This is not a recommended way that only makes sense in 
    scenarios like command line utilities. 
    @example
    curl -i https://api.scottyapp.com/oauth/access_token \
      -F grant_type=password \
      -F client_id=key \
      -F client_secret=secret \
      -F "scope=read write" \
      -F username=username \
      -F password=password
    =>
    {"access_token":"b34190d7302a42eb96292c84d175a5a6","scope": "read write"}
    */
    Client.prototype.authenticate = function(username, password, cb) {
      var data, url;
      data = {};
      data.grant_type = 'password';
      data.client_id = this.key;
      data.client_secret = this.secret;
      data.scope = this.scope;
      data.username = username;
      data.password = password;
      url = "" + this.baseUrl + "/oauth/access_token";
      return this._postAsForm(url, data, __bind(function(err, payload, request, body) {
        this.accessToken = null;
        if (err) {
          return cb(err, null, request, body);
        }
        this.accessToken = payload['access_token'];
        return cb(err, payload, request, body);
      }, this));
    };
    Client.prototype.me = function(cb) {
      var url;
      url = "" + this.baseUrl + this.versionPath + "/me";
      return this._get(url, cb);
    };
    Client.prototype.updateMe = function(data, cb) {
      var url;
      url = "" + this.baseUrl + this.versionPath + "/me";
      return this._put(url, data, cb);
    };
    Client.prototype.createUser = function(username, password, email, cb) {
      var data, url;
      data = {
        username: username,
        password: password,
        email: email
      };
      url = "" + this.baseUrl + this.versionPath + "/users";
      return this._post(url, data, cb);
    };
    Client.prototype.updateUser = function(username, data, cb) {
      var url;
      if (data == null) {
        data = {};
      }
      url = "" + this.baseUrl + this.versionPath + "/users/" + username;
      return this._put(url, data, cb);
    };
    Client.prototype.organizationsForUser = function(username, cb) {
      var url;
      url = "" + this.baseUrl + this.versionPath + "/users/" + username + "/organizations";
      return this._get(url, cb);
    };
    Client.prototype.organizations = function(cb) {
      var url;
      url = "" + this.baseUrl + this.versionPath + "/organizations";
      return this._get(url, cb);
    };
    Client.prototype.organization = function(name, cb) {
      var url;
      url = "" + this.baseUrl + this.versionPath + "/organizations/" + name;
      return this._get(url, cb);
    };
    Client.prototype.updateOrganization = function(name, data, cb) {
      var url;
      if (data == null) {
        data = {};
      }
      url = "" + this.baseUrl + this.versionPath + "/organizations/" + name;
      return this._put(url, data, cb);
    };
    Client.prototype.createOrganization = function(name, data, cb) {
      var url;
      if (data == null) {
        data = {};
      }
      url = "" + this.baseUrl + this.versionPath + "/organizations";
      if (name) {
        data.name = name;
      }
      return this._post(url, data, cb);
    };
    Client.prototype.deleteOrganization = function(name, cb) {
      var url;
      url = "" + this.baseUrl + this.versionPath + "/organizations/" + name;
      return this._delete(url, cb);
    };
    /**
    Retrieve the apps for an organization (a user is always it's own organization)
    @example
    curl http://192.168.1.101:3000/v1/organizations/username/apps
    =>
    {"total_count":4,"request_id":"","offset":0,"count":30,"collection":[{"_id":"4e2e746fc2db19107c000006","description":"first project 1","name":"test","slug":"test"},{"_id":"4e3bb63ac2db194f2b000002","description":"Martins test project","name":"test 1","slug":"test-1"},{"_id":"4e3bd46cc2db194f2b00000a","description":"test3","name":"test3","slug":"test3"},{"_id":"4e3cf2edc2db1953c2000002","description":"test4","name":"test4","slug":"test4"}]}
    */
    Client.prototype.appsForOrganization = function(organizationName, cb) {
      var url;
      url = "" + this.baseUrl + this.versionPath + "/organizations/" + organizationName + "/apps";
      return this._get(url, cb);
    };
    /**
    #curl http://192.168.1.101:3000/v1/organizations/martin_sunset/apps -X POST  -H "Authorization: OAuth 22041c80355ec10b82d8aebcd2f8debd0b77b6ff54567fd4e285a722b1ef1e7a" \
    #-F name=testapp \
    #-F description=blah
    curl http://192.168.1.101:3000/v1/organizations/martin_sunset/apps -X POST  -H "Authorization: OAuth 22041c80355ec10b82d8aebcd2f8debd0b77b6ff54567fd4e285a722b1ef1e7a" \
    -d '{"name":"anew app","description": "blah"}' 
    =>
    
    */
    Client.prototype.createApp = function(organizationOrUsername, name, description, isPrivate, cb) {
      var url;
      if (isPrivate == null) {
        isPrivate = false;
      }
      url = "" + this.baseUrl + this.versionPath + "/organizations/" + organizationOrUsername + "/apps";
      return this._post(url, {
        name: name,
        description: description,
        isPrivate: isPrivate
      }, cb);
    };
    Client.prototype.app = function(organizationName, appName, cb) {
      var url;
      url = "" + this.baseUrl + this.versionPath + "/organizations/" + organizationName + "/apps/" + appName;
      return this._get(url, cb);
    };
    Client.prototype.updateApp = function(organizationName, appName, data, cb) {
      var url;
      if (data == null) {
        data = {};
      }
      url = "" + this.baseUrl + this.versionPath + "/organizations/" + organizationName + "/apps/" + appName;
      return this._put(url, data, cb);
    };
    Client.prototype.deleteApp = function(organizationName, appName, cb) {
      var url;
      url = "" + this.baseUrl + this.versionPath + "/organizations/" + organizationName + "/apps/" + appName;
      return this._delete(url, cb);
    };
    /**
    Returns infos about the API. 
    @example
    curl https://api.scottyapp.com/v1/info
    =>
    {"name":"scottyapp","canonicalUrl" : "https://api.scottyapp.com/v1","version" : 1}
    */
    Client.prototype.info = function(cb) {
      var url;
      url = "" + this.baseUrl + this.versionPath + "/info";
      return this._get(url, cb);
    };
    Client.prototype._get = function(url, fn) {
      if (fn == null) {
        fn = function() {};
      }
      return this._request(url, "GET", null, null, fn);
    };
    Client.prototype._postAsForm = function(url, payload, fn) {
      if (fn == null) {
        fn = function() {};
      }
      return this._request(url, "POST", payload, {
        postAsForm: true
      }, fn);
    };
    Client.prototype._post = function(url, payload, fn) {
      if (fn == null) {
        fn = function() {};
      }
      return this._request(url, "POST", payload, null, fn);
    };
    Client.prototype._put = function(url, payload, fn) {
      if (fn == null) {
        fn = function() {};
      }
      return this._request(url, "PUT", payload, null, fn);
    };
    Client.prototype._delete = function(url, fn) {
      if (fn == null) {
        fn = function() {};
      }
      return this._request(url, "DELETE", null, null, fn);
    };
    Client.prototype._request = function(url, method, payload, options, fn) {
      var body, headers, postAsForm;
      if (method == null) {
        method = "GET";
      }
      if (fn == null) {
        fn = function() {};
      }
      headers = {};
      if (this.accessToken) {
        headers['Authorization'] = "OAuth " + this.accessToken;
      }
      if (!options) {
        options = {};
      }
      postAsForm = !!options.postAsForm;
      body = null;
      if (payload && postAsForm) {
        body = qs.stringify(payload);
      }
      if (payload && !postAsForm) {
        body = JSON.stringify(payload);
      }
      if (postAsForm) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
      } else {
        headers['Content-Type'] = 'application/json';
      }
      return xhr({
        url: url,
        method: method,
        body: body,
        headers: headers
      }, function(error, response, body) {
        if (error) {
          return fn(error, null, response, body);
        }
        if (response.statusCode < 200 || response.statusCode >= 300) {
          return fn(new Error("Received error code " + response.statusCode), null, response, body);
        }
        return fn(null, JSON.parse(body), response, body);
      });
    };
    return Client;
  })();
}).call(this);
