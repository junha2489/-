// 메인 페이지 JavaScript

// DOM 요소 가져오기
const siteTitle = document.getElementById('site-title');
const subtitle = document.getElementById('subtitle');
const categoryList = document.getElementById('category-list');

// 데이터 구조
let galleryData = {
    title: '인크 아트 갤러리',
    subtitle: '먹이로 만든 수묵화 작품 전시',
    categories: ['수묵화'], // 카테고리 목록
    works: [] // 작품 목록 (업로드 페이지에서 추가됨)
};

// localStorage 에서 데이터 로드
function loadGalleryData() {
    const savedData = localStorage.getItem('inkArtGalleryData');
    if (savedData) {
        try {
            galleryData = JSON.parse(savedData);
        } catch (e) {
            console.error('데이터 파싱 실패:', e);
            saveToLocalStorage(); // 잘못된 데이터일 경우 초기화
        }
    } else {
        saveToLocalStorage();
    }
}

// 데이터를 localStorage 에 저장
function saveToLocalStorage() {
    try {
        localStorage.setItem('inkArtGalleryData', JSON.stringify(galleryData));
    } catch (e) {
        console.error('localStorage 저장 실패:', e);
    }
}

// 카테고리 목록 표시
function renderCategories() {
    categoryList.innerHTML = '';
    
    if (galleryData.categories.length === 0) {
        categoryList.innerHTML = '<p>카테고리를 설정해주세요.</p>';
        return;
    }
    
    galleryData.categories.forEach((category, index) => {
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item hover-effect';
        categoryItem.textContent = category;
        
        // 카테고리 클릭 시 필터링 (현재는 전체 표시)
        categoryItem.addEventListener('click', () => {
            alert(`${category} 카테고리에 대한 필터링 기능은 추가 예정입니다.`);
        });
        
        categoryList.appendChild(categoryItem);
    });
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    loadGalleryData();
    renderCategories();
});
