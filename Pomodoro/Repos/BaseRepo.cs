using Microsoft.EntityFrameworkCore;
using Pomodoro.Data;
using Pomodoro.Repos.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Pomodoro.Repos
{
    public class BaseRepo<T> : IBaseRepo<T> where T : class
    {
        private DbSet<T> Entity { get; }
        public ApplicationDbContext Context { get; }

        public BaseRepo(ApplicationDbContext db)
        {
            Context = db;
            Entity = db.Set<T>();
        }

        public async Task<IEnumerable<T>> GetFilteredAsync(Expression<Func<T, bool>> predicate)
        {
            return await Entity.Where(predicate).ToListAsync();
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await Entity.ToListAsync();
        }

        public async Task<T> GetByIdAsync(int id)
        {
            return await Entity.FindAsync(id);
        }

        public async Task<int> SaveChangesAsync()
        {
            return await Context.SaveChangesAsync();
        }

        public async Task UpdateAsync(T entity)
        {
            await Task.Run(() =>
            {
                Entity.Attach(entity).State = EntityState.Modified;
            });
        }

        public async Task AddAsync(T entity)
        {
            await Entity.AddAsync(entity);
        }

        public async Task Delete(T entity)
        {
            await Task.Run(() =>
            {
                Entity.Remove(entity);
            });
        }
    }
}
