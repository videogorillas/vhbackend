using Bridge;
using Bridge.Html5;
using Bridge.React;

namespace Dashboard
{
    public class Program
    {
        public static string IS_CHROME = "isChrome";
        
        public static void Main()
        {
            HTMLElement container = AppContainer(null);
            LoginPageComponent.Props p = new LoginPageComponent.Props();
            ReactElement el = new LoginPageComponent(p);
            React.Render(el, container);

            
//            var appRoot = Document.GetElementById("app");
//            var userInterface = DOM.Div("hello world");
//            React.Render(userInterface, appRoot);
        }

        public static HTMLElement AppContainer(string elementId)
        {
            HTMLElement container = Document.CreateElement("div");
            if (elementId != null) {
                container.Id = elementId;
            }
            container.Style.Height = "100%";
            Document.Body.AppendChild(container);
            return container;
        }
    }
}