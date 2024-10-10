document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    const randomMatchBtn = document.getElementById('random-match-btn');

    // 美女数据
    const beauties = [
        { id: 1, name: "小莉", image: "https://picsum.photos/id/64/300/400", description: "活泼开朗的邻家女孩" },
        { id: 2, name: "美美", image: "https://picsum.photos/id/65/300/400", description: "温柔体贴的知性女神" },
        { id: 3, name: "甜甜", image: "https://picsum.photos/id/94/300/400", description: "可爱俏皮的元气少女" },
        { id: 4, name: "冰冰", image: "https://picsum.photos/id/231/300/400", description: "高冷御姐，内心温柔" },
        { id: 5, name: "娜娜", image: "https://picsum.photos/id/331/300/400", description: "阳光运动的健身达人" },
    ];

    // 动态添加美女头像
    function renderGallery() {
        gallery.innerHTML = '';
        beauties.forEach(beauty => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `
                <img src="${beauty.image}" alt="${beauty.name}">
                <h3>${beauty.name}</h3>
                <p>${beauty.description}</p>
            `;
            item.addEventListener('click', () => {
                window.location.href = `chat.html?id=${beauty.id}`;
            });
            gallery.appendChild(item);
        });
    }

    // 随机匹配功能
    function randomMatch() {
        const randomIndex = Math.floor(Math.random() * beauties.length);
        const randomBeauty = beauties[randomIndex];
        window.location.href = `chat.html?id=${randomBeauty.id}`;
    }

    // 新用户引导教程
    function showTutorial() {
        const tutorial = document.getElementById('tutorial');
        tutorial.innerHTML = `
            <div class="tutorial-content">
                <h2>欢迎来到 AI 女友聊天</h2>
                <p>1. 浏览美女头像，点击喜欢的美女进入聊天。</p>
                <p>2. 使用随机匹配功能，让系统为你选择一位美女。</p>
                <p>3. 在聊天界面，尽情与 AI 女友交流吧！</p>
                <button id="close-tutorial">我知道了</button>
            </div>
        `;
        tutorial.classList.remove('hidden');

        document.getElementById('close-tutorial').addEventListener('click', () => {
            tutorial.classList.add('hidden');
            localStorage.setItem('tutorialShown', 'true');
        });
    }

    // 初始化
    renderGallery();
    randomMatchBtn.addEventListener('click', randomMatch);

    // 检查是否需要显示新用户引导
    if (!localStorage.getItem('tutorialShown')) {
        showTutorial();
    }
});