using Microsoft.AspNetCore.Mvc;
using QuoteQuiz.Api.DTOs;
using QuoteQuiz.Api.Services;

namespace QuoteQuiz.Api.Controllers
{
    [ApiController]
    [Route("api")]
    public class GamesController : ControllerBase
    {
        private readonly IGameService _gameService;
        private readonly ILogger<GamesController> _logger;

        public GamesController(IGameService gameService, ILogger<GamesController> logger)
        {
            _gameService = gameService;
            _logger = logger;
        }

        /// <summary>
        /// Get a random quote for the quiz
        /// </summary>
        [HttpGet("quotes/random")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<QuestionDto>> GetRandomQuote()
        {
            try
            {
                var question = await _gameService.GetRandomQuoteAsync();
                return Ok(question);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting random quote");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving a random quote.");
            }
        }

        /// <summary>
        /// Save a completed game session
        /// </summary>
        [HttpPost("games")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<SaveGameResponseDto>> SaveGame([FromBody] SaveGameDto saveGameDto)
        {
            try
            {
                if (saveGameDto == null || saveGameDto.UserId == Guid.Empty)
                    return BadRequest("UserId is required.");

                var result = await _gameService.SaveGameAsync(saveGameDto);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving game");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while saving the game.");
            }
        }

        /// <summary>
        /// Get user's game history and achievements
        /// </summary>
        [HttpGet("games/user/{userId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<UserGameHistoryDto>>> GetUserGameHistory(Guid userId)
        {
            try
            {
                var history = await _gameService.GetUserGameHistoryAsync(userId);
                return Ok(history);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user game history for user {UserId}", userId);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving game history.");
            }
        }
    }
}
