// ===== Data =====
const TEAM = [
    { initials: 'TK', name: 'Talha Khan', color: '#4F46E5' },
    { initials: 'SM', name: 'Sarah Miller', color: '#10B981' },
    { initials: 'MJ', name: 'Mike Johnson', color: '#F59E0B' },
    { initials: 'EW', name: 'Emily Wang', color: '#EF4444' },
    { initials: 'AR', name: 'Alex Rivera', color: '#8B5CF6' },
];

const COLUMN_COLORS = {
    'todo': '#4F46E5',
    'inprogress': '#F59E0B',
    'inreview': '#8B5CF6',
    'done': '#10B981',
};

let cardIdCounter = 100;

const initialData = {
    todo: {
        title: 'To Do',
        id: 'todo',
        cards: [
            { id: 1, title: 'Design Landing Page', desc: 'Create a modern landing page with hero section, features grid, testimonials carousel and CTA sections.', priority: 'High', labels: ['Frontend', 'Design'], assignee: TEAM[3], due: '2026-04-18', comments: [
                { author: TEAM[0], text: 'Let\'s use the new design system for this.', time: '1 day ago' },
                { author: TEAM[3], text: 'I\'ll start with the wireframes first.', time: '5 hours ago' }
            ]},
            { id: 2, title: 'Set Up CI/CD Pipeline', desc: 'Configure GitHub Actions for automated testing and deployment to staging and production environments.', priority: 'Medium', labels: ['DevOps'], assignee: TEAM[4], due: '2026-04-22', comments: [] },
            { id: 3, title: 'User Authentication Flow', desc: 'Implement login, registration, password reset and email verification using JWT tokens.', priority: 'High', labels: ['Backend', 'Feature'], assignee: TEAM[0], due: '2026-04-15', comments: [
                { author: TEAM[2], text: 'Should we use OAuth as well?', time: '2 days ago' }
            ]},
            { id: 4, title: 'Write Unit Tests for API', desc: 'Add comprehensive unit tests for all REST API endpoints with edge case coverage.', priority: 'Low', labels: ['Backend'], assignee: TEAM[2], due: '2026-04-25', comments: [] },
            { id: 5, title: 'Mobile Responsive Fixes', desc: 'Fix layout issues on mobile devices for the dashboard and settings pages.', priority: 'Medium', labels: ['Frontend', 'Bug'], assignee: TEAM[1], due: '2026-04-20', comments: [] },
        ]
    },
    inprogress: {
        title: 'In Progress',
        id: 'inprogress',
        cards: [
            { id: 6, title: 'API Integration Layer', desc: 'Build the REST API integration service with error handling, retry logic and request caching.', priority: 'High', labels: ['Backend', 'Feature'], assignee: TEAM[0], due: '2026-04-14', comments: [
                { author: TEAM[1], text: 'The caching layer is almost done.', time: '3 hours ago' }
            ]},
            { id: 7, title: 'Dashboard Analytics Widget', desc: 'Create interactive charts and KPI cards for the main dashboard using Chart.js.', priority: 'Medium', labels: ['Frontend', 'Feature'], assignee: TEAM[3], due: '2026-04-17', comments: [] },
            { id: 8, title: 'Database Schema Migration', desc: 'Migrate legacy database schema to the new normalized structure with zero downtime.', priority: 'High', labels: ['Backend', 'DevOps'], assignee: TEAM[2], due: '2026-04-13', comments: [
                { author: TEAM[0], text: 'Make sure to backup before running migrations.', time: '1 day ago' },
                { author: TEAM[2], text: 'Already set up automated backups.', time: '6 hours ago' }
            ]},
            { id: 9, title: 'Search Functionality', desc: 'Implement full-text search with filters, sorting, and autocomplete suggestions.', priority: 'Medium', labels: ['Frontend', 'Backend'], assignee: TEAM[1], due: '2026-04-19', comments: [] },
        ]
    },
    inreview: {
        title: 'In Review',
        id: 'inreview',
        cards: [
            { id: 10, title: 'Payment Gateway Integration', desc: 'Integrate Stripe payment processing with subscription management and webhook handling.', priority: 'High', labels: ['Backend', 'Feature'], assignee: TEAM[4], due: '2026-04-12', comments: [
                { author: TEAM[0], text: 'Looks good, just a few minor changes needed.', time: '30 min ago' }
            ]},
            { id: 11, title: 'Fix Navigation Bug', desc: 'Resolve the sidebar navigation state persistence issue when switching between routes.', priority: 'Medium', labels: ['Frontend', 'Bug'], assignee: TEAM[1], due: '2026-04-11', comments: [] },
            { id: 12, title: 'Email Notification Service', desc: 'Set up transactional email service with templates for welcome, reset password, and alerts.', priority: 'Low', labels: ['Backend'], assignee: TEAM[2], due: '2026-04-16', comments: [] },
        ]
    },
    done: {
        title: 'Done',
        id: 'done',
        cards: [
            { id: 13, title: 'Project Setup & Scaffolding', desc: 'Initialize project structure with build tools, linting, formatting and folder conventions.', priority: 'Low', labels: ['DevOps'], assignee: TEAM[0], due: '2026-04-05', comments: [] },
            { id: 14, title: 'Design System Components', desc: 'Build reusable UI component library including buttons, inputs, modals, cards and typography.', priority: 'High', labels: ['Frontend', 'Design'], assignee: TEAM[3], due: '2026-04-08', comments: [
                { author: TEAM[0], text: 'Great work on the component library!', time: '3 days ago' }
            ]},
            { id: 15, title: 'User Profile Page', desc: 'Create user profile page with avatar upload, bio editing and account settings.', priority: 'Medium', labels: ['Frontend', 'Feature'], assignee: TEAM[1], due: '2026-04-10', comments: [] },
            { id: 16, title: 'Fix Login Redirect Loop', desc: 'Resolved infinite redirect loop when accessing protected routes without authentication.', priority: 'High', labels: ['Bug', 'Backend'], assignee: TEAM[4], due: '2026-04-06', comments: [] },
        ]
    }
};

