document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    initializeTiers();
    initializeFormQuestions();
    setupEventListeners();
});

function initializeTiers() {
    console.log('Initializing tiers');
    const tiersSection = document.getElementById('tiersSection');
    
    if (!tiersSection) {
        console.error('tiersSection not found');
        return;
    }
    
    if (!config || !config.tiers) {
        console.error('config or config.tiers not found');
        return;
    }
    
    let selectedTierId = null;  // Track selected tier
    
    config.tiers.forEach(tier => {
        const tierElement = document.createElement('div');
        tierElement.className = 'box';
        tierElement.dataset.tierId = tier.id;
        
        // Create container for content
        const contentDiv = document.createElement('div');
        contentDiv.className = 'tier-content';
        contentDiv.innerHTML = `
            <button class="info-button" aria-label="Show tier details">
                <i class="fas fa-info-circle"></i>
            </button>
            <h3 class="title">${tier.title}</h3>
            <p>${tier.description}</p>
            <p class="price">$${tier.price.toLocaleString()}</p>
            <button class="button is-primary is-fullwidth" data-tier-id="${tier.id}">
                Select
            </button>
        `;
        
        // Create overlay element and append to body
        const overlay = document.createElement('div');
        overlay.className = 'tier-overlay';
        overlay.id = `overlay-${tier.id}`;  // Add unique ID
        overlay.innerHTML = `
            <div class="tier-overlay-content">
                <button class="close-button" aria-label="Close overlay">
                    <i class="fas fa-times"></i>
                </button>
                <h3 class="title">${tier.title}</h3>
                <p class="price">$${tier.price.toLocaleString()}</p>
                <p class="description">${tier.description}</p>
                <h4 class="subtitle">Package Includes:</h4>
                <ul>
                    ${tier.inclusions.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        `;
        document.body.appendChild(overlay);
        
        // Create and configure pixel-canvas
        const pixelCanvas = document.createElement('pixel-canvas');
        switch(tier.id) {
            case 'tier1': // Rare
                pixelCanvas.dataset.colors = '#0081ff,#66b1ff,#99ccff';
                pixelCanvas.dataset.gap = '10';
                pixelCanvas.dataset.speed = '70';
                break;
            case 'tier2': // Epic
                pixelCanvas.dataset.colors = '#c838f1,#d97ef4,#e9b3f8';
                pixelCanvas.dataset.gap = '7';
                pixelCanvas.dataset.speed = '50';
                break;
            case 'tier3': // Legendary
                pixelCanvas.dataset.colors = '#ffb300,#ffc94d,#ffdb80';
                pixelCanvas.dataset.gap = '5';
                pixelCanvas.dataset.speed = '30';
                break;
            case 'tier4': // Mythic
                pixelCanvas.dataset.colors = '#ff2e2e,#ff7575,#ffb3b3';
                pixelCanvas.dataset.gap = '2';
                pixelCanvas.dataset.speed = '20';
                break;
        }
        
        // Add pixel-canvas as first child of tierElement
        tierElement.prepend(pixelCanvas);
        tierElement.appendChild(contentDiv);
        tiersSection.appendChild(tierElement);
        
        // Add click handler for selection
        const selectButton = tierElement.querySelector('button[data-tier-id]');
        selectButton.addEventListener('click', () => {
            // Remove selected class from all containers
            document.querySelectorAll('.box').forEach(box => {
                box.classList.remove('is-selected');
                const canvas = box.querySelector('pixel-canvas');
                if (canvas) {
                    canvas.dispatchEvent(new Event('mouseleave'));
                }
            });
            
            // Add selected class to clicked container
            tierElement.classList.add('is-selected');
            pixelCanvas.dispatchEvent(new Event('mouseenter'));
            
            // Update selected tier and refresh form
            selectedTierId = tier.id;
            document.body.dataset.selectedTier = selectedTierId;
            updateFormVisibility(selectedTierId);
            
            // Update summary
            updateSummary();
        });
        
        // Add info button click handler
        const infoButton = contentDiv.querySelector('.info-button');
        const closeButton = overlay.querySelector('.close-button');
        
        infoButton.addEventListener('click', (e) => {
            e.stopPropagation();
            // Hide any other active overlays first
            document.querySelectorAll('.tier-overlay.is-active').forEach(el => {
                el.classList.remove('is-active');
            });
            overlay.classList.add('is-active');
            document.body.style.overflow = 'hidden';
        });
        
        closeButton.addEventListener('click', () => {
            overlay.classList.remove('is-active');
            document.body.style.overflow = '';
        });
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('is-active');
                document.body.style.overflow = '';
            }
        });
    });
}

