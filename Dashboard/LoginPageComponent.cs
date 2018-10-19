using System.Collections.Generic;
using Bridge;
using Bridge.Html5;
using Bridge.React;

namespace Dashboard
{
    public class LoginPageComponent : Component<LoginPageComponent.Props, LoginPageComponent.State>
    {
        public class State
        {
            public string l;
            public string p;
        }

        public class Props
        {
            public string email;
        }

        public LoginPageComponent(Props props, params Union<ReactElement, string>[] children) : base(props, children)
        {
        }

        public override ReactElement Render()
        {
            ReactElement header = HeaderWhite("ps", "Log In");
            ReactElement emailInput = LoginInput();
            ReactElement passwordInput = PasswdInput();

            ReactElementList childrens = ReactElementList.Empty;
            childrens.Add(emailInput);
            childrens.Add(passwordInput);
            
            ReactElement dialog = DialogWithImage(childrens);
            
            return DOM.Div(
                new Attributes
                {
                    Style = new ReactStyle
                    {
                        Position = Position.Relative,
                        Width = "100%",
                        Height = "100%"
                    }
                }, dialog
            );
        }
        
        public static ReactElement HeaderWhite(string key, string s) 
        {
            return DOM.H2(
                new Attributes
                {
                    Style = new ReactStyle
                    {
                        Color = "white",
                        Padding = "40px 0px 45px 0px"
                    }
                }
            );
        }

        public static ReactElement LoginInput()
        {
            return null;
        }

        public static ReactElement PasswdInput()
        {
            return null;
        }

        public static ReactElement DialogWithImage(ReactElementList childrens)
        {
            return null;
        }
    }
}