using QuoteQuiz.Api.Data.Models;

namespace QuoteQuiz.Api.Data.Repositories
{
    public interface IQuoteRepository : IRepository<Quote>
    {
        Task<IEnumerable<Quote>> GetActiveQuotesAsync();
        Task<(IEnumerable<Quote> Items, int Total)> GetQuotesPagedAsync(string? searchText, int pageNumber, int pageSize, string sortBy = "CreatedAt", string sortDirection = "desc");
        Task SoftDeleteAsync(Guid id);
    }
}