function updateFormVisibility(selectedTierId) {
    if (!selectedTierId) {
        // If no tier selected, hide all questions
        document.querySelectorAll('.form-question').forEach(questionElement => {
            questionElement.style.display = 'none';
        });
        document.querySelector('.form-section').classList.remove('is-visible');
        const header = document.querySelector('.selected-tier-header');
        if (header) header.remove();
        return;
    }

    // Get the selected tier details
    const selectedTier = config.tiers.find(t => t.id === selectedTierId);
    
    // Create or update the tier header
    let header = document.querySelector('.selected-tier-header');
    if (!header) {
        header = document.createElement('div');
        header.className = 'selected-tier-header';
        document.getElementById('formSection').insertBefore(header, document.querySelector('.form-questions-container'));
    }
    
    header.dataset.tierId = selectedTierId;
    header.innerHTML = `
        <h3 class="title is-4">${selectedTier.title} Package Options</h3>
        <p class="subtitle is-6">Configure your ${selectedTier.title.toLowerCase()} package options below</p>
        <div class="inclusions">
            <p class="inclusions-title">Your selected package includes:</p>
            <ul class="inclusions-list">
                ${selectedTier.inclusions.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
    `;

    // Make header visible after a short delay
    setTimeout(() => {
        header.classList.add('is-visible');
    }, 100);

    // Show the form section
    const formSection = document.querySelector('.form-section');
    formSection.classList.add('is-visible');

    // Scroll the form section into view
    setTimeout(() => {
        // Get the header height for offset calculation
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const optionsBarHeight = document.querySelector('.options-bar').offsetHeight;
        const totalOffset = navbarHeight + optionsBarHeight + 20; // 20px extra padding
        
        // Scroll to form section with offset
        const formSectionTop = formSection.getBoundingClientRect().top + window.pageYOffset - totalOffset;
        window.scrollTo({
            top: formSectionTop,
            behavior: 'smooth'
        });
    }, 100);

    // Show/hide questions based on selected tier
    config.formQuestions.forEach(question => {
        const questionElement = document.getElementById(`form-${question.id}`);
        if (!questionElement) return;

        if (question.availableForTiers.includes(selectedTierId)) {
            questionElement.style.display = '';
            // Add staggered animation delay
            setTimeout(() => {
                questionElement.classList.add('is-visible');
                questionElement.classList.remove('is-hidden');
            }, 200 + Array.from(questionElement.parentNode.children).indexOf(questionElement) * 100);
        } else {
            questionElement.style.display = 'none';  // Hide question
            questionElement.classList.add('is-hidden');
            questionElement.classList.remove('is-visible');
            
            // Reset the value when hiding
            const input = questionElement.querySelector('input, select');
            if (input) {
                if (input.type === 'checkbox') {
                    input.checked = false;
                } else if (input.type === 'range') {
                    input.value = question.default || 0;
                } else {
                    input.value = '';
                }
            }
        }
    });
}

function initializeFormQuestions() {
    const formSection = document.getElementById('formSection');
    
    // Create container for form questions
    const questionsContainer = document.createElement('div');
    questionsContainer.className = 'form-questions-container';
    formSection.appendChild(questionsContainer);
    
    config.formQuestions.forEach(question => {
        const questionElement = document.createElement('div');
        questionElement.className = 'field form-question';
        questionElement.id = `form-${question.id}`;
        questionElement.style.display = 'none';  // Hide initially
        
        switch(question.type) {
            case 'slider':
                questionElement.innerHTML = createSliderHTML(question);
                break;
                
            case 'toggle':
                let toggleHTML = `
                    <label class="checkbox">
                        <input type="checkbox" id="${question.id}"
                               ${question.default ? 'checked' : ''}>
                        ${question.label}
                    </label>
                `;
                
                // Add sub-questions if they exist
                if (question.subQuestions) {
                    toggleHTML += `<div class="sub-questions" id="sub-${question.id}" style="display: none;">`;
                    question.subQuestions.forEach(subQ => {
                        toggleHTML += `
                            <div class="sub-question" id="form-${subQ.id}">
                                ${createQuestionHTML(subQ)}
                            </div>
                        `;
                    });
                    toggleHTML += '</div>';
                }
                
                questionElement.innerHTML = toggleHTML;
                
                // Add event listener for toggle
                setTimeout(() => {
                    const toggleInput = questionElement.querySelector(`#${question.id}`);
                    const subQuestionsDiv = questionElement.querySelector(`#sub-${question.id}`);
                    if (toggleInput && subQuestionsDiv) {
                        toggleInput.addEventListener('change', (e) => {
                            subQuestionsDiv.style.display = e.target.checked ? 'block' : 'none';
                            updateSummary();
                        });
                    }
                }, 0);
                break;
                
            case 'select':
                questionElement.innerHTML = createSelectHTML(question);
                break;
                
            case 'text':
                questionElement.innerHTML = createTextHTML(question);
                break;
        }
        
        questionsContainer.appendChild(questionElement);
    });
}

