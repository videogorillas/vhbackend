using Bridge;
using Bridge.React;

namespace Dashboard.Bridge.rt
{
    [External]
    public class Dialog : BaseComponent<DialogProps>
    {
        public Dialog(DialogProps props, params Union<ReactElement, string>[] children) : base(props, children)
        {
        }
    }
}