using Microsoft.EntityFrameworkCore;
using QuoteQuiz.Api.Data.Models;

namespace QuoteQuiz.Api.Data.Repositories
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(QuoteQuizDbContext context) : base(context)
        {
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.Email == email && !u.IsDeleted);
        }

        public async Task<IEnumerable<User>> GetActiveUsersAsync()
        {
            return await _dbSet.Where(u => !u.IsDeleted && u.IsActive).ToListAsync();
        }

        public async Task<(IEnumerable<User> Items, int Total)> GetUsersPagedAsync(string? searchText, int pageNumber, int pageSize, string sortBy = "CreatedAt", string sortDirection = "desc")
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1) pageSize = 10;

            var query = _dbSet.Where(u => !u.IsDeleted);

            if (!string.IsNullOrEmpty(searchText))
                query = query.Where(u => u.Username.Contains(searchText!) || u.Email.Contains(searchText!));

            var total = await query.CountAsync();

            query = ApplySorting(query, sortBy, sortDirection);

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, total);
        }

        public async Task SoftDeleteAsync(Guid id)
        {
            var user = await GetByIdAsync(id);
            if (user != null)
            {
                user.IsDeleted = true;
                user.DeletedAt = DateTime.UtcNow;
                await UpdateAsync(user);
            }
        }

        private IQueryable<User> ApplySorting(IQueryable<User> query, string sortBy, string sortDirection)
        {
            var isDescending = sortDirection?.ToLower() == "desc";

            return sortBy?.ToLower() switch
            {
                "username" => query =  isDescending ? query.OrderByDescending(u => u.Username) : query.OrderBy(u => u.Username),
                "email" => query = isDescending ? query.OrderByDescending(u => u.Email) : query.OrderBy(u => u.Email),
                "createdat" => query =  isDescending ? query.OrderByDescending(u => u.CreatedAt) : query.OrderBy(u => u.CreatedAt),
                "isactive" => query = isDescending ? query.OrderByDescending(u => u.IsActive) : query.OrderBy(u => u.IsActive),
                _ => query = query.OrderByDescending(u => u.CreatedAt) // Default sorting
            };
        }
    }
}
