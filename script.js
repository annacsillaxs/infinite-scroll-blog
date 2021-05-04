const posts_container = document.querySelector('#posts-container');
const loading = document.querySelector('.loader');
const filter = document.querySelector('#filter');

let limit = 5;
let page = 1;


// Fetch posts from API
async function getPosts() {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`);

  const data = await res.json();

  return data;
}

// Show posts in DOM
async function showPosts() {
  const posts = await getPosts();

  posts.forEach(post => {
    const postEl = document.createElement('div');
    postEl.classList.add('post');

    postEl.innerHTML = `
      <div class="number">${post.id}</div>
      <div class="post-info">
        <h2 class="post-title">${post.title}</h2>
        <p class="post-body">${post.body}</p>
      </div>
    `;

    posts_container.appendChild(postEl);
  });
}

// Show loader & fetch more posts
function showLoading() {
  loading.classList.add('show');

  setTimeout(() => {
    loading.classList.remove('show');

    setTimeout(() => {
      page++;
      showPosts()
    }, 300);
  }, 1000)
  
}

// Filter posts by input
function filterPosts(e) {
  const term = e.target.value.toUpperCase();
  const posts = document.querySelectorAll('.post');

  posts.forEach(post => {
    const title = post.querySelector('.post-title').innerText.toUpperCase();
    const body = post.querySelector('.post-body').innerText.toUpperCase();

    if (title.indexOf(term) > -1 || body.indexOf(term) > -1) {
      post.style.display = 'flex';
      highlightTerm(e)
    } else {
      post.style.display = 'none';
    }
  })
}

// Highlight searchTerm
function highlightTerm(e) {
  const searchTerm = e.target.value;
  const posts = document.querySelectorAll('.post');
  let re = new RegExp(searchTerm, 'g');

  posts.forEach(post => {
    const title = post.querySelector('.post-title').innerText;
    const body = post.querySelector('.post-body').innerText;
    
    let newStr = title.replace(re, `<span class='highlight'>${searchTerm}</span>`);
    let newStrBody = body.replace(re, `<span class='highlight'>${searchTerm}</span>`);
    
    post.querySelector('.post-title').innerHTML = `${newStr}`;
    post.querySelector('.post-body').innerHTML = `${newStrBody}`;
  })
}

// `<span class='highlight'>${searchTerm}</span>`

// Show initial posts
showPosts();

window.addEventListener('scroll', () => {
  // clientHeight => viewport
  // scrollTop => scrolled from top
  // scrollHeight => height of the document
  const { scrollTop, scrollHeight, clientHeight } =  document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 5) {
    showLoading();
  }
})

filter.addEventListener('input', filterPosts);