using Bridge;
using Bridge.Html5;
using Bridge.React;
using Dashboard.Bridge.rt.addons;

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
            
            DialogWithImageProps p = new DialogWithImageProps("dwi");
            p.type = "small";
            p.active = true;
            p.background = "white";
            
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
        
        public ReactElement HeaderWhite(string key, string s) 
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

        public ReactElement LoginInput()
        {
            StyledInputProps props = new StyledInputProps("e");
            props.type = "email";
            props.value = state.l;
            props.label = "Email";
            props.onChange = new Function("s", "state.l = s; setState(state)");

            var reactElement = new StyledInput(props);
            return reactElement;
        }

        public ReactElement PasswdInput()
        {
            StyledInputProps props = new StyledInputProps("p");
            props.type = "password";
            props.label = "Password";
            props.value = state.p;
            props.onChange = new Function("s", "state.p = s; setState(state");
            var reactElement = new StyledInput(props);
            return reactElement;
        }

        public ReactElement DialogWithImage(ReactElementList childrens)
        {
            return null;
        }
    }
}