using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pomodoro.Models;
using Pomodoro.Repos.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Pomodoro.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TodoItemsController : ControllerBase
    {
        private readonly ITodoItemRepo todoItem;

        public TodoItemsController(ITodoItemRepo todoItem)
        {
            this.todoItem = todoItem;
        }

        // GET: api/TodoItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TodoItem>> GetTodoItem(int id)
        {
            var item = await todoItem.GetByIdAsync(id);

            if (item == null)
            {
                return NotFound();
            }

            return item;
        }

        // PUT: api/TodoItems/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTodoItem(int id, TodoItem item)
        {
            if (id != item.Id)
            {
                return BadRequest();
            }

            await todoItem.UpdateAsync(item);

            try
            {
                await todoItem.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (await todoItem.GetByIdAsync(id) == null)
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

        // POST: api/TodoItems
        [HttpPost]
        public async Task<ActionResult<TodoItem>> PostTodoItem(TodoItem item)
        {
            await todoItem.AddAsync(item);
            await todoItem.SaveChangesAsync();

            return CreatedAtAction("GetTodoItem", new { id = item.Id }, item);
        }

        // DELETE: api/TodoItems/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<TodoItem>> DeleteTodoItem(int id)
        {
            var item = await todoItem.GetByIdAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            await todoItem.Delete(item);
            await todoItem.SaveChangesAsync();

            return item;
        }
    }
}
