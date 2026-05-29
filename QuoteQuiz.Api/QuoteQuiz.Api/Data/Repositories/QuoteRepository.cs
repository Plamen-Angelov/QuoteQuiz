using Microsoft.EntityFrameworkCore;
using QuoteQuiz.Api.Data.Models;

namespace QuoteQuiz.Api.Data.Repositories
{
    public class QuoteRepository : Repository<Quote>, IQuoteRepository
    {
        public QuoteRepository(QuoteQuizDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Quote>> GetActiveQuotesAsync()
        {
            return await _dbSet.Where(q => !q.IsDeleted).ToListAsync();
        }

        public async Task<(IEnumerable<Quote> Items, int Total)> GetQuotesPagedAsync(string? searchText, int pageNumber, int pageSize, string sortBy = "CreatedAt", string sortDirection = "desc")
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1) pageSize = 10;

            var query = _dbSet.Where(q => !q.IsDeleted);

            if (!string.IsNullOrEmpty(searchText))
                query = query.Where(q => q.Author.Contains(searchText) || q.Text.Contains(searchText));

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
            var quote = await GetByIdAsync(id);
            if (quote != null)
            {
                quote.IsDeleted = true;
                quote.DeletedAt = DateTime.UtcNow;
                await UpdateAsync(quote);
            }
        }

        private IQueryable<Quote> ApplySorting(IQueryable<Quote> query, string sortBy, string sortDirection)
        {
            var isDescending = sortDirection?.ToLower() == "desc";

            return sortBy?.ToLower() switch
            {
                "author" => query =  isDescending ? query.OrderByDescending(q => q.Author) : query.OrderBy(q => q.Author),
                "text" => query = isDescending ? query.OrderByDescending(q => q.Text) : query.OrderBy(q => q.Text),
                "createdat" => query = isDescending ? query.OrderByDescending(q => q.CreatedAt) : query.OrderBy(q => q.CreatedAt),
                _ => query = query.OrderByDescending(q => q.CreatedAt) // Default sorting
            };
        }
    }
}
