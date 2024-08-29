interface Post {
  id: number;
  title: string;
  body: string;
}

const loader = document.createElement('div');
loader.classList.add('loader');
loader.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
            `;

const $wrap = document.querySelector('.wrap');
$wrap?.appendChild(loader);

const $postsCon = document.getElementById('posts-con');
const $loader = document.querySelector('.loader');
const $filter = document.getElementById('filter') as HTMLInputElement | null;

let limit = 5;
let page = 1;
let isLoading = false;
let currentTerm = '';
let isCheckingScroll = false;
let noMore = false; // 더이상 불러올 데이터가 없을 경우를 확인하기 위한 플래그

const getPosts = async (searchTerm = ''): Promise<Post[]> => {
  let url = `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`;
  if (searchTerm) {
    url += `&q=${encodeURIComponent(searchTerm)}`;
  }
  const res = await fetch(url);
  const data: Post[] = await res.json();

  // 데이터가 0일 때
  if (data.length === 0) {
    noMore = true;
  }
  return data;
};

const showPosts = async (): Promise<void> => {
  const posts = await getPosts(currentTerm);
  console.log(posts);

  posts.forEach((post) => {
    const postElm = document.createElement('li');
    postElm.classList.add('post');
    postElm.innerHTML = `
            <span class="post-number">${post.id}</span>
            <div class="post-info">
                <h2 class="post-title">${post.title}</h2>
                <p class="post-body">${post.body}</p>
            </div>
            `;
    $postsCon?.appendChild(postElm);
  });

  // 추가된 부분: 포스트를 추가한 후 스크롤 가능 여부 확인
  checkScrollable();
};

const newLoading = () => {
  if (isLoading) return;
  isLoading = true;
  $loader?.classList.add('show');
  setTimeout(async () => {
    page++;
    console.log(page);
    await showPosts();
    isLoading = false;
    $loader?.classList.remove('show');
  }, 1000);
};

// 추가된 함수: 스크롤 가능한지 확인하고 필요하면 더 많은 포스트를 로드하는 함수
const checkScrollable = () => {
  if (isCheckingScroll) return;
  isCheckingScroll = true;

  const checkAndLoad = () => {
    if (document.documentElement.scrollHeight <= window.innerHeight && !noMore) {
      newLoading(); // 새로운 포스트 로드
      // 로딩이 완료된 후 다시 체크
      setTimeout(checkAndLoad, 1500);
    } else {
      isCheckingScroll = false;
    }
  };
  checkAndLoad();
};

window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 20) {
    // 새로운 데이터를 호출
    newLoading();
  }
});

const filterPosts = () => {
  const searchTerm = $filter?.value.trim();
  if (searchTerm !== currentTerm) {
    currentTerm ?? searchTerm;
    page = 1;
    if ($postsCon) $postsCon.innerHTML = '';
    showPosts();
    noMore = true;
  }
};

//   입력폼에서 엔터로 마무리 했을 때 검색 함수 시작
$filter?.addEventListener('keyup', (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    filterPosts();
  }
});

// 수정된 부분: 초기 로드 시 checkScrollable 함수 호출
showPosts().then(() => {
  checkScrollable();
});
