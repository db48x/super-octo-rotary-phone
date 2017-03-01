function node(name) {
  return function () {
           let self = document.createElement(name);
           Array.prototype.forEach.call(arguments,
                                        function (arg) {
                                          if (typeof(arg) == "string" || typeof(arg) == "number") {
                                            self.appendChild(new Text(arg));
                                          } else if (Array.isArray(arg)) {
                                            arg.forEach(function (elem) { elem && self.appendChild(elem); });
                                          } else if (arg instanceof Node) {
                                            self.appendChild(arg);
                                          } else if (typeof(arg) == "object") {
                                            Object.keys(arg)
                                                  .forEach(function (k) {
                                                             self.setAttribute(k, arg[k]);
                                                           });
                                          } else {
                                            console.warn("ignoring bad argument to node constructor: ", arg);
                                          }
                                        });
           return self;
         };
}

var span = node("span"),
    tbody = node("tbody"),
    tr = node("tr"),
    td = node("td");