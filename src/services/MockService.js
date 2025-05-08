// Mock data for GitHub repositories when rate limit is exceeded
export const mockRepos = [
  {
    "id": 677617694,
    "name": "anishfyi",
    "full_name": "anishfyi/anishfyi",
    "description": null,
    "fork": false,
    "owner": {
      "login": "anishfyi",
      "id": 59671878,
      "avatar_url": "https://avatars.githubusercontent.com/u/59671878?v=4",
      "html_url": "https://github.com/anishfyi"
    },
    "html_url": "https://github.com/anishfyi/anishfyi",
    "language": null,
    "created_at": "2023-08-12T04:22:52Z",
    "updated_at": "2025-05-05T19:54:54Z",
    "pushed_at": "2025-05-05T19:54:50Z"
  },
  {
    "id": 540871606,
    "name": "anishfyi.github.io",
    "full_name": "anishfyi/anishfyi.github.io",
    "description": "Portfolio Website built on React.",
    "fork": false,
    "owner": {
      "login": "anishfyi",
      "id": 59671878,
      "avatar_url": "https://avatars.githubusercontent.com/u/59671878?v=4",
      "html_url": "https://github.com/anishfyi"
    },
    "html_url": "https://github.com/anishfyi/anishfyi.github.io",
    "language": "TypeScript",
    "created_at": "2022-09-24T15:16:31Z",
    "updated_at": "2025-05-08T07:09:13Z",
    "pushed_at": "2025-05-08T07:09:28Z"
  },
  {
    "id": 957685720,
    "name": "coupon-management-api",
    "full_name": "anishfyi/coupon-management-api",
    "description": "RESTful API to manage and apply different types of discount coupons.",
    "fork": false,
    "owner": {
      "login": "anishfyi",
      "id": 59671878,
      "avatar_url": "https://avatars.githubusercontent.com/u/59671878?v=4",
      "html_url": "https://github.com/anishfyi"
    },
    "html_url": "https://github.com/anishfyi/coupon-management-api",
    "language": "Python",
    "created_at": "2025-03-31T00:03:40Z",
    "updated_at": "2025-03-31T00:26:41Z",
    "pushed_at": "2025-03-31T00:26:38Z"
  },
  {
    "id": 549442008,
    "name": "GitHubRepoLister",
    "full_name": "anishfyi/GitHubRepoLister",
    "description": "A React-based tool that fetches and displays all repositories and their details for any GitHub user via the public GitHub API.",
    "fork": false,
    "owner": {
      "login": "anishfyi",
      "id": 59671878,
      "avatar_url": "https://avatars.githubusercontent.com/u/59671878?v=4",
      "html_url": "https://github.com/anishfyi"
    },
    "html_url": "https://github.com/anishfyi/GitHubRepoLister",
    "language": "JavaScript",
    "created_at": "2022-10-11T07:37:19Z",
    "updated_at": "2025-04-10T13:55:18Z",
    "pushed_at": "2025-04-10T13:55:14Z"
  },
  {
    "id": 963866099,
    "name": "qr-code",
    "full_name": "anishfyi/qr-code",
    "description": "QR Code Generator built with React, TypeScript, and Vite",
    "fork": false,
    "owner": {
      "login": "anishfyi",
      "id": 59671878,
      "avatar_url": "https://avatars.githubusercontent.com/u/59671878?v=4",
      "html_url": "https://github.com/anishfyi"
    },
    "html_url": "https://github.com/anishfyi/qr-code",
    "language": "TypeScript",
    "created_at": "2025-04-10T10:30:02Z",
    "updated_at": "2025-05-06T07:35:24Z",
    "pushed_at": "2025-05-06T07:35:21Z"
  },
  {
    "id": 978342206,
    "name": "velofy",
    "full_name": "anishfyi/velofy",
    "description": null,
    "fork": false,
    "owner": {
      "login": "anishfyi",
      "id": 59671878,
      "avatar_url": "https://avatars.githubusercontent.com/u/59671878?v=4",
      "html_url": "https://github.com/anishfyi"
    },
    "html_url": "https://github.com/anishfyi/velofy",
    "language": "CSS",
    "created_at": "2025-05-05T20:50:15Z",
    "updated_at": "2025-05-06T07:34:26Z",
    "pushed_at": "2025-05-06T07:34:23Z"
  }
];

// Mock user data for when rate limit is exceeded
export const mockUser = {
  "login": "anishfyi",
  "id": 59671878,
  "avatar_url": "https://avatars.githubusercontent.com/u/59671878?v=4",
  "html_url": "https://github.com/anishfyi",
  "name": "Anish Kr Singh",
  "public_repos": 6
};

// Function to get mock repositories for pagination
export const getMockReposByPage = (page, perPage = 10) => {
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  return mockRepos.slice(startIndex, endIndex);
};

// Function to check if response indicates rate limit exceeded
export const isRateLimitExceeded = (response) => {
  return response.status === 403 && 
         response.headers.get('X-RateLimit-Remaining') === '0';
};

// Mock API service with rate limit handling
export const fetchWithRateLimitHandling = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    
    // Check if rate limit is exceeded
    if (isRateLimitExceeded(response)) {
      console.warn('GitHub API rate limit exceeded, using mock data');
      
      // Determine which mock data to return based on the URL
      if (url.includes('/repos?')) {
        // Extract page number from URL
        const urlParams = new URLSearchParams(url.split('?')[1]);
        const page = parseInt(urlParams.get('page') || '1');
        const perPage = parseInt(urlParams.get('per_page') || '10');
        
        return {
          ok: true,
          json: async () => getMockReposByPage(page, perPage),
          rateLimited: true
        };
      } else if (url.includes('/users/')) {
        return {
          ok: true,
          json: async () => mockUser,
          rateLimited: true
        };
      }
    }
    
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    // Return mock data for network errors as well
    if (url.includes('/repos?')) {
      return {
        ok: true,
        json: async () => getMockReposByPage(1, 10),
        rateLimited: true,
        error: true
      };
    } else if (url.includes('/users/')) {
      return {
        ok: true,
        json: async () => mockUser,
        rateLimited: true,
        error: true
      };
    }
    throw error;
  }
}; 