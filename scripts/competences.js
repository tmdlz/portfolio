// State management
const skillsState = {};
let totalSkills = 0;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeSkills();
    loadState();
    updateStats();
    addEventListeners();
});

/**
 * Initialize skills tracking
 */
function initializeSkills() {
    const checkboxes = document.querySelectorAll('.skill-checkbox-comp');
    totalSkills = checkboxes.length;
    document.getElementById('total-count').textContent = totalSkills;

    checkboxes.forEach(checkbox => {
        const skillId = checkbox.dataset.skill;
        if (!skillsState[skillId]) {
            skillsState[skillId] = {
                checked: false,
                githubUrl: ''
            };
        }
    });
}

/**
 * Add event listeners to checkboxes
 */
function addEventListeners() {
    const checkboxes = document.querySelectorAll('.skill-checkbox-comp');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            handleCheckboxChange(this);
        });
    });
}

/**
 * Handle checkbox change event
 */
function handleCheckboxChange(checkbox) {
    const skillId = checkbox.dataset.skill;
    const skillItem = checkbox.closest('.skill-item-comp');
    const isChecked = checkbox.checked;

    skillsState[skillId].checked = isChecked;

    if (isChecked) {
        skillItem.classList.add('checked');
        
        // Check if GitHub link already exists
        let githubLink = skillItem.querySelector('.github-link-comp');
        if (!githubLink) {
            // Prompt for GitHub URL
            const url = prompt('Entre l\'URL du projet GitHub pour cette compétence :', 
                              skillsState[skillId].githubUrl || '');
            
            if (url) {
                skillsState[skillId].githubUrl = url;
                addGithubLink(skillItem, url);
            } else {
                // If no URL provided, uncheck
                checkbox.checked = false;
                skillsState[skillId].checked = false;
                skillItem.classList.remove('checked');
            }
        }
    } else {
        skillItem.classList.remove('checked');
        // Remove GitHub link
        const githubLink = skillItem.querySelector('.github-link-comp');
        if (githubLink) {
            githubLink.remove();
        }
    }

    saveState();
    updateStats();
    updateCategoryCount(skillItem);
}

/**
 * Add GitHub link to skill item
 */
function addGithubLink(skillItem, url) {
    const skillContent = skillItem.querySelector('.skill-content-comp');
    
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.className = 'github-link-comp';
    link.innerHTML = `
        <svg viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        Voir sur GitHub
    `;
    
    skillContent.appendChild(link);
}

/**
 * Update statistics display
 */
function updateStats() {
    const validated = Object.values(skillsState).filter(s => s.checked).length;
    const percentage = totalSkills > 0 ? Math.round((validated / totalSkills) * 100) : 0;

    document.getElementById('validated-count').textContent = validated;
    document.getElementById('progress-percent').textContent = percentage + '%';
}

/**
 * Update category count
 */
function updateCategoryCount(skillItem) {
    const category = skillItem.closest('.skill-category-comp');
    const checkboxes = category.querySelectorAll('.skill-checkbox-comp');
    const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
    const total = checkboxes.length;
    
    const countElement = category.querySelector('.category-count-comp');
    countElement.textContent = `${checked}/${total}`;
}

/**
 * Save state to localStorage
 */
function saveState() {
    try {
        localStorage.setItem('skillsTrackerState', JSON.stringify(skillsState));
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
}

/**
 * Load state from localStorage
 */
function loadState() {
    try {
        const saved = localStorage.getItem('skillsTrackerState');
        if (saved) {
            const savedState = JSON.parse(saved);
            Object.assign(skillsState, savedState);

            // Apply saved state to checkboxes
            Object.keys(skillsState).forEach(skillId => {
                const checkbox = document.querySelector(`[data-skill="${skillId}"]`);
                if (checkbox && skillsState[skillId].checked) {
                    checkbox.checked = true;
                    const skillItem = checkbox.closest('.skill-item-comp');
                    skillItem.classList.add('checked');
                    
                    if (skillsState[skillId].githubUrl) {
                        addGithubLink(skillItem, skillsState[skillId].githubUrl);
                    }
                }
            });

            // Update all category counts
            document.querySelectorAll('.skill-category-comp').forEach(category => {
                const checkboxes = category.querySelectorAll('.skill-checkbox-comp');
                const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
                const total = checkboxes.length;
                category.querySelector('.category-count-comp').textContent = `${checked}/${total}`;
            });
        }
    } catch (e) {
        console.error('Error loading from localStorage:', e);
    }
}

/**
 * Export progress (optional feature)
 */
function exportProgress() {
    const dataStr = JSON.stringify(skillsState, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'competences-progress.json';
    link.click();
    URL.revokeObjectURL(url);
}

// Expose exportProgress to global scope if needed
window.exportProgress = exportProgress;
