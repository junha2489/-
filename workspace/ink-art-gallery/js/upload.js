// 업로드 페이지 JavaScript

// DOM 요소 가져오기
const siteTitleInput = document.getElementById('site-title-input');
const subtitleInput = document.getElementById('subtitle-input');
const welcomeTitleInput = document.getElementById('welcome-title-input');
const welcomeTextInput = document.getElementById('welcome-text-input');
const welcomeSubtextInput = document.getElementById('welcome-subtext-input');
const categoryCountInput = document.getElementById('category-count-input');
const categoryNameContainer = document.getElementById('category-name-container');
const workImageInput = document.getElementById('work-image-input');
const workTitleInput = document.getElementById('work-title-input');
const workDescriptionInput = document.getElementById('work-description-input');
const workCategorySelect = document.getElementById('work-category-select');
const worksList = document.getElementById('works-list');

// 이미지 저장 경로 (현재는 임시 폴더 사용)
const IMAGE_STORAGE_PATH = './images';

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 페이지 로드 시작...');
    
    // 데이터 로드
    loadGalleryData();
    
    // 카테고리 이름 입력 필드 렌더링
    renderCategoryNameInputs();
    
    // 카테고리 선택 드롭다운 먼저 렌더링
    if (workCategorySelect) {
        console.log('✅ 카테고리 드롭다운 렌더링');
        updateWorkCategorySelect();
    } else {
        console.error('❌ workCategorySelect 요소가 없음');
    }
    
    // 작품 목록 렌더링
    renderWorkList();
});

// 데이터 로드 및 저장 함수
function loadGalleryData() {
    const savedData = localStorage.getItem('inkArtGalleryData');
    console.log('📦 로딩된 데이터:', savedData); // 디버깅용 로그
    
    if (savedData) {
        try {
            galleryData = JSON.parse(savedData);
            
            // 사이트 설정 업데이트
            siteTitleInput.value = galleryData.title;
            subtitleInput.value = galleryData.subtitle;
            
            // 환영 메시지 업데이트
            const welcomeTitleInputEl = document.getElementById('welcome-title-input');
            const welcomeTextInputEl = document.getElementById('welcome-text-input');
            const welcomeSubtextInputEl = document.getElementById('welcome-subtext-input');
            
            if (welcomeTitleInputEl) welcomeTitleInputEl.value = galleryData.welcomeTitle || 'ยินดีต้อนรับ';
            if (welcomeTextInputEl) welcomeTextInputEl.value = galleryData.welcomeText || '이 갤러리는 먹이로 만든 수묵화 작품들을 전시하고 있습니다.';
            if (welcomeSubtextInputEl) welcomeSubtextInputEl.value = galleryData.welcomeSubtext || '작품을 감상하거나 새로운 작품을 업로드해보세요!';
            
            // 카테고리 개수 업데이트
            categoryCountInput.value = galleryData.categories.length;
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
        console.log('✅ localStorage 에 저장됨:', galleryData); // 디버깅용 로그
    } catch (e) {
        console.error('localStorage 저장 실패:', e);
        alert('저장 공간 부족입니다. 이미지가 많을 경우 삭제해주세요.');
    }
}

// 카테고리 이름 입력 필드 렌더링
function renderCategoryNameInputs() {
    categoryNameContainer.innerHTML = '';
    
    if (galleryData.categories.length === 0) {
        // 카테고리가 없는 경우
        const emptyGroup = document.createElement('div');
        emptyGroup.className = 'category-name-input-group';
        
        const label = document.createElement('span');
        label.textContent = '1. ';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = '';
        input.placeholder = '카테고리 이름 입력 (예: 수묵화, 산수)';
        input.className = 'category-empty-input';
        
        // 카테고리 삭제 버튼 (숨김)
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '삭제';
        deleteBtn.className = 'btn btn-small btn-delete category-empty-btn';
        deleteBtn.style.display = 'none';
        deleteBtn.onclick = () => removeCategory(0);
        
        emptyGroup.appendChild(label);
        emptyGroup.appendChild(input);
        emptyGroup.appendChild(deleteBtn);
        categoryNameContainer.appendChild(emptyGroup);
    } else {
        // 카테고리 목록 렌더링
        galleryData.categories.forEach((category, index) => {
            const group = document.createElement('div');
            group.className = 'category-name-input-group';
            
            const label = document.createElement('span');
            label.textContent = `${index + 1}. `;
            
            const input = document.createElement('input');
            input.type = 'text';
            input.value = category;
            input.placeholder = '카테고리 이름 입력';
            
            // 카테고리 삭제 버튼
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '삭제';
            deleteBtn.className = 'btn btn-small btn-delete';
            deleteBtn.onclick = () => removeCategory(index);
            
            group.appendChild(label);
            group.appendChild(input);
            group.appendChild(deleteBtn);
            categoryNameContainer.appendChild(group);
        });
    }
}

// 카테고리 선택 드롭다운 업데이트 함수 (새 추가)
function updateWorkCategorySelect() {
    if (!workCategorySelect) return;
    
    // 기존 옵션 제거
    workCategorySelect.innerHTML = '';
    
    // 카테고리 목록이 없으면 기본값 설정
    const categoriesToDisplay = galleryData.categories.length > 0 
        ? galleryData.categories 
        : ['수묵화', '산수']; // 기본 카테고리
    
    // 선택된 값 유지 (첫 번째 작품의 경우)
    let selectedValue = workCategorySelect.value;
    
    // 옵션 추가
    categoriesToDisplay.forEach((category, index) => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        
        if (index === 0 && !selectedValue) {
            option.selected = true;
        } else if (category === selectedValue) {
            option.selected = true;
        }
        
        workCategorySelect.appendChild(option);
    });
}

