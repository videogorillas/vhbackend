using Bridge;
using Bridge.Html5;
using Bridge.React;

namespace Dashboard.Bridge.rt
{
    [External]
    public class InputProps : Props
    {
        public string hint;
        public string name;
        public string error;
        public bool floating;
        public string label;
        public double maxLength;
        public bool multiline;

        public Function onBlur;
        public Function onFocus;
        public Function onKeyDown;
        public Function onKeyPress;
        public Function onKeyUp;
        public Function onInput;
        public bool required;
        public string type;
        public string value;
        public bool disabled;
        public object icon;
        public Function onChange;
        public string placeholder;

        public InputProps(string key) : base(key)
        {
        }
    }
}