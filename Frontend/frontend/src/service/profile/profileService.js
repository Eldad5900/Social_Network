import { API_URL } from "../../utils/constants";

export class ProfileService {
  async getProfile(userId) {
    return fetch(`${API_URL}profile/${userId}`)
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
