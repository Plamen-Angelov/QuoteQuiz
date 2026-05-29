using QuoteQuiz.Api.Data.Models;
using QuoteQuiz.Api.Data.Repositories;
using QuoteQuiz.Api.DTOs;

namespace QuoteQuiz.Api.Services
{
    public class GameService : IGameService
    {
        private readonly IQuoteRepository _quoteRepository;
        private readonly IUserRepository _userRepository;
        private readonly IRepository<QuizGame> _gameRepository;
        private readonly IRepository<QuizAnswer> _answerRepository;

        public GameService(
            IQuoteRepository quoteRepository,

            IUserRepository userRepository,
            IRepository<QuizGame> gameRepository,
            IRepository<QuizAnswer> answerRepository)
        {
            _quoteRepository = quoteRepository;
            _userRepository = userRepository;
            _gameRepository = gameRepository;
            _answerRepository = answerRepository;
        }

        public async Task<QuestionDto> GetRandomQuoteAsync()
        {
            var quotes = await _quoteRepository.GetActiveQuotesAsync();
            if (!quotes.Any())
                throw new InvalidOperationException("No quotes available.");

            var random = new Random();
            var randomQuote = quotes.OrderBy(_ => random.Next()).First();

            // Get 2 other random authors for wrong answers
            var otherAuthors = quotes
                .Where(q => q.Author != randomQuote.Author)
                .Select(q => q.Author)
                .Distinct()
                .OrderBy(_ => random.Next())
                .Take(2)
                .ToList();

            otherAuthors.Add(randomQuote.Author);
            otherAuthors = otherAuthors.OrderBy(_ => random.Next()).ToList();

            return new QuestionDto
            {
                Id = randomQuote.Id,
                Text = randomQuote.Text,
                Author = randomQuote.Author,
                Answers = string.Join(",", otherAuthors),
                CorrectAnswer = randomQuote.Author
            };
        }

        public async Task<SaveGameResponseDto> SaveGameAsync(SaveGameDto saveGameDto)
        {
            // Verify user exists
            var user = await _userRepository.GetByIdAsync(saveGameDto.UserId);
            if (user == null || user.IsDeleted)
                throw new InvalidOperationException("User not found.");

            // Create game session
            var game = new QuizGame
            {
                Id = Guid.NewGuid(),
                UserId = saveGameDto.UserId,
                StartedAt = DateTime.UtcNow,
                EndedAt = DateTime.UtcNow,
                Score = 0
            };

            await _gameRepository.AddAsync(game);

            // Save answers
            foreach (var answer in saveGameDto.Answers)
            {
                var quote = await _quoteRepository.GetByIdAsync(answer.QuoteId);
                if (quote == null)
                    continue;

                var quizAnswer = new QuizAnswer
                {
                    Id = Guid.NewGuid(),
                    QuizGameId = game.Id,
                    QuoteId = answer.QuoteId,
                    SelectedAnswer = answer.SelectedAnswer,
                    SuggestedOptions = answer.SuggestedOptions,
                    IsCorrect = answer.IsCorrect,
                    AnsweredAt = DateTime.UtcNow
                };

                await _answerRepository.AddAsync(quizAnswer);

                if (answer.IsCorrect)
                    game.Score++;
            }

            // Update game score
            await _gameRepository.UpdateAsync(game);

            return new SaveGameResponseDto { Id = game.Id };
        }

        public async Task<IEnumerable<UserGameHistoryDto>> GetUserGameHistoryAsync(Guid userId)
        {
            // Verify user exists
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null || user.IsDeleted)
                throw new InvalidOperationException("User not found.");

            var games = await _gameRepository.FindAsync(g => g.UserId == userId && g.EndedAt.HasValue);
            var gameList = new List<UserGameHistoryDto>();

            foreach (var game in games.OrderByDescending(g => g.StartedAt))
            {
                var answers = await _answerRepository.FindAsync(a => a.QuizGameId == game.Id);
                var answerList = new List<GameQuestionAnswerDto>();

                foreach (var answer in answers)
                {
                    var quote = await _quoteRepository.GetByIdAsync(answer.QuoteId);
                    if (quote == null)
                        continue;

                    answerList.Add(new GameQuestionAnswerDto
                    {
                        QuoteId = answer.QuoteId,
                        QuoteText = quote.Text,
                        Author = quote.Author,
                        SelectedAnswer = answer.SelectedAnswer,
                        SuggestedOptions = answer.SuggestedOptions,
                        CorrectAnswer = quote.Author,
                        IsCorrect = answer.IsCorrect
                    });
                }

                var totalQuestions = answerList.Count;
                var correctAnswers = answerList.Count(a => a.IsCorrect);

                gameList.Add(new UserGameHistoryDto
                {
                    GameId = game.Id,
                    PlayedAt = game.StartedAt,
                    TotalQuestions = totalQuestions,
                    CorrectAnswers = correctAnswers,
                    AccuracyPercentage = totalQuestions > 0 ? (double)correctAnswers / totalQuestions * 100 : 0,
                    Questions = answerList
                });
            }

            return gameList;
        }
    }
}