// 카테고리 추가 함수
function addCategoryNameInput() {
    const inputGroup = document.createElement('div');
    inputGroup.className = 'category-name-input-group';
    
    const label = document.createElement('span');
    label.textContent = '+ ';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '새 카테고리 이름 입력 (예: 수묵화, 산수)';
    
    // 카테고리 추가 버튼
    const addBtn = document.createElement('button');
    addBtn.textContent = '추가';
    addBtn.className = 'btn btn-small btn-primary';
    addBtn.onclick = () => {
        const categoryName = input.value.trim();
        if (categoryName) {
            galleryData.categories.push(categoryName);
            saveToLocalStorage();
            // 카테고리 선택 드롭다운 업데이트
            updateWorkCategorySelect();
            renderCategoryNameInputs();
        } else {
            alert('카테고리 이름을 입력해주세요.');
        }
    };
    
    inputGroup.appendChild(label);
    inputGroup.appendChild(input);
    inputGroup.appendChild(addBtn);
    categoryNameContainer.appendChild(inputGroup);
}

// 카테고리 삭제 함수
function removeCategory(index) {
    if (confirm(`${galleryData.categories[index]} 카테고리를 삭제하시겠습니까?`)) {
        galleryData.categories.splice(index, 1);
        saveToLocalStorage();
        // 카테고리 선택 드롭다운 업데이트
        updateWorkCategorySelect();
        renderCategoryNameInputs();
    }
}

// 작품 리스트 렌더링
function renderWorkList() {
    worksList.innerHTML = '';
    
    if (galleryData.works.length === 0) {
        console.log('ℹ️ 아직 업로드된 작품이 없습니다.');
        worksList.innerHTML = '<p>아직 업로드된 작품이 없습니다.</p>';
        return;
    }
    
    console.log(`📦 ${galleryData.works.length} 개의 작품을 렌더링합니다.`);
    
    galleryData.works.forEach((work, index) => {
        const workItem = document.createElement('div');
        workItem.className = 'work-item';
        
        // 이미지 미리보기
        let imageHtml = '';
        if (work.imagePath && work.imagePath.startsWith('./')) {
            imageHtml = `<img src="${work.imagePath}" alt="작품 이미지" class="work-image-preview">`;
        } else {
            imageHtml = '<p>이미지가 없습니다.</p>';
        }
        
        // 작품 정보 편집 영역
        const editForm = `
            <div class="work-item-body">
                <label for="work-title-${index}">작품 제목:</label>
                <input type="text" id="work-title-${index}" value="${work.title || ''}">
                
                <label for="work-description-${index}">작품 설명:</label>
                <textarea id="work-description-${index}">${work.description || ''}</textarea>
                
                <label for="work-category-${index}">카테고리:</label>
                <select id="work-category-${index}">
                    ${galleryData.categories.map(cat => 
                        `<option value="${cat}" ${cat === work.category ? 'selected' : ''}>${cat}</option>`
                    ).join('')}
                </select>
            </div>
        `;
        
        // 삭제 버튼
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '작품 삭제';
        deleteBtn.className = 'btn btn-small btn-delete';
        deleteBtn.onclick = () => deleteWork(index);
        
        workItem.innerHTML = imageHtml + editForm;
        workItem.appendChild(deleteBtn);
        
        worksList.appendChild(workItem);
    });
}

// 작품 삭제 함수
function deleteWork(index) {
    if (confirm(`작품 "${galleryData.works[index].title}" 을/를 삭제하시겠습니까?`)) {
        galleryData.works.splice(index, 1);
        saveToLocalStorage();
        renderWorkList();
    }
}

