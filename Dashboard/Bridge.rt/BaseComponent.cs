using Bridge;
using Bridge.React;
using Retyped.Primitive;

namespace Dashboard.Bridge.rt
{
    [External]
    public abstract class BaseComponent<P> : Component<P, Null>
    {
        protected BaseComponent(P props, params Union<ReactElement, string>[] children) : base(props, children)
        {
        }
        
        public override ReactElement Render()
        {
            throw new System.NotImplementedException();
        }

    }
}