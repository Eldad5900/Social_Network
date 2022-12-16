import { API_URL } from "../../utils/constants";

export class RelationshipsService {
  async sendFriendRequest({ receiverId, sender }) {
    return fetch(`${API_URL}relationships/send-friend-request/${receiverId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("access-token")
        )}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sender }),
    })
      .then(this.#success)
      .catch(this.#failure);
  }

  async withdrawFriendRequest({ receiverId, sender }) {
    return fetch(
      `${API_URL}relationships/withdraw-friend-request/${receiverId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("access-token")
          )}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sender }),
      }
    )
      .then(this.#success)
      .catch(this.#failure);
  }

  async acceptFriendRequest({ receiver, senderId }) {
    return fetch(`${API_URL}relationships/accept-friend-request/${senderId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("access-token")
        )}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ receiver }),
    })
      .then(this.#success)
      .catch(this.#failure);
  }

  async rejectFriendRequest({ receiver, senderId }) {
    return fetch(`${API_URL}relationships/reject-friend-request/${senderId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("access-token")
        )}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ receiver }),
    })
      .then(this.#success)
      .catch(this.#failure);
  }

  async removeFriend({ id1, id2 }) {
    return fetch(`${API_URL}relationships/remove-friend`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("access-token")
        )}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id1, id2 }),
    })
      .then(this.#success)
      .catch(this.#failure);
  }

  //friends, requestsReceived, requestsSent
  async getRelationships({ relationship, userId }) {
    return fetch(
      `${API_URL}relationships/get-users/${userId}/${relationship}`,
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("access-token")
          )}`,
        },
      }
    )
      .then(this.#success)
      .catch(this.#failure);
  }

  async getFriends(userId) {
    return fetch(`${API_URL}relationships/get-friends/${userId}`)
      .then(this.#success)
      .catch(this.#failure);
  }

  async deleteAsync(id) {
    return fetch(`${API_URL}relationships/${id}`, {
      method: "DELETE",
    })
      .then(this.#success)
      .catch(this.#failure);
  }

  async postAsync(item) {
    return fetch(`${API_URL}relationships`, {
      method: "POST",
      body: JSON.stringify(item),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(this.#success)
      .catch(this.#failure);
  }

  async getBlocked(userId) {
    return fetch(`${API_URL}relationships/getBlocked/${userId}`)
      .then(this.#success)
      .catch(this.#failure);
  }

  async getRequests(userId) {
    return fetch(`${API_URL}relationships/getRequested/${userId}`)
      .then(this.#success)
      .catch(this.#failure);
  }

  async getRelevantUsers(userId) {
    return fetch(`${API_URL}relationships/getRelevantUsers/${userId}`)
      .then(this.#success)
      .catch(this.#failure);
  }

  async patchAsync(item, userId) {
    return fetch(`${API_URL}relationships/${userId}`, {
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
