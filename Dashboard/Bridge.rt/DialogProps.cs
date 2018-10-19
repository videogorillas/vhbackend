using System;
using Bridge;
using Bridge.Html5;

namespace Dashboard.Bridge.rt
{
    [External]
    public class DialogProps : Props
    {
        public Array actions;
        public bool active;
        public String className;
        public Function onEscKeyDown;
        public Function onOverlayClick;
        public Function onOverlayMouseDown;
        public Function onOverlayMouseMove;
        public Function onOverlayMouseUp;
        public String title;
        public String type;

        public DialogProps(String key) : base(key) 
        {
        }
    }
}