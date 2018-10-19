using System.Collections.Generic;
using Bridge;

namespace Dashboard.Bridge.rt
{
    [External]
    public class Props
    {
        public string className;
        public string id;
        public string key;
        public string _ref;
        public Dictionary<string, object> style;
        public string tooltip;
        public double tooltipDelay;
        public bool tooltipHideOnClick;

        public Props(string key)
        {
            this.key = key;
            this.id = key;
        }
    }
}