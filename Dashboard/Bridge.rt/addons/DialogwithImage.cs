using Bridge;
using Bridge.React;

namespace Dashboard.Bridge.rt.addons
{
    [External]
    public class DialogwithImage : BaseComponent<DialogWithImageProps>
    {
        public DialogwithImage(DialogWithImageProps props, params Union<ReactElement, string>[] children) : base(props, children)
        {
        }
    }
}