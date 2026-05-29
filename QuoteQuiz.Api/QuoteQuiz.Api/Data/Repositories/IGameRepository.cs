using QuoteQuiz.Api.Data.Models;

namespace QuoteQuiz.Api.Data.Repositories
{
    public interface IGameRepository : IRepository<QuizGame>
    {
        Task<IEnumerable<QuizGame>> GetUserGamesWithDetailsAsync(Guid userId);
    }
}
