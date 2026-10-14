// 공통 데이터 관리 모듈

// DOM 요소 가져오기 (메인 페이지용)
const siteTitle = document.getElementById('site-title');
const subtitle = document.getElementById('subtitle');
const categoryList = document.getElementById('category-list');
const welcomeSection = document.getElementById('welcome-section');
const welcomeTitle = document.getElementById('welcome-title');
const welcomeText = document.getElementById('welcome-text');
const welcomeSubtext = document.getElementById('welcome-subtext');

// 데이터 구조
let galleryData = {
    title: '인크 아트 갤러리',
    subtitle: '먹이로 만든 수묵화 작품 전시',
    categories: ['수묵화'], // 카테고리 목록
    works: [], // 작품 목록
    welcomeTitle: 'ยินดีต้อนรับ',
    welcomeText: '이 갤러리는 먹이로 만든 수묵화 작품들을 전시하고 있습니다.',
    welcomeSubtext: '작품을 감상하거나 새로운 작품을 업로드해보세요!'
};

// localStorage 에서 데이터 로드 및 저장
function loadGalleryData() {
    const savedData = localStorage.getItem('inkArtGalleryData');
    if (savedData) {
        try {
            galleryData = JSON.parse(savedData);
            
            // 사이트 설정 업데이트
            siteTitle.textContent = galleryData.title;
            subtitle.textContent = galleryData.subtitle;
            
            // 환영 메시지 업데이트
            welcomeTitle.textContent = galleryData.welcomeTitle || 'ยินดีต้อนรับ';
            welcomeText.textContent = galleryData.welcomeText || '이 갤러리는 먹이로 만든 수묵화 작품들을 전시하고 있습니다.';
            welcomeSubtext.textContent = galleryData.welcomeSubtext || '작품을 감상하거나 새로운 작품을 업로드해보세요!';
            
            // 카테고리 개수 업데이트
            categoryCountInput.value = galleryData.categories.length;
        } catch (e) {
            console.error('데이터 파싱 실패:', e);
            saveToLocalStorage(); // 손상된 데이터 복원
        }
    } else {
        saveToLocalStorage();
    }
}

function saveToLocalStorage() {
    try {
        localStorage.setItem('inkArtGalleryData', JSON.stringify(galleryData));
    } catch (e) {
        console.error('localStorage 저장 실패:', e);
        throw new Error('저장 공간 부족입니다. 이미지가 많을 경우 삭제해주세요.');
    }
}

// 카테고리 목록 표시
function renderCategories() {
    categoryList.innerHTML = '';
    
    if (!categoryList) return; // DOM 요소가 없는 경우
    
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
