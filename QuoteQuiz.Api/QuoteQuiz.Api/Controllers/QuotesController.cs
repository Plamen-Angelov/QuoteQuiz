using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using QuoteQuiz.Api.DTOs;
using QuoteQuiz.Api.Services;

namespace QuoteQuiz.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuotesController : ControllerBase
    {
        private readonly IQuoteService _quoteService;
        private readonly ILogger<QuotesController> _logger;

        public QuotesController(IQuoteService quoteService, ILogger<QuotesController> logger)
        {
            _quoteService = quoteService;
            _logger = logger;
        }

        /// <summary>
        /// Get all quotes with pagination
        /// </summary>
        /// <param name="pageNumber">Page number (default: 1)</param>
        /// <param name="pageSize">Page size (default: 10)</param>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<PagedResultDto<QuoteDto>>> GetQuotes([FromQuery] string? searchText, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] string sortBy = "CreatedAt", [FromQuery] string sortDirection = "desc")
        {
            try
            {
                var quotes = await _quoteService.GetQuotesPagedAsync(searchText, pageNumber, pageSize, sortBy, sortDirection);
                return Ok(quotes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting quotes");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving quotes.");
            }
        }

        /// <summary>
        /// Get quote by ID
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<QuoteDto>> GetQuoteById(Guid id)
        {
            try
            {
                var quote = await _quoteService.GetQuoteByIdAsync(id);
                if (quote == null)
                    return NotFound("Quote not found.");

                return Ok(quote);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting quote {QuoteId}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving the quote.");
            }
        }

        /// <summary>
        /// Create a new quote
        /// </summary>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<QuoteDto>> CreateQuote([FromBody] CreateQuoteDto createQuoteDto)
        {
            try
            {
                var quote = await _quoteService.CreateQuoteAsync(createQuoteDto);
                return CreatedAtAction(nameof(GetQuoteById), new { id = quote.Id }, quote);
            }
            catch (ValidationException ex)
            {
                var errors = ex.Errors.Select(e => e.ErrorMessage).ToList();
                return BadRequest(new { errors });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating quote");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while creating the quote.");
            }
        }

        /// <summary>
        /// Update an existing quote
        /// </summary>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<QuoteDto>> UpdateQuote(Guid id, [FromBody] UpdateQuoteDto updateQuoteDto)
        {
            try
            {
                var quote = await _quoteService.UpdateQuoteAsync(id, updateQuoteDto);
                return Ok(quote);
            }
            catch (ValidationException ex)
            {
                var errors = ex.Errors.Select(e => e.ErrorMessage).ToList();
                return BadRequest(new { errors });
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating quote {QuoteId}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the quote.");
            }
        }

        /// <summary>
        /// Delete (soft delete) a quote
        /// </summary>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> DeleteQuote(Guid id)
        {
            try
            {
                await _quoteService.DeleteQuoteAsync(id);
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting quote {QuoteId}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while deleting the quote.");
            }
        }
    }
}
