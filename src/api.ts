const api = `(function () {
  var requests = new Map();
  var ids = 0;
  var createRequest = function () {
    var resolve, reject;
    var promise = new Promise(function (_resolve, _reject) {
      resolve = _resolve;
      reject = _reject;
    });
    var id = ++ids;
    requests.set(id, { resolve: resolve, reject: reject });
    return { id: id, promise: promise };
  };
  process.on('message', function (data) {
    var request = requests.get(data.id);
    requests.delete(data.id);
    if (data.error) {
      request.reject(data.error);
    }
    else {
      request.resolve(data.result);
    }
  });
  var api = function (path) {
    return new Proxy({ path: path }, {
      get: function (target, prop) {
        if (prop === 'then') {
          var request = createRequest();
          process.send({ type: 'prop', path: path, id: request.id });
          return request.promise.then.bind(request.promise);
        }
        return api(path.concat(prop));
      },
      apply: function (target, that, args) {
        var request = createRequest();
        process.send({ type: 'call', path: path, args: args, id: request.id });
        return request.promise;
      }
    });
  };
  return api([]);
})()`

export function generateApi() {
  return api
}
