using QuoteQuiz.Api.DTOs;

namespace QuoteQuiz.Api.Services
{
    public interface IUserService
    {
        Task<UserDto?> GetUserByIdAsync(Guid id);
        Task<IEnumerable<UserDto>> GetAllUsersAsync();
        Task<PagedResultDto<UserDto>> GetUsersPagedAsync(string? searchText, int pageNumber, int pageSize, string sortBy = "CreatedAt", string sortDirection = "desc");
        Task<IEnumerable<UserDto>> GetActiveUsersAsync();
        Task<UserDto> CreateUserAsync(CreateUserDto createUserDto);
        Task<UserDto> UpdateUserAsync(Guid id, UpdateUserDto updateUserDto);
        Task DeleteUserAsync(Guid id);
    }
}
