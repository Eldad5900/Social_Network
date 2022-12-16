import { API_URL } from "../../utils/constants";

export class UsersService {
  async getUsers() {
    return fetch(`${API_URL}users`).then(this.#success).catch(this.#failure);
  }

  async getUserById(userId) {
    return fetch(`${API_URL}users/${userId}`)
      .then(this.#success)
      .catch(this.#failure);
  }

  async editUser(user, userId) {
    return fetch(`${API_URL}users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(user),
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

  async #success(response) {
    const data = await response.json();
    return data;
  }

  #failure(response) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
}
