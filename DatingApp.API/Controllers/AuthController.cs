using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System;
using System.IdentityModel.Tokens.Jwt;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repos;
        private readonly IConfiguration _config;
        public AuthController(IAuthRepository repos, IConfiguration config)
        {
            _config = config;
            _repos = repos;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userForRegister)
        {
            //if(!ModelState.IsValid)
            //return BadRequest(ModelState);
            userForRegister.username = userForRegister.username.ToLower();

            if (await _repos.UserExists(userForRegister.username))
                return BadRequest("User already Exists");

            var userToCreate = new User
            {
                Username = userForRegister.username
            };

            var Createduser = await _repos.Register(userToCreate, userForRegister.password);
            return StatusCode(201);
        }


        [HttpPost("Login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {           
            var userFormRepo = await _repos.Login(userForLoginDto.Username.ToLower(), userForLoginDto.Password);

            if (userFormRepo == null)
                return Unauthorized();

            var clamis = new[]
            {
               new Claim(ClaimTypes.NameIdentifier,userFormRepo.Id.ToString()),
               new Claim(ClaimTypes.Name,userFormRepo.Username)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8
                .GetBytes(_config.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(clamis),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return Ok(new
            {
                token = tokenHandler.WriteToken(token)
            });
        }
    }
}