let boardData = JSON.parse(JSON.stringify(initialData));
let currentFilter = { label: 'all', priority: 'all', search: '' };
let currentModalCardId = null;
let addCardColumnId = null;

// ===== Render Board =====
function renderBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';

    for (const colId of ['todo', 'inprogress', 'inreview', 'done']) {
        const col = boardData[colId];
        const filteredCards = col.cards.filter(card => {
            const labelOk = currentFilter.label === 'all' || card.labels.includes(currentFilter.label);
            const priorityOk = currentFilter.priority === 'all' || card.priority === currentFilter.priority;
            const searchOk = currentFilter.search === '' ||
                card.title.toLowerCase().includes(currentFilter.search) ||
                card.desc.toLowerCase().includes(currentFilter.search);
            return labelOk && priorityOk && searchOk;
        });

        const colEl = document.createElement('div');
        colEl.className = 'column';
        colEl.dataset.column = colId;
        colEl.addEventListener('dragover', handleDragOver);
        colEl.addEventListener('dragleave', handleDragLeave);
        colEl.addEventListener('drop', handleDrop);

        colEl.innerHTML = `
            <div class="column-header">
                <div class="column-header-left">
                    <div class="column-color" style="background:${COLUMN_COLORS[colId]}"></div>
                    <span class="column-title">${col.title}</span>
                    <span class="column-count">${filteredCards.length}</span>
                </div>
            </div>
            <div class="column-cards" data-column="${colId}">
                ${filteredCards.map(card => renderCard(card)).join('')}
            </div>
            <div class="column-footer">
                <button class="add-card-btn" onclick="openAddCard('${colId}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Card
                </button>
            </div>
        `;
        board.appendChild(colEl);
    }

    // Re-attach drag events to cards
    document.querySelectorAll('.card').forEach(cardEl => {
        cardEl.addEventListener('dragstart', handleDragStart);
        cardEl.addEventListener('dragend', handleDragEnd);
    });
}

function renderCard(card) {
    const today = new Date().toISOString().split('T')[0];
    const overdue = card.due && card.due < today;
    const priorityBarColors = { High: '#EF4444', Medium: '#F59E0B', Low: '#10B981' };

    return `
        <div class="card" draggable="true" data-id="${card.id}" onclick="openCardModal(${card.id})">
            <div class="card-priority-bar" style="background:${priorityBarColors[card.priority]}"></div>
            <div class="card-labels">
                ${card.labels.map(l => `<span class="card-label label-${l}">${l}</span>`).join('')}
            </div>
            <div class="card-title">${card.title}</div>
            <div class="card-desc">${card.desc}</div>
            <div class="card-footer">
                <div class="card-footer-left">
                    <span class="priority-badge priority-${card.priority}">${card.priority}</span>
                    ${card.due ? `<span class="card-due ${overdue ? 'overdue' : ''}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        ${formatDate(card.due)}
                    </span>` : ''}
                </div>
                <div class="card-assignee" style="background:${card.assignee.color}" title="${card.assignee.name}">
                    ${card.assignee.initials}
                </div>
            </div>
        </div>
    `;
}

