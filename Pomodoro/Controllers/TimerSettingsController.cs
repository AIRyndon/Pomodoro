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
    [Route("api/[controller]")]
    [ApiController]
    public class TimerSettingsController : ControllerBase
    {
        private readonly ITimerSettingRepo timerSetting;
        private readonly string userId;

        public TimerSettingsController(ITimerSettingRepo timerSetting, IHttpContextAccessor http)
        {
            this.timerSetting = timerSetting;
            userId = http.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        }

        // GET: api/TimerSettings
        [HttpGet]
        public async Task<ActionResult<List<TimerSetting>>> GetTimerSetting()
        {
            var settings = await timerSetting.GetFilteredAsync(t => t.AppUserId == userId);
            return settings.ToList();
        }

        // GET: api/TimerSettings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TimerSetting>> GetTimerSetting(int id)
        {
            var timerSetting = await this.timerSetting.GetByIdAsync(id);

            if (timerSetting == null)
            {
                return NotFound();
            }

            return timerSetting;
        }

        // PUT: api/TimerSettings/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTimerSetting(int id, TimerSetting item)
        {
            if (id != item.Id)
            {
                return BadRequest();
            }

            item.AppUserId = userId;
            await timerSetting.UpdateAsync(item);

            try
            {
                await timerSetting.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (await timerSetting.GetByIdAsync(id) == null)
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

        // POST: api/TimerSettings
        [HttpPost]
        public async Task<ActionResult<TimerSetting>> PostTimerSetting(TimerSetting item)
        {
            item.AppUserId = userId;
            await timerSetting.AddAsync(item);
            await timerSetting.SaveChangesAsync();

            return CreatedAtAction("GetTimerSetting", new { id = item.Id }, item);
        }

        // DELETE: api/TimerSettings/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<TimerSetting>> DeleteTimerSetting(int id)
        {
            var item = await timerSetting.GetByIdAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            await timerSetting.Delete(item);
            await timerSetting.SaveChangesAsync();

            return item;
        }
    }
}
