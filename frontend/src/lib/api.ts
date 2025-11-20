const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
    age: number;
    gender: string;
    curse_style_id: string;
    points: number;
  };
  access_token: string;
  refresh_token: string;
}

interface Post {
  id: string;
  user_id: string;
  username: string;
  content: string;
  post_type: string;
  is_anonymous: boolean;
  curse_count: number;
  is_cursed_by_me: boolean;
  created_at: string;
  // 呪癖スタイル情報
  curse_style_name: string;
  curse_style_name_en: string;
  curse_style_description: string;
}

interface CurseStyle {
  id: string;
  name: string;
  name_en: string;
  description: string;
  is_special: boolean;
  point_cost: number;
}

interface User {
  id: string;
  email: string;
  username: string;
  age: number;
  gender: string;
  curse_style: {
    id: string;
    name: string;
    name_en: string;
    description: string;
  };
  points: number;
  stats: {
    posts: number;
    curses: number;
    days: number;
  };
  created_at: string;
}

interface UserPost {
  id: string;
  content: string;
  curse_count: number;
  created_at: string;
}

class ApiClient {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      if (response.status === 401) {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          try {
            const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refresh_token: refreshToken }),
            });

            if (refreshResponse.ok) {
              const data = await refreshResponse.json();
              localStorage.setItem('access_token', data.access_token);
              localStorage.setItem('refresh_token', data.refresh_token);
              // Retry original request
              throw new Error('TOKEN_REFRESHED');
            } else {
              // Refresh token is invalid, clear storage and logout
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              localStorage.removeItem('juheki_user');
              window.location.href = '/';
              throw new Error('Session expired');
            }
          } catch (error) {
            // Refresh failed, logout
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('juheki_user');
            window.location.href = '/';
            throw new Error('Session expired');
          }
        } else {
          // No refresh token available, clear storage and logout
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('juheki_user');
          window.location.href = '/';
        }
        throw new Error('Unauthorized');
      }

      const error = await response.json();
      throw new Error(error.error || 'An error occurred');
    }

    return response.json();
  }

  // Authentication
  async register(data: {
    email: string;
    username: string;
    password: string;
    age: string;
    gender: string;
    curseStyle: string;
  }): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await this.handleResponse<AuthResponse>(response);

    // Save tokens and user info
    localStorage.setItem('access_token', result.access_token);
    localStorage.setItem('refresh_token', result.refresh_token);
    localStorage.setItem('juheki_user', JSON.stringify(result.user));

    return result;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const result = await this.handleResponse<AuthResponse>(response);

    // Save tokens and user info
    localStorage.setItem('access_token', result.access_token);
    localStorage.setItem('refresh_token', result.refresh_token);
    localStorage.setItem('juheki_user', JSON.stringify(result.user));

    return result;
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('juheki_user');
  }

  // Curse Styles
  async getCurseStyles(): Promise<CurseStyle[]> {
    const response = await fetch(`${API_BASE_URL}/curse-styles`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<CurseStyle[]>(response);
  }

  // Posts
  async getPosts(limit?: number, offset?: number): Promise<Post[]> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());

    const response = await fetch(`${API_BASE_URL}/posts?${params.toString()}`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<Post[]>(response);
  }

  async createPost(content: string, isAnonymous: boolean = true): Promise<Post> {
    const requestBody = {
      content,
      is_anonymous: isAnonymous,
    };

    console.log('Creating post with body:', requestBody);
    console.log('Request body JSON:', JSON.stringify(requestBody));

    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to create post: ${response.status} - ${errorText}`);
    }

    return this.handleResponse<Post>(response);
  }

  async updatePost(postId: string, content: string): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ content }),
    });

    return this.handleResponse<Post>(response);
  }

  async deletePost(postId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    await this.handleResponse<void>(response);
  }

  // Curses (Likes)
  async cursePost(postId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/curse`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    await this.handleResponse<void>(response);
  }

  async uncursePost(postId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/curse`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    await this.handleResponse<void>(response);
  }

  // User
  async getProfile(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<User>(response);
  }

  async updateProfile(data: {
    username?: string;
    age?: number;
    gender?: string;
  }): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<User>(response);
  }

  async getUserPosts(offset?: number, limit?: number): Promise<UserPost[]> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());

    const response = await fetch(`${API_BASE_URL}/users/me/posts?${params.toString()}`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<UserPost[]>(response);
  }
}

export const apiClient = new ApiClient();
export type { AuthResponse, Post, CurseStyle, User, UserPost };