function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ===== Drag & Drop =====
let draggedCardId = null;
let draggedFromColumn = null;

function handleDragStart(e) {
    draggedCardId = parseInt(e.target.dataset.id);
    draggedFromColumn = e.target.closest('.column').dataset.column;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', draggedCardId);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.column').forEach(c => c.classList.remove('drag-over'));
    draggedCardId = null;
    draggedFromColumn = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const col = e.target.closest('.column');
    if (col) col.classList.add('drag-over');
}

function handleDragLeave(e) {
    const col = e.target.closest('.column');
    if (col && !col.contains(e.relatedTarget)) {
        col.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    e.preventDefault();
    const col = e.target.closest('.column');
    if (!col) return;
    col.classList.remove('drag-over');
    const targetColumn = col.dataset.column;

    if (draggedCardId === null || !draggedFromColumn) return;
    if (draggedFromColumn === targetColumn) return;

    // Find and move card
    const sourceCards = boardData[draggedFromColumn].cards;
    const cardIndex = sourceCards.findIndex(c => c.id === draggedCardId);
    if (cardIndex === -1) return;

    const [card] = sourceCards.splice(cardIndex, 1);

    // Determine insert position based on mouse Y
    const cardsContainer = col.querySelector('.column-cards');
    const cardElements = [...cardsContainer.querySelectorAll('.card:not(.dragging)')];
    let insertIndex = cardElements.length;

    for (let i = 0; i < cardElements.length; i++) {
        const rect = cardElements[i].getBoundingClientRect();
        if (e.clientY < rect.top + rect.height / 2) {
            insertIndex = boardData[targetColumn].cards.findIndex(
                c => c.id === parseInt(cardElements[i].dataset.id)
            );
            break;
        }
    }

    boardData[targetColumn].cards.splice(insertIndex, 0, card);
    renderBoard();
}

// ===== Card Detail Modal =====
function findCard(id) {
    for (const colId of ['todo', 'inprogress', 'inreview', 'done']) {
        const card = boardData[colId].cards.find(c => c.id === id);
        if (card) return { card, colId };
    }
    return null;
}

function openCardModal(id) {
    const result = findCard(id);
    if (!result) return;
    const { card, colId } = result;
    currentModalCardId = id;

    document.getElementById('modalTitle').textContent = card.title;
    document.getElementById('modalColumn').textContent = boardData[colId].title;
    document.getElementById('modalDescription').textContent = card.desc;
    document.getElementById('modalDueDate').value = card.due || '';

    // Priority
    document.getElementById('modalPriority').innerHTML =
        `<span class="priority-badge priority-${card.priority}">${card.priority}</span>`;

    // Assignees
    document.getElementById('modalAssignees').innerHTML =
        `<div class="member-avatar" style="background:${card.assignee.color}" title="${card.assignee.name}">${card.assignee.initials}</div>
         <span style="font-size:.82rem;color:#475569;">${card.assignee.name}</span>`;

    // Labels
    document.getElementById('modalLabels').innerHTML =
        card.labels.map(l => `<span class="card-label label-${l}">${l}</span>`).join('');

    // Comments
    renderComments(card);

    // Activity
    document.getElementById('modalActivity').innerHTML = `
        <div class="activity-item">
            <span class="member-avatar small" style="background:${card.assignee.color}">${card.assignee.initials}</span>
            <div><strong>${card.assignee.name}</strong> was assigned to this task <small>2 days ago</small></div>
        </div>
        <div class="activity-item">
            <span class="member-avatar small" style="background:#4F46E5">TK</span>
            <div><strong>Talha Khan</strong> created this task <small>5 days ago</small></div>
        </div>
        <div class="activity-item">
            <span class="member-avatar small" style="background:#4F46E5">TK</span>
            <div><strong>Talha Khan</strong> moved this to <strong>${boardData[colId].title}</strong> <small>3 days ago</small></div>
        </div>
    `;

    document.getElementById('modalOverlay').classList.add('show');
}

function renderComments(card) {
    const container = document.getElementById('modalComments');
    if (card.comments.length === 0) {
        container.innerHTML = '<p style="font-size:.82rem;color:#94A3B8;">No comments yet.</p>';
    } else {
        container.innerHTML = card.comments.map(c => `
            <div class="comment">
                <span class="member-avatar small" style="background:${c.author.color}">${c.author.initials}</span>
                <div class="comment-body">
                    <strong>${c.author.name}</strong> <small>${c.time}</small>
                    <p>${c.text}</p>
                </div>
            </div>
        `).join('');
    }
}

function addComment() {
    const input = document.getElementById('commentInput');
    const text = input.value.trim();
    if (!text || !currentModalCardId) return;

    const result = findCard(currentModalCardId);
    if (!result) return;

    result.card.comments.push({
        author: TEAM[0],
        text: text,
        time: 'Just now'
    });

    renderComments(result.card);
    input.value = '';
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('show');
    currentModalCardId = null;
}

function deleteCurrentCard() {
    if (!currentModalCardId) return;
    for (const colId of ['todo', 'inprogress', 'inreview', 'done']) {
        const idx = boardData[colId].cards.findIndex(c => c.id === currentModalCardId);
        if (idx !== -1) {
            boardData[colId].cards.splice(idx, 1);
            break;
        }
    }
    closeModal();
    renderBoard();
}

// ===== Add Card =====
function openAddCard(colId) {
    addCardColumnId = colId;
    document.getElementById('addCardForm').reset();
    document.getElementById('addCardOverlay').classList.add('show');
}

function closeAddCard() {
    document.getElementById('addCardOverlay').classList.remove('show');
    addCardColumnId = null;
}

function submitNewCard(e) {
    e.preventDefault();
    if (!addCardColumnId) return;

    const title = document.getElementById('newCardTitle').value.trim();
    const desc = document.getElementById('newCardDesc').value.trim();
    const priority = document.getElementById('newCardPriority').value;
    const due = document.getElementById('newCardDue').value;
    const assigneeSelect = document.getElementById('newCardAssignee');
    const assigneeInitials = assigneeSelect.value;
    const assignee = TEAM.find(t => t.initials === assigneeInitials) || TEAM[0];

    const labels = [];
    document.querySelectorAll('#addCardForm .checkbox-group input:checked').forEach(cb => {
        labels.push(cb.value);
    });

    if (!title) return;

    cardIdCounter++;
    boardData[addCardColumnId].cards.push({
        id: cardIdCounter,
        title,
        desc: desc || 'No description provided.',
        priority,
        labels: labels.length ? labels : ['Feature'],
        assignee,
        due: due || '',
        comments: []
    });

    closeAddCard();
    renderBoard();
}

// ===== Filters =====
function filterByLabel(label, btn) {
    currentFilter.label = label;
    document.querySelectorAll('.label-filters [data-label]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderBoard();
}

function filterByPriority(priority, btn) {
    currentFilter.priority = priority;
    document.querySelectorAll('.label-filters [data-priority]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderBoard();
}

function filterBySearch() {
    currentFilter.search = document.getElementById('searchInput').value.trim().toLowerCase();
    renderBoard();
}

// ===== Dropdown =====
function toggleDropdown(menuId) {
    const menu = document.getElementById(menuId);
    const wasOpen = menu.classList.contains('show');

    // Close all dropdowns
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));

    if (!wasOpen) menu.classList.add('show');
}

function selectProject(el, e) {
    e.preventDefault();
    document.querySelectorAll('#projectDropdownMenu .dropdown-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
    document.querySelector('.project-dropdown-btn span').textContent = el.textContent;
    document.getElementById('projectDropdownMenu').classList.remove('show');
}

// Close dropdowns on outside click
document.addEventListener('click', (e) => {
    if (!e.target.closest('.project-dropdown') && !e.target.closest('.nav-icon-btn')) {
        document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
    }
});

// Close modals on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeAddCard();
    }
});

// Prevent card click when dragging
document.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (card && card.classList.contains('dragging')) {
        e.stopPropagation();
        e.preventDefault();
    }
});

// ===== Init =====
renderBoard();
