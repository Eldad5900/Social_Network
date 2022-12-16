import { API_URL } from "../../utils/constants";

export class GroupsService {
  async getPublicGroups() {
    return fetch(`${API_URL}groups/getPublic`)
      .then(this.#success)
      .catch(this.#failure);
  }

  async getByIdAsync(id) {
    return fetch(`${API_URL}groups/getById/${id}`)
      .then(this.#success)
      .catch(this.#failure);
  }

  async getAllInformation(id) {
    return fetch(`${API_URL}groups/getAllInformation/${id}`)
      .then(this.#success)
      .catch(this.#failure);
  }
  async requestToJoin({ groupId, sender }) {
    return fetch(`${API_URL}groups/requestToJoin/${groupId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sender }),
    })
      .then(this.#success)
      .catch(this.#failure);
  }

  async cancelRequest({ groupId, sender }) {
    return fetch(`${API_URL}groups/cancelRequest/${groupId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sender }),
    })
      .then(this.#success)
      .catch(this.#failure);
  }

  async acceptRequest({ groupId, sender }) {
    return fetch(`${API_URL}groups/acceptJoinRequest/${groupId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sender }),
    })
      .then(this.#success)
      .catch(this.#failure);
  }

  async makeAdmin({ groupId, sender }) {
    return fetch(`${API_URL}groups/makeAdmin/${groupId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sender }),
    })
      .then(this.#success)
      .catch(this.#failure);
  }

  async removeAdmin({ groupId, sender }) {
    return fetch(`${API_URL}groups/removeAdmin/${groupId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sender }),
    })
      .then(this.#success)
      .catch(this.#failure);
  }
  async addPost({ groupId, post }) {
    return fetch(`${API_URL}groups/addPost/${groupId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post }),
    })
      .then(this.#success)
      .catch(this.#failure);
  }

  async leaveGroup({ groupId, sender }) {
    return fetch(`${API_URL}groups/leaveGroup/${groupId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sender }),
    })
      .then(this.#success)
      .catch(this.#failure);
  }

  async deleteAsync(id) {
    return fetch(`${API_URL}group/${id}`, {
      method: "DELETE",
    })
      .then(this.#success)
      .catch(this.#failure);
  }

  async postAsync(item) {
    return fetch(`${API_URL}groups`, {
      method: "POST",
      body: JSON.stringify(item),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(this.#success)
      .catch(this.#failure);
  }

  async patchAsync(item, userId) {
    return fetch(`${API_URL}groups/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(item),
      headers: {
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
