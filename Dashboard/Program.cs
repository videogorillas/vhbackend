using Bridge.Html5;
using Bridge.React;
using Bridge.Utils;

namespace Dashboard
{
    public class Program
    {
        public static void Main()
        {
            var appRoot = Document.GetElementById("app");
            var userInterface = DOM.Div("hello world");
            React.Render(userInterface, appRoot);
        }
    }
}