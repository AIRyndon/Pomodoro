using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pomodoro.Models;
using Pomodoro.Repos.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Pomodoro.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TodoListsController : ControllerBase
    {
        private readonly ITodoListRepo todoList;
        private readonly string userId;

        public TodoListsController(ITodoListRepo todoList, IHttpContextAccessor http)
        {
            this.todoList = todoList;
            userId = http.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        }

        // GET: api/TodoLists
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoList>>> GetAllTodoLists()
        {
            //Use the context so we can include the Todo items with the lists in one database call
            var todos = await Task.Run(() => todoList.Context.TodoList.Where((l) =>
                        l.AppUserId == userId)
                        .Include(l => l.TodoItems));

            return todos.ToList();
        }

        // GET: api/TodoLists/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TodoList>> GetTodoList(int id)
        {
            var item = await todoList.GetByIdAsync(id);

            if (item == null)
            {
                return NotFound();
            }

            return item;
        }

        // PUT: api/TodoLists/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTodoList(int id, TodoList item)
        {
            if (id != item.Id)
            {
                return BadRequest();
            }

            item.AppUserId = userId;
            await todoList.UpdateAsync(item);

            try
            {
                await todoList.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (await todoList.GetByIdAsync(id) == null)
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/TodoLists
        [HttpPost]
        public async Task<ActionResult<TodoList>> PostTodoList(TodoList item)
        {
            item.AppUserId = userId;
            await todoList.AddAsync(item);
            await todoList.SaveChangesAsync();

            return CreatedAtAction("GetTodoList", new { id = item.Id }, item);
        }

        // DELETE: api/TodoLists/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<TodoList>> DeleteTodoList(int id)
        {
            var item = await todoList.GetByIdAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            await todoList.Delete(item);
            await todoList.SaveChangesAsync();

            return item;
        }
    }
}
