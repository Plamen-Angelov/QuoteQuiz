using FluentValidation;
using QuoteQuiz.Api.Data.Models;
using QuoteQuiz.Api.Data.Repositories;
using QuoteQuiz.Api.DTOs;

namespace QuoteQuiz.Api.Services
{
    public class QuoteService : IQuoteService
    {
        private readonly IQuoteRepository _quoteRepository;
        private readonly IValidator<CreateQuoteDto> _createQuoteValidator;
        private readonly IValidator<UpdateQuoteDto> _updateQuoteValidator;

        public QuoteService(
            IQuoteRepository quoteRepository,
            IValidator<CreateQuoteDto> createQuoteValidator,
            IValidator<UpdateQuoteDto> updateQuoteValidator)
        {
            _quoteRepository = quoteRepository;
            _createQuoteValidator = createQuoteValidator;
            _updateQuoteValidator = updateQuoteValidator;
        }

        public async Task<QuoteDto?> GetQuoteByIdAsync(Guid id)
        {
            var quote = await _quoteRepository.GetByIdAsync(id);
            if (quote == null || quote.IsDeleted)
                return null;

            return MapToDto(quote);
        }

        public async Task<IEnumerable<QuoteDto>> GetAllQuotesAsync()
        {
            var quotes = await _quoteRepository.GetAllAsync();
            return quotes.Where(q => !q.IsDeleted).Select(MapToDto);
        }

        public async Task<PagedResultDto<QuoteDto>> GetQuotesPagedAsync(string? searchText, int pageNumber, int pageSize, string sortBy = "CreatedAt", string sortDirection = "desc")
        {
            var (items, total) = await _quoteRepository.GetQuotesPagedAsync(searchText, pageNumber, pageSize, sortBy, sortDirection);
            return new PagedResultDto<QuoteDto>
            {
                Items = items.Select(MapToDto),
                Total = total
            };
        }

        public async Task<QuoteDto> CreateQuoteAsync(CreateQuoteDto createQuoteDto)
        {
            // Validate
            var validationResult = await _createQuoteValidator.ValidateAsync(createQuoteDto);
            if (!validationResult.IsValid)
                throw new ValidationException(validationResult.Errors);

            // Create new quote
            var quote = new Quote
            {
                Id = Guid.NewGuid(),
                Text = createQuoteDto.Text,
                Author = createQuoteDto.Author,
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false
            };

            await _quoteRepository.AddAsync(quote);
            return MapToDto(quote);
        }

        public async Task<QuoteDto> UpdateQuoteAsync(Guid id, UpdateQuoteDto updateQuoteDto)
        {
            // Validate
            var validationResult = await _updateQuoteValidator.ValidateAsync(updateQuoteDto);
            if (!validationResult.IsValid)
                throw new ValidationException(validationResult.Errors);

            var quote = await _quoteRepository.GetByIdAsync(id);
            if (quote == null || quote.IsDeleted)
                throw new InvalidOperationException("Quote not found.");

            quote.Text = updateQuoteDto.Text;
            quote.Author = updateQuoteDto.Author;

            await _quoteRepository.UpdateAsync(quote);
            return MapToDto(quote);
        }

        public async Task DeleteQuoteAsync(Guid id)
        {
            var quote = await _quoteRepository.GetByIdAsync(id);
            if (quote == null || quote.IsDeleted)
                throw new InvalidOperationException("Quote not found.");

            await _quoteRepository.SoftDeleteAsync(id);
        }

        private QuoteDto MapToDto(Quote quote)
        {
            return new QuoteDto
            {
                Id = quote.Id,
                Text = quote.Text,
                Author = quote.Author,
                CreatedAt = quote.CreatedAt
            };
        }
    }
}
