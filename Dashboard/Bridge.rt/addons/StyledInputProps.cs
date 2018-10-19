using Bridge;

namespace Dashboard.Bridge.rt.addons
{
    [External]
    public class StyledInputProps : InputProps
    {
        public StyledInputProps(string key) : base(key)
        {
        }

        /**
         * Children to pass through the component.
         */
        public object children;

        /**
         * Additional class(es) for custom styling.
         */
        public string className;

        /**
         * sets text size to large
         */
        public bool large;

        /**
         * sets text color to white
         */
        public bool white;

        /**
         * sets input icon position to the right
         */
        public bool rightIcon;

        /**
         * @param rightIcon the rightIcon to set
         * @return 
         */
        public StyledInputProps setRightIcon(bool rightIcon)
        {
            this.rightIcon = rightIcon;
            return this;
        }

        public string placeholder;
        public bool autoFocus;
    }
}