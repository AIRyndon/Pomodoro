using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pomodoro.Data;
using Pomodoro.Models;
using Pomodoro.Repos.Interfaces;

namespace Pomodoro.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class MainListController : ControllerBase
    {
        private readonly ITodoListRepo todoList;

        public MainListController(ITodoListRepo todoList)
        {
            this.todoList = todoList;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoList>>> GetMainList()
        {
            var list = await Task.Run(() => todoList.Context
            .TodoList.Where(l => l.MainList
            && l.AppUserId == User.FindFirstValue(ClaimTypes.NameIdentifier))
            .Include(l => l.TodoItems));

            return list.ToList();
        }
    }
}