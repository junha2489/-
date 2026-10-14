// 감상용 페이지 JavaScript

// DOM 요소 가져오기
const categoryList = document.getElementById('category-list');
const worksGrid = document.getElementById('works-list');
const modal = document.getElementById('art-modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const closeModal = document.querySelector('.close-modal');

// 이미지 저장 경로 (현재는 임시 폴더 사용)
const IMAGE_STORAGE_PATH = './images';

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    loadGalleryData();
    renderCategories();
    renderWorks();
});

// 데이터 로드 및 저장 함수
function loadGalleryData() {
    const savedData = localStorage.getItem('inkArtGalleryData');
    if (savedData) {
        try {
            galleryData = JSON.parse(savedData);
            
            // 사이트 설정 업데이트
            document.getElementById('site-title').textContent = galleryData.title;
            document.getElementById('subtitle').textContent = galleryData.subtitle;
        } catch (e) {
            console.error('데이터 파싱 실패:', e);
            saveToLocalStorage();
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
    }
}

// 카테고리 목록 렌더링
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
        
        // 카테고리 클릭 시 필터링
        categoryItem.addEventListener('click', () => {
            filterWorksByCategory(category);
        });
        
        categoryList.appendChild(categoryItem);
    });
}

// 작품 목록 렌더링
function renderWorks() {
    worksGrid.innerHTML = '';
    
    if (!worksGrid) return; // DOM 요소가 없는 경우
    
    if (galleryData.works.length === 0) {
        worksGrid.innerHTML = '<p>아직 업로드된 작품이 없습니다.</p>';
        return;
    }
    
    galleryData.works.forEach((work, index) => {
        const artCard = document.createElement('div');
        artCard.className = 'art-card';
        
        // 이미지 미리보기
        let imageHtml = '';
        if (work.imagePath && work.imagePath.startsWith('./')) {
            imageHtml = `<img src="${work.imagePath}" alt="${work.title || '작품'}">`;
        } else {
            imageHtml = '<p>이미지가 없습니다.</p>';
        }
        
        // 작품 정보
        const title = work.title || '제목 없음';
        const description = work.description || '';
        
        artCard.innerHTML = `
            <div class="art-image-container">
                ${imageHtml}
            </div>
            <h3 class="art-title">${title}</h3>
            ${description ? `<p class="art-description">${description}</p>` : ''}
        `;
        
        // 작품 클릭 시 모달 열기
        artCard.addEventListener('click', () => {
            openModal(work);
        });
        
        worksGrid.appendChild(artCard);
    });
}

// 카테고리별 필터링
function filterWorksByCategory(category) {
    const filteredWorks = galleryData.works.filter(work => work.category === category);
    
    if (filteredWorks.length === 0) {
        alert(`${category} 카테고리에 작품이 없습니다.`);
        return;
    }
    
    // 현재 필터링된 카테고리 표시
    let currentCategoryHtml = '';
    galleryData.categories.forEach((cat, catIndex) => {
        const isActive = cat === category ? 'active' : '';
        currentCategoryHtml += `<div class="category-item ${isActive}">${cat}</div>`;
    });
    
    // 작품 목록 재렌더링 (현재 필터링된 것만 표시)
    worksGrid.innerHTML = '';
    
    filteredWorks.forEach((work, index) => {
        const artCard = document.createElement('div');
        artCard.className = 'art-card';
        
        let imageHtml = '';
        if (work.imagePath && work.imagePath.startsWith('./')) {
            imageHtml = `<img src="${work.imagePath}" alt="${work.title || '작품'}">`;
        } else {
            imageHtml = '<p>이미지가 없습니다.</p>';
        }
        
        const title = work.title || '제목 없음';
        const description = work.description || '';
        
        artCard.innerHTML = `
            <div class="art-image-container">
                ${imageHtml}
            </div>
            <h3 class="art-title">${title}</h3>
            ${description ? `<p class="art-description">${description}</p>` : ''}
        `;
        
        artCard.addEventListener('click', () => {
            openModal(work);
        });
        
        worksGrid.appendChild(artCard);
    });
    
    // 카테고리 목록 업데이트 (현재 필터링된 것만 표시)
    categoryList.innerHTML = currentCategoryHtml;
}

// 모달 열기 함수
function openModal(work) {
    modalImage.src = work.imagePath || '';
    modalTitle.textContent = work.title || '제목 없음';
    
    if (work.description) {
        modalDescription.textContent = work.description;
    } else {
        modalDescription.textContent = '';
    }
    
    modal.style.display = 'flex';
}

// 모달 닫기 함수
function closeModalFunc() {
    modal.style.display = 'none';
}

// 이벤트 리스너 등록
closeModal.addEventListener('click', closeModalFunc);

// 모달 외부 클릭 시 닫기
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModalFunc();
    }
});

// ESC 키로 닫기
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModalFunc();
    }
});
