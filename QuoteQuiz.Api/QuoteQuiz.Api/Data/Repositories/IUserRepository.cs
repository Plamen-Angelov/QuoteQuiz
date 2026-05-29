using QuoteQuiz.Api.Data.Models;

namespace QuoteQuiz.Api.Data.Repositories
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> GetByEmailAsync(string email);
        Task<IEnumerable<User>> GetActiveUsersAsync();
        Task<(IEnumerable<User> Items, int Total)> GetUsersPagedAsync(string? searchText, int pageNumber, int pageSize, string sortBy = "CreatedAt", string sortDirection = "desc");
        Task SoftDeleteAsync(Guid id);
    }
}

