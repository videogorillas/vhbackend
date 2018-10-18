/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2018
 * @compiler Bridge.NET 17.4.0
 */
Bridge.assembly("Dashboard", function ($asm, globals) {
    "use strict";

    Bridge.define("Dashboard.Program", {
        main: function Main () {
            var appRoot = document.getElementById("app");
            var userInterface = React.createElement('div', null, "hello world");
            ReactDOM.render(userInterface, appRoot);
        }
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJEYXNoYm9hcmQuanMiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbIlByb2dyYW0uY3MiXSwKICAibmFtZXMiOiBbIiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7WUFVWUEsY0FBY0E7WUFDZEEsb0JBQW9CQTtZQUNwQkEsZ0JBQWFBLGVBQWVBIiwKICAic291cmNlc0NvbnRlbnQiOiBbInVzaW5nIEJyaWRnZS5IdG1sNTtcbnVzaW5nIEJyaWRnZS5SZWFjdDtcbnVzaW5nIEJyaWRnZS5VdGlscztcblxubmFtZXNwYWNlIERhc2hib2FyZFxue1xuICAgIHB1YmxpYyBjbGFzcyBQcm9ncmFtXG4gICAge1xuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgTWFpbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBhcHBSb290ID0gRG9jdW1lbnQuR2V0RWxlbWVudEJ5SWQoXCJhcHBcIik7XG4gICAgICAgICAgICB2YXIgdXNlckludGVyZmFjZSA9IERPTS5EaXYoXCJoZWxsbyB3b3JsZFwiKTtcbiAgICAgICAgICAgIFJlYWN0LlJlbmRlcih1c2VySW50ZXJmYWNlLCBhcHBSb290KTtcbiAgICAgICAgfVxuICAgIH1cbn0iXQp9Cg==