// 이미지 업로드 처리
workImageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    
    if (file) {
        // 파일 이름으로 임시 경로 생성
        const fileName = `work_${Date.now()}_${file.name}`;
        work.imagePath = './images/' + fileName;
        
        // 이미지 미리보기 표시
        const preview = document.createElement('img');
        preview.src = URL.createObjectURL(file);
        preview.className = 'work-image-preview';
        preview.style.maxWidth = '200px';
        worksList.querySelector('.work-item').insertAdjacentElement('afterend', preview);
        
        alert(`이미지가 업로드되었습니다.\n(실제 파일은 ./images/ 폴더에 저장됩니다)`);
    }
});

// 사이트 설정 저장 함수 (새 추가) - 개선된 버전
function saveSiteSettings() {
    const siteTitleInput = document.getElementById('site-title-input');
    const subtitleInput = document.getElementById('subtitle-input');
    const welcomeTitleInput = document.getElementById('welcome-title-input');
    const welcomeTextInput = document.getElementById('welcome-text-input');
    const welcomeSubtextInput = document.getElementById('welcome-subtext-input');
    const categoryCountInput = document.getElementById('category-count-input');

    // 현재 데이터 가져오기
    const savedData = localStorage.getItem('inkArtGalleryData');
    let galleryData;
    
    if (savedData) {
        try {
            galleryData = JSON.parse(savedData);
        } catch (e) {
            alert('데이터 파싱 오류가 발생했습니다.');
            return;
        }
    } else {
        galleryData = {
            title: '인크 아트 갤러리',
            subtitle: '먹이로 만든 수묵화 작품 전시',
            welcomeTitle: 'ยินดีต้อนรับ',
            welcomeText: '이 갤러리는 먹이로 만든 수묵화 작품들을 전시하고 있습니다.',
            welcomeSubtext: '작품을 감상하거나 새로운 작품을 업로드해보세요!',
            categories: ['수묵화'],
            works: []
        };
    }

    // 사이트 설정 업데이트
    galleryData.title = siteTitleInput ? siteTitleInput.value.trim() : '인크 아트 갤러리';
    galleryData.subtitle = subtitleInput ? subtitleInput.value.trim() : '먹이로 만든 수묵화 작품 전시';

    // 환영 메시지 업데이트
    const welcomeTitleInputEl = document.getElementById('welcome-title-input');
    const welcomeTextInputEl = document.getElementById('welcome-text-input');
    const welcomeSubtextInputEl = document.getElementById('welcome-subtext-input');

    if (welcomeTitleInputEl) galleryData.welcomeTitle = welcomeTitleInputEl.value.trim();
    if (welcomeTextInputEl) galleryData.welcomeText = welcomeTextInputEl.value;
    if (welcomeSubtextInputEl) galleryData.welcomeSubtext = welcomeSubtextInputEl.value;

    // 카테고리 개수 업데이트
    const categoryCount = parseInt(categoryCountInput ? categoryCountInput.value : '1');
    if (categoryCount > 0) {
        const currentCategoryCount = galleryData.categories.length;
        
        if (currentCategoryCount < categoryCount) {
            for (let i = currentCategoryCount; i < categoryCount; i++) {
                galleryData.categories.push(`카테고리 ${i + 1}`);
            }
        } else if (currentCategoryCount > categoryCount) {
            const categoriesToRemove = currentCategoryCount - categoryCount;
            for (let i = 0; i < categoriesToRemove; i++) {
                galleryData.categories.pop();
            }
        }
    }

    // localStorage 에 저장
    try {
        localStorage.setItem('inkArtGalleryData', JSON.stringify(galleryData));
        
        // 성공 알림 표시
        alert(`✅ 사이트 설정이 저장되었습니다!\n\n사이트 제목: ${galleryData.title}\n서브타이틀: ${galleryData.subtitle}`);
        
        // 콘솔 로그 추가 (디버깅용)
        console.log('📦 저장된 데이터:', galleryData);
        
    } catch (e) {
        alert(`❌ 저장 실패!\n${e.message}`);
        console.error('저장 오류:', e);
    }
}

