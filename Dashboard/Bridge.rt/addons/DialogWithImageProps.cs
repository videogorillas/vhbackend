using Bridge;

namespace Dashboard.Bridge.rt.addons
{
    [External]
    public class DialogWithImageProps : DialogProps
    {
        public DialogWithImageProps(string key) : base(key)
        {
        }

        /**
         * Sets color for background rectangle.
         */
        public string background;

        /**
         * Path to image capture.
         */
        public string imageCapture;
    }
}