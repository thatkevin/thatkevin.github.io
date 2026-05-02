import { filenameToMeta } from '../jekyll.js';

function escHtml(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export class PostsView {
  constructor(client, config, { onEdit, onNew, toast }) {
    this.client = client;
    this.config = config;
    this.onEdit = onEdit;
    this.onNew  = onNew;
    this.toast  = toast;
    this.posts  = [];
  }

  render() {
    return `
      <div class="posts-view">
        <div class="page-header">
          <h1>Posts</h1>
          <div class="actions">
            <button class="btn btn-primary" id="new-post-btn">+ New post</button>
          </div>
        </div>
        <div class="posts-table-wrap">
          <div class="loading-state" id="posts-loading">
            <div class="spinner"></div>
            <span>Loading posts…</span>
          </div>
          <table class="posts-table" id="posts-table" style="display:none">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th></th>
              </tr>
            </thead>
            <tbody id="posts-tbody"></tbody>
          </table>
          <div class="empty-state" id="posts-empty" style="display:none">
            <p>No posts yet.</p>
          </div>
        </div>
      </div>
    `;
  }

  async bind(container) {
    container.querySelector('#new-post-btn').addEventListener('click', () => this.onNew());

    try {
      const items = await this.client.listDir(this.config.postsPath);
      this.posts = items
        .filter(i => i.type === 'file' && i.name.endsWith('.md'))
        .map(i => ({ ...filenameToMeta(i.name), path: i.path, sha: i.sha, name: i.name }))
        .sort((a, b) => b.date.localeCompare(a.date));

      container.querySelector('#posts-loading').style.display = 'none';

      if (!this.posts.length) {
        container.querySelector('#posts-empty').style.display = 'flex';
        return;
      }

      const tbody  = container.querySelector('#posts-tbody');
      const table  = container.querySelector('#posts-table');
      table.style.display = 'table';

      for (const post of this.posts) {
        const tr = this.#renderRow(post);
        tbody.appendChild(tr);
        tr.addEventListener('click', e => {
          if (e.target.closest('button')) return;
          this.onEdit(post.path);
        });
        tr.querySelector('.edit-btn').addEventListener('click', () => this.onEdit(post.path));
        tr.querySelector('.delete-btn').addEventListener('click', e => {
          e.stopPropagation();
          this.#confirmDelete(post, tr);
        });
      }
    } catch (e) {
      container.querySelector('#posts-loading').innerHTML =
        `<span style="color:var(--red)">Failed to load posts: ${e.message}</span>`;
    }
  }

  #renderRow(post) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="post-date">${post.date}</td>
      <td><div class="post-title">${escHtml(post.title)}</div></td>
      <td>
        <div class="post-actions">
          <button class="btn btn-sm btn-ghost edit-btn">Edit</button>
          <button class="btn btn-sm btn-danger delete-btn">Delete</button>
        </div>
      </td>
    `;
    return tr;
  }

  async #confirmDelete(post, tr) {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    try {
      const file = await this.client.getFile(post.path);
      await this.client.deleteFile(post.path, file.sha, `Delete post: ${post.title}`);
      tr.remove();
      this.toast('Post deleted.', 'success');
    } catch (e) {
      this.toast(`Delete failed: ${e.message}`, 'error');
    }
  }
}
