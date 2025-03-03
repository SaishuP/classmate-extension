document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const openSidePanelBtn = document.getElementById('open-side-panel');
    const addCurrentPageBtn = document.getElementById('add-current-page');
    const recentClassesList = document.getElementById('recent-classes-list');
    
    // Event listeners
    openSidePanelBtn.addEventListener('click', openSidePanel);
    addCurrentPageBtn.addEventListener('click', addCurrentPage);
    
    // Load recent classes
    loadRecentClasses();
    
    // Functions
    function openSidePanel() {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.runtime.sendMessage({ action: 'openSidePanel' }, function(response) {
          if (response && response.success) {
            window.close(); // Close the popup
          }
        });
      });
    }
    
    function addCurrentPage() {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const currentTab = tabs[0];
        const pageTitle = currentTab.title || 'New Class';
        const pageUrl = currentTab.url;
        
        chrome.storage.sync.get('classes', function(data) {
          const classes = data.classes || [];
          const newClass = {
            id: Date.now().toString(36) + Math.random().toString(36).substring(2),
            name: pageTitle,
            url: pageUrl
          };
          
          classes.push(newClass);
          
          chrome.storage.sync.set({ 'classes': classes }, function() {
            // Show confirmation
            addCurrentPageBtn.textContent = 'Added!';
            setTimeout(() => {
              addCurrentPageBtn.textContent = 'Add Current Page as Class';
            }, 2000);
            
            // Refresh recent classes
            loadRecentClasses();
          });
        });
      });
    }
    
    function loadRecentClasses() {
      chrome.storage.sync.get('classes', function(data) {
        const classes = data.classes || [];
        
        // Clear the list
        recentClassesList.innerHTML = '';
        
        // Display up to 3 most recent classes
        const recentClasses = classes.slice(-3).reverse();
        
        if (recentClasses.length === 0) {
          recentClassesList.innerHTML = '<p class="empty-message">No classes added yet</p>';
          return;
        }
        
        recentClasses.forEach(function(classItem) {
          const classButton = document.createElement('button');
          classButton.className = 'class-button';
          classButton.textContent = classItem.name;
          classButton.dataset.id = classItem.id;
          classButton.dataset.url = classItem.url;
          
          classButton.addEventListener('click', function() {
            // Navigate to the class URL
            chrome.tabs.create({ url: classItem.url });
            window.close(); // Close the popup
          });
          
          recentClassesList.appendChild(classButton);
        });
      });
    }
  });