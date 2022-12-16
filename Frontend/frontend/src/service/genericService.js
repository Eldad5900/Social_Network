import { API_URL } from "../utils/constants";

export class GenericService {
  #url;
  constructor(collection) {
    this.#url = API_URL + collection + "/";
  }

  async getAllAsync() {
    const response = await fetch(this.#url);
    if (response.ok) {
      return await this.#success(response);
    } else {
      this.#failure(response);
    }
  }

  async getByIdAsync(id) {
    const response = await fetch(`${this.#url}${id}`);
    if (response.ok) {
      return await this.#success(response);
    } else {
      this.#failure(response);
    }
  }

  async postAsync(item) {
    return fetch(this.#url, {
      method: "POST",
      body: JSON.stringify(item),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(this.#success)
      .catch(this.#failure);
  }

  async patchAsync(item, id) {
    return fetch(this.#url + id, {
      method: "PATCH",
      body: JSON.stringify(item),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(this.#success)
      .catch(this.#failure);
  }

  async deleteAsync(id) {
    return fetch(this.#url + id, {
      method: "DELETE",
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
