var model = null,
    view = { table: document.getElementById("event_list"),
             events: {},
             update: function view_update(events) {
                       console.log(events);
                     }
           },
    controller = { refresh_button: document.getElementById("refresh_button"),
                   init: function controller_init() {
                           this.refresh_button.addEventListener("click", this.fetch.bind(this));
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
                                                   view.update(JSON.parse(this.responseText));
                                                 });
                            req.send();
                          }
                 };
controller.init();
