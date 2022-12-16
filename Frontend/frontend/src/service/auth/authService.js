import { AUTH_URL } from "../../utils/constants";

export class AuthenticationService {
  async signUp(user) {
    return fetch(`${AUTH_URL}register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then(this.#success)
      .catch(this.#failure);
  }

  async getUser() {
    return fetch(`${AUTH_URL}profile-by-token`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("access-token")
        )}`,
        "Content-Type": "application/json",
      },
    })
      .then(this.#success)
      .catch(this.#failure);
  }

  async login(credentials) {
    return fetch(`${AUTH_URL}login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then(this.#success)
      .catch(this.#failure);
  }

  async socialLogin(credentials) {
    return fetch(`${AUTH_URL}social-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then(this.#success)
      .catch(this.#failure);
  }

  async sendResetPasswordLink(email) {
    return fetch(`${AUTH_URL}forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then(this.#success)
      .catch(this.#failure);
  }

  async resetPassword({ userId, password1, password2 }) {
    return fetch(`${AUTH_URL}reset-password/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password1, password2 }),
    })
      .then(this.#success)
      .catch(this.#failure);
  }

  async #success(response) {
    const data = await response.json();
    return data;
  }

  #failure(response) {
    const message = `An error has occured: ${response}`;
    throw new Error(message);
  }
}
