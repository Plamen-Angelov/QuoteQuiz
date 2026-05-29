using QuoteQuiz.Api.Data.Models;
using QuoteQuiz.Api.Data.Repositories;
using QuoteQuiz.Api.DTOs;

namespace QuoteQuiz.Api.Services
{
    public class GameService : IGameService
    {
        private readonly IQuoteRepository _quoteRepository;
        private readonly IUserRepository _userRepository;
        private readonly IGameRepository _gameRepository;
        private readonly IRepository<QuizAnswer> _answerRepository;

        public GameService(
            IQuoteRepository quoteRepository,
            IUserRepository userRepository,
            IGameRepository gameRepository,
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

            if (otherAuthors.Count < 2)
                throw new InvalidOperationException("Not enough distinct authors to generate a quiz question.");

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
                EndedAt = DateTime.UtcNow
            };

            await _gameRepository.AddAsync(game);

            // Fetch all referenced quotes in one query
            var quoteIds = saveGameDto.Answers.Select(a => a.QuoteId).ToList();
            var quotes = await _quoteRepository.FindAsync(q => quoteIds.Contains(q.Id));
            var quoteDict = quotes.ToDictionary(q => q.Id);

            var quizAnswers = saveGameDto.Answers
                .Where(a => quoteDict.ContainsKey(a.QuoteId))
                .Select(a => new QuizAnswer
                {
                    Id = Guid.NewGuid(),
                    QuizGameId = game.Id,
                    QuoteId = a.QuoteId,
                    SelectedAnswer = a.SelectedAnswer,
                    SuggestedOptions = a.SuggestedOptions,
                    IsCorrect = a.IsCorrect,
                    AnsweredAt = DateTime.UtcNow
                })
                .ToList();

            await _answerRepository.AddRangeAsync(quizAnswers);

            return new SaveGameResponseDto { Id = game.Id };
        }

        public async Task<IEnumerable<UserGameHistoryDto>> GetUserGameHistoryAsync(Guid userId)
        {
            // Verify user exists
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null || user.IsDeleted)
                throw new InvalidOperationException("User not found.");

            var games = await _gameRepository.GetUserGamesWithDetailsAsync(userId);
            var gameList = new List<UserGameHistoryDto>();

            foreach (var game in games)
            {
                var answerList = game.QuizAnswers
                    .Where(a => a.Quote != null)
                    .Select(a => new GameQuestionAnswerDto
                    {
                        QuoteId = a.QuoteId,
                        QuoteText = a.Quote!.Text,
                        Author = a.Quote.Author,
                        SelectedAnswer = a.SelectedAnswer,
                        SuggestedOptions = a.SuggestedOptions,
                        CorrectAnswer = a.Quote.Author,
                        IsCorrect = a.IsCorrect
                    })
                    .ToList();

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
