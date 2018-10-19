using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    
    public class LoginRequest
    {
        [Required]
        public string id { get; set; }
        
        [Required]
        public string password { get; set; }
        
        public bool rememberMe { get; set; }
    }
    
    
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        [HttpGet]
        [Authorize]
        [Route("user")]
        public ActionResult<string> Get()
        {
            var claim = HttpContext.User.Claims.First(c => c.Type == "userId");
            return claim.Value.ToString();
        }
        
        [HttpGet]
        [Route("logout")]
        public async Task<ActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok();
        }

        [HttpPost]
        [Route("login")]
        public async Task<ActionResult> Post([FromBody] LoginRequest request)
        {
            if (request.id != "admin" || request.password != "admin") return BadRequest();
            
            var claims = new List<Claim>
            {
                new Claim("userId", "test")
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            var authProperties = new AuthenticationProperties
            {
                IsPersistent = request.rememberMe
            };
                
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, 
                new ClaimsPrincipal(claimsIdentity), 
                authProperties);

            return Ok();

        }
    }
}
