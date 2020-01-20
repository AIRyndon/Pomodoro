using Microsoft.EntityFrameworkCore;
using Pomodoro.Data;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Pomodoro.Repos.Interfaces
{
    public interface IBaseRepo<T> where T : class
    {
        //Considered bad to include a concrete Db class here, but I want to use the context for fewer calls to the database
        ApplicationDbContext Context { get;}
        Task Delete(T entity);
        Task AddAsync(T entity);
        Task<int> SaveChangesAsync();
        Task UpdateAsync(T entity);
        Task<T> GetByIdAsync(int id);
        Task<IEnumerable<T>> GetAllAsync();
        Task<IEnumerable<T>> GetFilteredAsync(Expression<Func<T, bool>> predicate);
    }
}
