import { API_URL } from "../../utils/constants";
import { BlobService } from "./blobService";

export class PostService {
  #blobService = new BlobService();

  async uploadPost(post) {
    if (post.files) {
      const url = await this.#blobService.uploadFiles(post.files[0]);
      post.imageUrl = url;
      post.fileName = post.files[0].name;
      delete post.files;
    }
    return fetch(`${API_URL}posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("access-token")
        )}`,
      },
      body: JSON.stringify(post),
    })
      .then(this.#success)
      .catch(this.#failure);
  }

  async deletePost(post) {
    if (post.fileName && post.imageUrl) {
      await this.#blobService.deleteFile(post.fileName);
    }
    return fetch(`${API_URL}posts/${post._id}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("access-token")
        )}`,
      },
      method: "DELETE",
    })
      .then(this.#success)
      .catch(this.#failure);
  }

  async getPosts() {
    return fetch(`${API_URL}posts`).then(this.#success).catch(this.#failure);
  }

  async getPostsByUser(id) {
    return fetch(`${API_URL}posts/get-posts-by-user/${id}`)
      .then(this.#success)
      .catch(this.#failure);
  }

  async updatePost(post, postId) {
    return fetch(`${API_URL}posts/${postId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("access-token")
        )}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
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
