using Microsoft.EntityFrameworkCore;
using QuoteQuiz.Api.Data.Models;

namespace QuoteQuiz.Api.Data.Repositories
{
    public class GameRepository : Repository<QuizGame>, IGameRepository
    {
        public GameRepository(QuoteQuizDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<QuizGame>> GetUserGamesWithDetailsAsync(Guid userId)
        {
            return await _context.QuizGames
                .Where(g => g.UserId == userId && g.EndedAt.HasValue)
                .Include(g => g.QuizAnswers)
                    .ThenInclude(a => a.Quote)
                .OrderByDescending(g => g.StartedAt)
                .ToListAsync();
        }
    }
}
