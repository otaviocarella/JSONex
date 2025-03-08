document.addEventListener('DOMContentLoaded', function () {
    const jsonInput = document.getElementById('jsonInput');
    const jsonTree = document.getElementById('jsonTree');
    const jsonRawOutput = document.getElementById('jsonRawOutput');
    const jsonHighlightOutput = document.getElementById('jsonHighlightOutput');
    const formatBtn = document.getElementById('formatBtn');
    const compressBtn = document.getElementById('compressBtn');
    const validateBtn = document.getElementById('validateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const shareBtn = document.getElementById('shareBtn');
    const notificationElement = document.getElementById('notification');
    const jsonSize = document.getElementById('jsonSize');
    const jsonNodes = document.getElementById('jsonNodes');
    const jsonDepth = document.getElementById('jsonDepth');
    const searchInput = document.getElementById('searchInput');
    const jsonPath = document.getElementById('jsonPath');
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const sampleItems = document.querySelectorAll('.sample-item');
    const themeToggle = document.getElementById('themeToggle');
    const shareModal = document.getElementById('shareModal');
    const darkOverlay = document.getElementById('darkOverlay');
    const closeShareModal = document.getElementById('closeShareModal');
    const shareLink = document.getElementById('shareLink');
    const copyShareLink = document.getElementById('copyShareLink');
    const qrCode = document.getElementById('qrCode');

    let currentJsonObject = null;
    let currentTab = 'tree';

    const samples = {
        user: {
            id: 1,
            name: "João Silva",
            email: "joao.silva@exemplo.com",
            profile: {
                age: 28,
                occupation: "Desenvolvedor Web",
                address: {
                    street: "Rua das Flores, 123",
                    city: "São Paulo",
                    state: "SP",
                    zipCode: "01234-567"
                }
            },
            interests: ["programação", "música", "viagens"],
            active: true,
            joined_at: "2023-06-15T10:30:00Z",
            last_login: "2023-06-20T08:45:12Z"
        },
        product: {
            id: "PRD-12345",
            name: "Smartphone Galaxy S23",
            price: 4599.90,
            in_stock: true,
            category: "Eletrônicos",
            specifications: {
                display: "6.1 polegadas AMOLED",
                processor: "Snapdragon 8 Gen 2",
                ram: "8GB",
                storage: "256GB",
                camera: {
                    main: "50MP",
                    ultrawide: "12MP",
                    telephoto: "10MP"
                },
                battery: "3900mAh"
            },
            colors: ["Preto", "Branco", "Verde", "Roxo"],
            ratings: {
                average: 4.7,
                count: 328
            },
            release_date: "2023-02-17"
        },
        config: {
            app_name: "JSONex Viewer",
            version: "1.5.2",
            debug_mode: false,
            theme: {
                dark_mode: true,
                accent_color: "#4e54c8",
                font_size: "medium"
            },
            api: {
                base_url: "https://api.example.com/v2",
                timeout: 5000,
                retry: {
                    max_attempts: 3,
                    delay: 1000
                },
                endpoints: [
                    {
                        name: "users",
                        method: "GET",
                        rate_limit: 100
                    },
                    {
                        name: "products",
                        method: "POST",
                        rate_limit: 50
                    }
                ]
            },
            cache: {
                enabled: true,
                ttl: 3600,
                storage: "localStorage"
            },
            permissions: ["read", "write", "admin"],
            created_at: "2023-01-10T15:22:45Z"
        },
        weather: {
            location: {
                city: "Rio de Janeiro",
                country: "Brasil",
                coordinates: {
                    latitude: -22.9068,
                    longitude: -43.1729
                }
            },
            current: {
                time: "2023-06-21T13:45:00Z",
                temperature: {
                    celsius: 28.5,
                    fahrenheit: 83.3
                },
                humidity: 65,
                wind: {
                    speed: 12,
                    direction: "NE"
                },
                condition: "Parcialmente nublado"
            },
            forecast: [
                {
                    date: "2023-06-22",
                    high: 29.8,
                    low: 21.2,
                    condition: "Ensolarado"
                },
                {
                    date: "2023-06-23",
                    high: 27.5,
                    low: 20.8,
                    condition: "Chuvoso"
                },
                {
                    date: "2023-06-24",
                    high: 26.3,
                    low: 20.1,
                    condition: "Tempestade"
                }
            ],
            alerts: [
                {
                    type: "Chuva forte",
                    severity: "moderada",
                    description: "Possibilidade de chuvas intensas na quinta-feira",
                    start: "2023-06-23T15:00:00Z",
                    end: "2023-06-23T21:00:00Z"
                }
            ],
            last_updated: "2023-06-21T13:40:12Z"
        }
    };

    initAnimations();

    function formatJSON() {
        const jsonString = jsonInput.value.trim();
        if (!jsonString) {
            showNotification('Insira um JSON para formatar', 'error');
            return;
        }

        try {
            showLoading(true);
            setTimeout(() => {
                const jsonObject = JSON.parse(jsonString);
                currentJsonObject = jsonObject;

                renderJSONTree(jsonObject);
                jsonRawOutput.textContent = JSON.stringify(jsonObject, null, 2);
                jsonHighlightOutput.textContent = JSON.stringify(jsonObject, null, 2);
                hljs.highlightElement(jsonHighlightOutput);

                updateStats(jsonString, jsonObject);

                jsonInput.value = JSON.stringify(jsonObject, null, 2);

                showNotification('JSON formatado com sucesso!', 'success');
                showLoading(false);
            }, 300);
        } catch (error) {
            showLoading(false);
            showNotification(`Erro: ${error.message}`, 'error');
        }
    }

    function compressJSON() {
        const jsonString = jsonInput.value.trim();
        if (!jsonString) {
            showNotification('Insira um JSON para comprimir', 'error');
            return;
        }

        try {
            const jsonObject = JSON.parse(jsonString);
            const compressed = JSON.stringify(jsonObject);
            jsonInput.value = compressed;
            showNotification('JSON comprimido com sucesso!', 'success');
        } catch (error) {
            showNotification(`Erro: ${error.message}`, 'error');
        }
    }

    function validateJSON() {
        const jsonString = jsonInput.value.trim();
        if (!jsonString) {
            showNotification('Insira um JSON para validar', 'error');
            return;
        }

        try {
            JSON.parse(jsonString);
            showNotification('JSON válido! ✅', 'success');
        } catch (error) {
            showNotification(`JSON inválido: ${error.message}`, 'error');
        }
    }

    function renderJSONTree(jsonObject, container = jsonTree, path = ['root']) {
        container.innerHTML = '';
        renderTreeNode(jsonObject, container, path);
    }

    function renderTreeNode(node, container, path = ['root']) {
        if (node === null || node === undefined) {
            const item = document.createElement('div');
            item.className = 'tree-item';
            item.innerHTML = `<span class="tree-key">${path[path.length - 1]}</span><span class="tree-colon">:</span><span class="value-null">null</span>`;
            container.appendChild(item);
            return;
        }

        if (typeof node !== 'object') {
            const item = document.createElement('div');
            item.className = 'tree-item';

            let valueClass = '';
            let displayValue = '';

            if (typeof node === 'string') {
                valueClass = 'value-string';
                displayValue = `"${escapeHTML(node)}"`;
            } else if (typeof node === 'number') {
                valueClass = 'value-number';
                displayValue = node;
            } else if (typeof node === 'boolean') {
                valueClass = 'value-boolean';
                displayValue = node;
            }

            item.innerHTML = `<span class="tree-key">${path[path.length - 1]}</span><span class="tree-colon">:</span><span class="${valueClass}">${displayValue}</span>`;
            container.appendChild(item);
            return;
        }

        const isArray = Array.isArray(node);
        const keys = Object.keys(node);

        if (keys.length === 0) {
            const item = document.createElement('div');
            item.className = 'tree-item';
            item.innerHTML = `<span class="tree-key">${path[path.length - 1]}</span><span class="tree-colon">:</span><span class="tree-value">${isArray ? '[]' : '{}'}</span>`;
            container.appendChild(item);
            return;
        }

        const item = document.createElement('div');
        item.className = 'tree-item';
        item.dataset.path = path.join('.');

        const toggleBtn = document.createElement('span');
        toggleBtn.className = 'toggle-btn';
        toggleBtn.innerHTML = '-';
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const childrenContainer = item.querySelector('.tree-item-children');
            const isCollapsed = childrenContainer.style.display === 'none';

            if (isCollapsed) {
                gsap.to(childrenContainer, {
                    height: 'auto',
                    duration: 0.3,
                    opacity: 1,
                    display: 'block',
                    onComplete: () => {
                        toggleBtn.innerHTML = '-';
                    }
                });
            } else {
                gsap.to(childrenContainer, {
                    height: 0,
                    duration: 0.3,
                    opacity: 0,
                    onComplete: () => {
                        childrenContainer.style.display = 'none';
                        toggleBtn.innerHTML = '+';
                    }
                });
            }
        });

        item.appendChild(toggleBtn);

        const keySpan = document.createElement('span');
        keySpan.className = 'tree-key';
        keySpan.textContent = path[path.length - 1];
        item.appendChild(keySpan);

        const colonSpan = document.createElement('span');
        colonSpan.className = 'tree-colon';
        colonSpan.textContent = ':';
        item.appendChild(colonSpan);

        const previewSpan = document.createElement('span');
        previewSpan.className = 'collapsed-indicator';
        previewSpan.textContent = isArray ? `Array(${keys.length})` : `Object{${keys.length}}`;
        item.appendChild(previewSpan);

        item.addEventListener('click', (e) => {
            if (e.target === item || e.target === keySpan || e.target === colonSpan || e.target === previewSpan) {
                updateJsonPath(path);
            }
        });

        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'tree-item-children';

        keys.forEach(key => {
            const newPath = [...path, key];
            renderTreeNode(node[key], childrenContainer, newPath);
        });

        item.appendChild(childrenContainer);
        container.appendChild(item);
    }

    function updateJsonPath(path) {
        jsonPath.innerHTML = '';
        path.forEach((segment, index) => {
            const segmentEl = document.createElement('span');
            segmentEl.className = 'path-segment';
            segmentEl.textContent = segment;
            segmentEl.addEventListener('click', () => {
                const newPath = path.slice(0, index + 1);
                updateJsonPath(newPath);
            });
            jsonPath.appendChild(segmentEl);
        });
    }

    function updateStats(jsonString, jsonObject) {
        const bytes = new Blob([jsonString]).size;
        jsonSize.textContent = formatBytes(bytes);

        let nodeCount = 0;
        let maxDepth = 0;

        function countNodes(obj, depth = 0) {
            nodeCount++;
            maxDepth = Math.max(maxDepth, depth);

            if (obj && typeof obj === 'object') {
                Object.values(obj).forEach(value => {
                    countNodes(value, depth + 1);
                });
            }
        }

        countNodes(jsonObject);
        jsonNodes.textContent = nodeCount;
        jsonDepth.textContent = maxDepth;
    }

    function searchInJson() {
        const searchTerm = searchInput.value.trim().toLowerCase();

        document.querySelectorAll('.highlight-found').forEach(el => {
            el.classList.remove('highlight-found');
        });

        if (!searchTerm || !currentJsonObject) return;

        const foundPaths = [];

        function searchRecursive(obj, path = []) {
            if (obj === null || obj === undefined) {
                return;
            }

            if (typeof obj !== 'object') {
                const valueStr = String(obj).toLowerCase();
                if (valueStr.includes(searchTerm)) {
                    foundPaths.push(path);
                }
                return;
            }

            for (const key in obj) {
                if (key.toLowerCase().includes(searchTerm)) {
                    foundPaths.push([...path, key]);
                }

                searchRecursive(obj[key], [...path, key]);
            }
        }

        searchRecursive(currentJsonObject);

        if (foundPaths.length === 0) {
            showNotification('Nenhum resultado encontrado', 'error');
            return;
        }

        foundPaths.forEach(path => {
            let currentPath = ['root'];

            for (let i = 0; i < path.length; i++) {
                currentPath = [...currentPath.slice(0, currentPath.length - 1), path[i]];
                const pathString = currentPath.join('.');
                const parentItem = document.querySelector(`.tree-item[data-path="${pathString}"]`);

                if (parentItem) {
                    const childContainer = parentItem.querySelector('.tree-item-children');
                    const toggleBtn = parentItem.querySelector('.toggle-btn');

                    if (childContainer && childContainer.style.display === 'none') {
                        childContainer.style.display = 'block';
                        childContainer.style.height = 'auto';
                        childContainer.style.opacity = '1';
                        toggleBtn.textContent = '-';
                    }
                }
            }

            const items = Array.from(document.querySelectorAll('.tree-item')).filter(item => {
                const keyEl = item.querySelector('.tree-key');
                return keyEl && keyEl.textContent.toLowerCase().includes(searchInput.value.trim().toLowerCase());
            });

            items.forEach(item => {
                const keyText = item.querySelector('.tree-key').textContent.toLowerCase();
                const valueElements = item.querySelectorAll('.value-string, .value-number, .value-boolean, .value-null');

                if (keyText.includes(searchTerm)) {
                    item.classList.add('highlight-found');
                } else {
                    valueElements.forEach(valueEl => {
                        if (valueEl.textContent.toLowerCase().includes(searchTerm)) {
                            item.classList.add('highlight-found');
                        }
                    });
                }
            });
        });

        showNotification(`Encontrados ${foundPaths.length} resultados`, 'success');

        const firstResult = document.querySelector('.highlight-found');
        if (firstResult) {
            firstResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function showNotification(message, type) {
        notificationElement.textContent = message;
        notificationElement.className = 'notification ' + type;

        gsap.to(notificationElement, {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out"
        });

        setTimeout(() => {
            gsap.to(notificationElement, {
                opacity: 0,
                y: 100,
                duration: 0.3,
                ease: "power2.in"
            });
        }, 3000);
    }

    function showLoading(show) {
        if (show) {
            gsap.to(loadingIndicator, {
                opacity: 1,
                duration: 0.3,
                pointerEvents: 'auto'
            });
        } else {
            gsap.to(loadingIndicator, {
                opacity: 0,
                duration: 0.3,
                pointerEvents: 'none'
            });
        }
    }

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    function escapeHTML(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function initAnimations() {
        gsap.to('.card', {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out"
        });

        gsap.fromTo('.actions button',
            {
                y: 20,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.1,
                delay: 0.5,
                ease: "back.out(1.7)"
            }
        );

        gsap.fromTo('.sample-container div',
            {
                y: 20,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.1,
                delay: 0.5,
                ease: "back.out(1.7)"
            }
        );

        gsap.from('.tab', {
            scale: 0.8,
            opacity: 0,
            duration: 0.4,
            stagger: 0.1,
            delay: 0.8,
            ease: "power1.out"
        });
    }

    function shareCurrent() {
        try {
            if (!currentJsonObject) {
                showNotification('Nada para compartilhar', 'error');
                return;
            }

            const jsonStr = JSON.stringify(currentJsonObject);
            const compressed = btoa(jsonStr);
            const shareUrl = `${window.location.origin}${window.location.pathname}?share=${encodeURIComponent(compressed)}`;

            shareLink.value = shareUrl;

            qrCode.innerHTML = `
                        <div style="width: 150px; height: 150px; margin: 0 auto; background: #fff; padding: 10px; border-radius: 5px; position: relative; overflow: hidden;">
                            <div style="font-size: 12px; text-align: center; color: #333; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                                QR Code para o JSON
                            </div>
                            <div style="width: 100%; height: 100%; display: grid; grid-template-columns: repeat(5, 1fr); grid-template-rows: repeat(5, 1fr); gap: 5px;">
                                ${Array(25).fill().map(() => `<div style="background-color: ${Math.random() > 0.7 ? '#000' : 'transparent'}; border-radius: 2px;"></div>`).join('')}
                            </div>
                        </div>
                    `;

            gsap.set(shareModal, { display: 'block', opacity: 0, scale: 0.9 });
            gsap.set(darkOverlay, { display: 'block', opacity: 0 });

            gsap.to(darkOverlay, { opacity: 1, duration: 0.2 });
            gsap.to(shareModal, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" });

        } catch (error) {
            showNotification('Erro ao compartilhar', 'error');
            console.error(error);
        }
    }

    function handleTabClick(e) {
        const tabName = e.target.dataset.tab;
        if (!tabName) return;

        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        tabContents.forEach(content => {
            if (content.id === tabName + 'View') {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        currentTab = tabName;
    }

    function loadSample(sampleName) {
        const sample = samples[sampleName];
        if (sample) {
            jsonInput.value = JSON.stringify(sample, null, 2);
            formatJSON();
        }
    }

    function checkForSharedJson() {
        const urlParams = new URLSearchParams(window.location.search);
        const sharedJson = urlParams.get('share');

        if (sharedJson) {
            try {
                const decompressed = atob(decodeURIComponent(sharedJson));
                jsonInput.value = decompressed;
                formatJSON();
                showNotification('JSON compartilhado carregado!', 'success');
            } catch (error) {
                showNotification('Erro ao carregar JSON compartilhado', 'error');
            }
        }
    }

    if (!CSS.supports('selector(:has(*))')) {
        Element.prototype.containsText = function (text) {
            return this.textContent.toLowerCase().includes(text.toLowerCase());
        };
    }

    formatBtn.addEventListener('click', formatJSON);
    compressBtn.addEventListener('click', compressJSON);
    validateBtn.addEventListener('click', validateJSON);
    clearBtn.addEventListener('click', () => {
        jsonInput.value = '';
        jsonTree.innerHTML = '';
        jsonRawOutput.textContent = '';
        jsonHighlightOutput.textContent = '';
        currentJsonObject = null;
    });

    copyBtn.addEventListener('click', () => {
        const textToCopy = currentTab === 'raw'
            ? jsonRawOutput.textContent
            : (currentTab === 'highlight'
                ? jsonHighlightOutput.textContent
                : JSON.stringify(currentJsonObject, null, 2));

        navigator.clipboard.writeText(textToCopy).then(() => {
            showNotification('Copiado para área de transferência!', 'success');
        }).catch(err => {
            showNotification('Erro ao copiar', 'error');
        });
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            searchInJson();
        }
    });

    searchInput.addEventListener('input', debounce(searchInJson, 500));

    tabs.forEach(tab => {
        tab.addEventListener('click', handleTabClick);
    });

    sampleItems.forEach(item => {
        item.addEventListener('click', () => {
            loadSample(item.dataset.sample);
        });
    });

    shareBtn.addEventListener('click', shareCurrent);

    closeShareModal.addEventListener('click', () => {
        gsap.to(shareModal, { opacity: 0, scale: 0.9, duration: 0.2, onComplete: () => { shareModal.style.display = 'none'; } });
        gsap.to(darkOverlay, { opacity: 0, duration: 0.2, onComplete: () => { darkOverlay.style.display = 'none'; } });
    });

    darkOverlay.addEventListener('click', () => {
        closeShareModal.click();
    });

    copyShareLink.addEventListener('click', () => {
        navigator.clipboard.writeText(shareLink.value).then(() => {
            showNotification('Link copiado!', 'success');
        }).catch(err => {
            showNotification('Erro ao copiar link', 'error');
        });
    });

    themeToggle.addEventListener('click', () => {
        const root = document.documentElement;
        const isDark = getComputedStyle(root).getPropertyValue('--dark-bg') === '#1a1a2e';

        if (isDark) {
            root.style.setProperty('--dark-bg', '#f7f7f7');
            root.style.setProperty('--darker-bg', '#ffffff');
            root.style.setProperty('--editor-bg', '#f0f0f0');
            root.style.setProperty('--light-text', '#333333');
            themeToggle.textContent = '☀️';
        } else {
            root.style.setProperty('--dark-bg', '#1a1a2e');
            root.style.setProperty('--darker-bg', '#16213e');
            root.style.setProperty('--editor-bg', '#0f3460');
            root.style.setProperty('--light-text', '#e2e2e2');
            themeToggle.textContent = '🌙';
        }
    });

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    checkForSharedJson();
});