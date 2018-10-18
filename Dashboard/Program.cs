using Bridge.Html5;
using Bridge.React;

namespace Dashboard
{
    public class Program
    {
        static ReactElement View(string name)
        {
            // create a virtual div element
            return DOM.Div($"Hello {name}");
        }


        public static void Main()
        {
            // get the element that mounts the app
            var appRoot = Document.GetElementById("app"); 
            // create the user interface
            var userInterface = View("Mike");
            // attach the user interface to the root node
            React.Render(userInterface, appRoot);
        }
    }
}