// 작품 저장 함수 (새 추가) - 수정됨
function saveWorks() {
    // galleryData 가 제대로 로드되었는지 확인
    if (!galleryData || !Array.isArray(galleryData.works)) {
        alert('❌ 데이터 로딩 실패! 콘솔 로그를 확인해주세요.');
        console.error('galleryData:', galleryData);
        return;
    }

    // DOM 요소가 존재하는지 확인
    const workTitleInput = document.getElementById('work-title-input');
    const workDescriptionInput = document.getElementById('work-description-input');
    const workCategorySelect = document.getElementById('work-category-select');
    
    if (!workTitleInput || !workDescriptionInput) {
        alert('❌ 작품 입력 필드가 없습니다. 페이지를 새로고침해주세요.');
        console.error('작품 입력 필드 없음:', {
            title: !!workTitleInput,
            description: !!workDescriptionInput
        });
        return;
    }

    // 작품 목록 업데이트
    let updatedCount = 0;
    
    for (let i = 0; i < galleryData.works.length; i++) {
        const workTitleInputEl = document.getElementById(`work-title-${i}`);
        const workDescriptionInputEl = document.getElementById(`work-description-${i}`);
        const workCategorySelectEl = document.getElementById(`work-category-${i}`);
        
        if (workTitleInputEl && workDescriptionInputEl) {
            // 작품 제목 업데이트
            galleryData.works[i].title = workTitleInputEl.value.trim();
            
            // 작품 설명 업데이트
            galleryData.works[i].description = workDescriptionInputEl.value;
            
            // 카테고리 업데이트
            const selectedCategory = workCategorySelectEl ? workCategorySelectEl.value : '수묵화';
            if (selectedCategory !== undefined) {
                galleryData.works[i].category = selectedCategory;
            }
            
            updatedCount++;
        } else {
            console.error(`작품 ${i}의 입력 필드 없음:`, {
                titleInput: !!workTitleInputEl,
                descriptionInput: !!workDescriptionInputEl
            });
        }
    }

    // localStorage 에 저장
    saveToLocalStorage();
    
    // 콘솔 로그 추가 (디버깅용)
    console.log('📦 저장된 작품 목록:', galleryData.works);
    
    renderWorkList();
    
    alert(`✅ 작품이 저장되었습니다!\n${updatedCount} 개의 작품이 업데이트되었습니다.`);
}

// 모든 데이터 저장 함수 (기존 기능 유지)
function saveAllData() {
    // 사이트 설정 업데이트
    const siteTitleInput = document.getElementById('site-title-input');
    const subtitleInput = document.getElementById('subtitle-input');
    
    galleryData.title = siteTitleInput ? siteTitleInput.value.trim() : '인크 아트 갤러리';
    galleryData.subtitle = subtitleInput ? subtitleInput.value.trim() : '먹이로 만든 수묵화 작품 전시';

    // 환영 메시지 업데이트
    const welcomeTitleInputEl = document.getElementById('welcome-title-input');
    const welcomeTextInputEl = document.getElementById('welcome-text-input');
    const welcomeSubtextInputEl = document.getElementById('welcome-subtext-input');
    
    if (welcomeTitleInputEl) galleryData.welcomeTitle = welcomeTitleInputEl.value.trim();
    if (welcomeTextInputEl) galleryData.welcomeText = welcomeTextInputEl.value;
    if (welcomeSubtextInputEl) galleryData.welcomeSubtext = welcomeSubtextInputEl.value;

    // 카테고리 개수 업데이트
    const categoryCount = parseInt(categoryCountInput ? categoryCountInput.value : '1');
    if (categoryCount > 0) {
        const currentCategoryCount = galleryData.categories.length;
        
        if (currentCategoryCount < categoryCount) {
            for (let i = currentCategoryCount; i < categoryCount; i++) {
                galleryData.categories.push(`카테고리 ${i + 1}`);
            }
        } else if (currentCategoryCount > categoryCount) {
            const categoriesToRemove = currentCategoryCount - categoryCount;
            for (let i = 0; i < categoriesToRemove; i++) {
                galleryData.categories.pop();
            }
        }
    }

    // 작품 목록 업데이트
    let updatedCount = 0;
    
    for (let i = 0; i < galleryData.works.length; i++) {
        const workTitleInput = document.getElementById(`work-title-${i}`);
        const workDescriptionInput = document.getElementById(`work-description-${i}`);
        const workCategorySelect = document.getElementById(`work-category-${i}`);
        
        if (workTitleInput && workDescriptionInput) {
            galleryData.works[i].title = workTitleInput.value.trim();
            galleryData.works[i].description = workDescriptionInput.value;
            
            // 카테고리 업데이트
            const selectedCategory = workCategorySelect ? workCategorySelect.value : '수묵화';
            if (selectedCategory !== undefined) {
                galleryData.works[i].category = selectedCategory;
            }
            
            updatedCount++;
        }
    }

    saveToLocalStorage();
    renderWorkList();
    
    alert(`✅ 데이터가 저장되었습니다!\n${updatedCount} 개의 작품이 업데이트되었습니다.`);
    
    // 5 초 후 메인 페이지로 이동
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}
