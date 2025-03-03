popup.js
document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const classesContainer = document.getElementById('classes-container');
  const addClassBtn = document.getElementById('add-class-btn');
  const editModeBtn = document.getElementById('edit-mode-btn');
  const addClassForm = document.getElementById('add-class-form');
  const classNameInput = document.getElementById('class-name');
  const classUrlInput = document.getElementById('class-url');
  const saveClassBtn = document.getElementById('save-class-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  
  let isEditMode = false;
  
  // Load classes from storage
  loadClasses();
  
  // Button event listeners
  addClassBtn.addEventListener('click', showAddClassForm);
  editModeBtn.addEventListener('click', toggleEditMode);
  saveClassBtn.addEventListener('click', saveClass);
  cancelBtn.addEventListener('click', hideAddClassForm);
  
  // Load classes from Chrome storage
  function loadClasses() {
    chrome.storage.sync.get('classes', function(data) {
      const classes = data.classes || getDefaultClasses();
      renderClasses(classes);
      
      // Save default classes if none exist
      if (!data.classes) {
        chrome.storage.sync.set({ 'classes': classes });
      }
    });
  }
  
  // Default classes for first-time users
  function getDefaultClasses() {
    return [
      { name: "Computer Science 101", url: "https://example.com/cs101" },
      { name: "Mathematics 202", url: "https://example.com/math202" },
      { name: "Physics 110", url: "https://example.com/physics110" },
      { name: "English Literature", url: "https://example.com/english" }
    ];
  }
  
  // Render classes in the popup
  function renderClasses(classes) {
    classesContainer.innerHTML = '';
    
    classes.forEach(function(classItem, index) {
      const classElement = document.createElement('div');
      classElement.className = 'class-item';
      classElement.innerHTML = `
        <span class="class-name">${classItem.name}</span>
        <button class="delete-btn" data-index="${index}">Delete</button>
      `;
      
      // Open URL when clicked (unless in edit mode)
      classElement.addEventListener('click', function(e) {
        if (!isEditMode && e.target.className !== 'delete-btn') {
          chrome.tabs.create({ url: classItem.url });
        }
      });
      
      classesContainer.appendChild(classElement);
    });
    
    // Add delete button event listeners
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        deleteClass(index);
      });
    });
  }
  
  // Toggle edit mode
  function toggleEditMode() {
    isEditMode = !isEditMode;
    
    if (isEditMode) {
      document.body.classList.add('edit-mode');
      editModeBtn.textContent = 'Done Editing';
    } else {
      document.body.classList.remove('edit-mode');
      editModeBtn.textContent = 'Edit Mode';
    }
  }
  
  // Show the add class form
  function showAddClassForm() {
    addClassForm.classList.remove('hidden');
    addClassBtn.classList.add('hidden');
    editModeBtn.classList.add('hidden');
    classNameInput.focus();
  }
  
  // Hide the add class form
  function hideAddClassForm() {
    addClassForm.classList.add('hidden');
    addClassBtn.classList.remove('hidden');
    editModeBtn.classList.remove('hidden');
    classNameInput.value = '';
    classUrlInput.value = '';
  }
  
  // Save a new class
  function saveClass() {
    const name = classNameInput.value.trim();
    let url = classUrlInput.value.trim();
    
    if (name === '' || url === '') {
      return;
    }
    
    // Add http:// if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    chrome.storage.sync.get('classes', function(data) {
      const classes = data.classes || [];
      classes.push({ name, url });
      
      chrome.storage.sync.set({ 'classes': classes }, function() {
        renderClasses(classes);
        hideAddClassForm();
      });
    });
  }
  
  // Delete a class
  function deleteClass(index) {
    chrome.storage.sync.get('classes', function(data) {
      const classes = data.classes || [];
      classes.splice(index, 1);
      
      chrome.storage.sync.set({ 'classes': classes }, function() {
        renderClasses(classes);
      });
    });
  }
});