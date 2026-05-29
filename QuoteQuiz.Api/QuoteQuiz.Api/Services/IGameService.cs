using QuoteQuiz.Api.DTOs;

namespace QuoteQuiz.Api.Services
{
    public interface IGameService
    {
        Task<QuestionDto> GetRandomQuoteAsync();
        Task<SaveGameResponseDto> SaveGameAsync(SaveGameDto saveGameDto);
        Task<IEnumerable<UserGameHistoryDto>> GetUserGameHistoryAsync(Guid userId);
    }
}
