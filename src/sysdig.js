// This is the simplest possible version of MVC. The parts aren't
// composable, so you can't combine or reuse them, but it should be
// sufficient for the current purpose.
var model = { events: {},
              update: function model_update(response) {
                        let self = this;
                        response.events.forEach(function (e) {
                                                  self.events[e.id] = e;
                                                });
                      }
            },
    view = { table: document.getElementById("event_list"),
             events: {},
             update: function view_update(response) {
                       let self = this,
                           body = tbody(Object.keys(model.events)
                                              .map(function (id) {
                                                     let ev = model.events[id];
                                                     // BUG: api docs don't specify a timezone, so I will punt
                                                     return tr(td(new Date(parseInt(ev.timestamp, 10) * 1000).toString()),
                                                               td(ev.severity),
                                                               td(ev.name),
                                                               td(Object.keys(ev.tags)
                                                                        .map(function (name) {
                                                                               return span({'class': "tag"},
                                                                                           span({'class': "tag_name"}, name),
                                                                                           ": ",
                                                                                           span({'class': "tag_value"}, ev.tags[name]));
                                                                             })),
                                                               td(ev.description));
                                                   }));
                       Array.prototype.slice.call(self.table.tBodies, 0)
                            .forEach(function (n) {
                                       self.table.removeChild(n);
                                     });
                       self.table.appendChild(body);
                     }
           },
    controller = { refresh_button: document.getElementById("refresh_button"),
                   timer: null,
                   init: function controller_init() {
                           let self = this;
                           this.refresh_button.addEventListener("click",
                                                                function () {
                                                                  self.timer.reset();
                                                                  self.fetch();
                                                                });
                           this.timer = RepeatingQuickTimer(this.fetch.bind(this), 30*QuickTimer.ONE_SECOND),
                           this.fetch();
                         },
                   fetch: function controller_fetch() {
                            let req = new XMLHttpRequest();
                            req.open("GET",
                                     "https://app-staging.sysdigcloud.com/api/events",
                                     true);
                            req.setRequestHeader("Authorization", "Bearer 8aef9517-3070-4090-b55e-83296cee8cd1");
                            req.setRequestHeader("Accept", "application/json");
                            req.addEventListener("load",
                                                 function () {
                                                   model.update(JSON.parse(this.responseText));
                                                   view.update();
                                                 });
                            req.send();
                          }
                 };
controller.init();
