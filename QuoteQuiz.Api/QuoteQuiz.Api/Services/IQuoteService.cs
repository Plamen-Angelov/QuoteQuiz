using QuoteQuiz.Api.DTOs;

namespace QuoteQuiz.Api.Services
{
    public interface IQuoteService
    {
        Task<QuoteDto?> GetQuoteByIdAsync(Guid id);
        Task<IEnumerable<QuoteDto>> GetAllQuotesAsync();
        Task<PagedResultDto<QuoteDto>> GetQuotesPagedAsync(string? searchText, int pageNumber, int pageSize, string sortBy = "CreatedAt", string sortDirection = "desc");
        Task<QuoteDto> CreateQuoteAsync(CreateQuoteDto createQuoteDto);
        Task<QuoteDto> UpdateQuoteAsync(Guid id, UpdateQuoteDto updateQuoteDto);
        Task DeleteQuoteAsync(Guid id);
    }
}
