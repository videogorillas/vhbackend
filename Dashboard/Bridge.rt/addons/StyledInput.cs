using Bridge;
using Bridge.React;

namespace Dashboard.Bridge.rt.addons
{
    [External]
    public class StyledInput : BaseComponent<StyledInputProps>
    {
        public StyledInput(StyledInputProps props, params Union<ReactElement, string>[] children) : base(props, children)
        {
        }
    }
}