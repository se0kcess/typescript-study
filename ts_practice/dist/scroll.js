"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const loader = document.createElement('div');
loader.classList.add('loader');
loader.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
            `;
const $wrap = document.querySelector('.wrap');
$wrap === null || $wrap === void 0 ? void 0 : $wrap.appendChild(loader);
const $postsCon = document.getElementById('posts-con');
const $loader = document.querySelector('.loader');
const $filter = document.getElementById('filter');
let limit = 5;
let page = 1;
let isLoading = false;
let currentTerm = '';
let isCheckingScroll = false;
let noMore = false; // 더이상 불러올 데이터가 없을 경우를 확인하기 위한 플래그
const getPosts = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (searchTerm = '') {
    let url = `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`;
    if (searchTerm) {
        url += `&q=${encodeURIComponent(searchTerm)}`;
    }
    const res = yield fetch(url);
    const data = yield res.json();
    // 데이터가 0일 때
    if (data.length === 0) {
        noMore = true;
    }
    return data;
});
const showPosts = () => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield getPosts(currentTerm);
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
        $postsCon === null || $postsCon === void 0 ? void 0 : $postsCon.appendChild(postElm);
    });
    // 추가된 부분: 포스트를 추가한 후 스크롤 가능 여부 확인
    checkScrollable();
});
const newLoading = () => {
    if (isLoading)
        return;
    isLoading = true;
    $loader === null || $loader === void 0 ? void 0 : $loader.classList.add('show');
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        page++;
        console.log(page);
        yield showPosts();
        isLoading = false;
        $loader === null || $loader === void 0 ? void 0 : $loader.classList.remove('show');
    }), 1000);
};
// 추가된 함수: 스크롤 가능한지 확인하고 필요하면 더 많은 포스트를 로드하는 함수
const checkScrollable = () => {
    if (isCheckingScroll)
        return;
    isCheckingScroll = true;
    const checkAndLoad = () => {
        if (document.documentElement.scrollHeight <= window.innerHeight && !noMore) {
            newLoading(); // 새로운 포스트 로드
            // 로딩이 완료된 후 다시 체크
            setTimeout(checkAndLoad, 1500);
        }
        else {
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
    const searchTerm = $filter === null || $filter === void 0 ? void 0 : $filter.value.trim();
    if (searchTerm !== currentTerm) {
        currentTerm !== null && currentTerm !== void 0 ? currentTerm : searchTerm;
        page = 1;
        if ($postsCon)
            $postsCon.innerHTML = '';
        showPosts();
        noMore = true;
    }
};
//   입력폼에서 엔터로 마무리 했을 때 검색 함수 시작
$filter === null || $filter === void 0 ? void 0 : $filter.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        filterPosts();
    }
});
// 수정된 부분: 초기 로드 시 checkScrollable 함수 호출
showPosts().then(() => {
    checkScrollable();
});