function setupEventListeners() {
    // Currency buttons
    document.querySelectorAll('.currency-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.currency-btn').forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            updateCurrency(btn.dataset.currency);
        });
    });
    
    // Set USD as default active currency
    document.querySelector('[data-currency="USD"]').classList.add('is-active');
    
    // Import/Export buttons
    document.getElementById('importBtn').addEventListener('click', handleImport);
    document.getElementById('exportBtn').addEventListener('click', handleExport);
    document.getElementById('pdfBtn').addEventListener('click', generatePDF);
    
    // Generate quote button
    document.getElementById('generateQuoteBtn').addEventListener('click', generateQuote);
    
    // Form change events
    document.querySelectorAll('input, select').forEach(element => {
        element.addEventListener('change', updateSummary);
    });
}

function updateCurrency(currency) {
    // Implement currency conversion logic
}

function handleImport() {
    // Implement import logic
}

function handleExport() {
    // Implement export logic
}

function generatePDF() {
    // Implement PDF generation logic
}

function generateQuote() {
    // Implement quote generation logic
}

function updateSummary() {
    const summaryText = document.getElementById('summaryText');
    const summaryTotal = document.getElementById('summaryTotal');
    
    // Only count visible/active form elements
    const selectedCount = document.querySelectorAll('.form-question:not(.is-hidden) input:checked').length;
    summaryText.textContent = `Selected options: ${selectedCount}`;
    
    // Calculate total based on selections
    let total = 0;
    
    // Only include values from visible form elements in calculation
    document.querySelectorAll('.form-question:not(.is-hidden)').forEach(question => {
        const input = question.querySelector('input, select');
        if (input) {
            const questionConfig = config.formQuestions.find(q => q.id === input.id);
            if (questionConfig) {
                if (questionConfig.type === 'toggle' && input.checked) {
                    // Calculate sub-question values if toggle is checked
                    if (questionConfig.subQuestions) {
                        questionConfig.subQuestions.forEach(subQ => {
                            const subInput = document.getElementById(subQ.id);
                            if (subInput && subQ.price) {
                                if (subQ.type === 'slider') {
                                    total += subQ.price * parseInt(subInput.value);
                                } else {
                                    total += subQ.price;
                                }
                            }
                        });
                    }
                }
            }
        }
    });
    
    summaryTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// Helper function to create question HTML based on type
function createQuestionHTML(question) {
    switch(question.type) {
        case 'slider':
            return createSliderHTML(question);
        case 'select':
            return createSelectHTML(question);
        case 'text':
            return createTextHTML(question);
        default:
            return '';
    }
}

function createSliderHTML(question) {
    return `
        <label class="label">${question.label}</label>
        <input type="range" class="slider is-fullwidth" 
               min="${question.min}" max="${question.max}" 
               value="${question.default}"
               id="${question.id}">
        <output for="${question.id}">${question.default}</output>
    `;
}

function createSelectHTML(question) {
    return `
        <label class="label">${question.label}</label>
        <div class="select is-fullwidth">
            <select id="${question.id}">
                ${question.options.map(option => 
                    `<option ${option === question.default ? 'selected' : ''}>
                        ${option}
                    </option>`
                ).join('')}
            </select>
        </div>
    `;
}

function createTextHTML(question) {
    return `
        <label class="label">${question.label}</label>
        <div class="control">
            <input class="input" type="text" id="${question.id}"
                   placeholder="${question.placeholder}">
        </div>
    `;
} 