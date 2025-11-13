// NAS-based Authentication Service
// Connects to your self-hosted PHP API

const API_BASE = 'https://api.surendramedisetti.com';
// For testing locally: const API_BASE = 'http://your-nas-ip/api';

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
}

class AuthService {
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    // Load from localStorage on init
    this.token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');
    this.user = userStr ? JSON.parse(userStr) : null;
  }

  async signup(email: string, password: string, name: string): Promise<User> {
    const response = await fetch(`${API_BASE}/signup.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }

    const data: AuthResponse = await response.json();
    this.setAuth(data.token, data.user);
    return data.user;
  }

  async login(email: string, password: string): Promise<User> {
    const response = await fetch(`${API_BASE}/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data: AuthResponse = await response.json();
    this.setAuth(data.token, data.user);
    return data.user;
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  private setAuth(token: string, user: User) {
    this.token = token;
    this.user = user;
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  async saveJob(jobId: string, jobTitle: string, company: string): Promise<void> {
    if (!this.user) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE}/save-job.php`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify({ 
        user_id: this.user.id, 
        job_id: jobId,
        job_title: jobTitle,
        company: company
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save job');
    }
  }

  async getSavedJobs(): Promise<any[]> {
    if (!this.user) throw new Error('Not authenticated');

    const response = await fetch(
      `${API_BASE}/get-saved-jobs.php?user_id=${this.user.id}`,
      {
        headers: { 'Authorization': `Bearer ${this.token}` }
      }
    );

    const data = await response.json();
    return data.saved_jobs || [];
  }
}

export const auth = new AuthService();