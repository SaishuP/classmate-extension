document.addEventListener('DOMContentLoaded', function() {
    // DOM elements - Main View
    const mainView = document.getElementById('main-view');
    const classesContainer = document.getElementById('classes-container');
    const addClassBtn = document.getElementById('add-class-btn');
    const editModeBtn = document.getElementById('edit-mode-btn');
    const addClassForm = document.getElementById('add-class-form');
    const classNameInput = document.getElementById('class-name');
    const classUrlInput = document.getElementById('class-url');
    const saveClassBtn = document.getElementById('save-class-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    
    // DOM elements - Class Detail View
    const classDetailView = document.getElementById('class-detail-view');
    const backBtn = document.getElementById('back-btn');
    const classDetailTitle = document.getElementById('class-detail-title');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // DOM elements - Assignments Tab
    const assignmentsTab = document.getElementById('assignments-tab');
    const assignmentsList = document.getElementById('assignments-list');
    const addAssignmentBtn = document.getElementById('add-assignment-btn');
    const addAssignmentForm = document.getElementById('add-assignment-form');
    const assignmentTitleInput = document.getElementById('assignment-title');
    const assignmentDueDateInput = document.getElementById('assignment-due-date');
    const assignmentDescriptionInput = document.getElementById('assignment-description');
    const saveAssignmentBtn = document.getElementById('save-assignment-btn');
    const cancelAssignmentBtn = document.getElementById('cancel-assignment-btn');
    
    // DOM elements - AI Chat Tab
    const aiChatTab = document.getElementById('ai-chat-tab');
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendMessageBtn = document.getElementById('send-message-btn');
    
    // DOM elements - Assignment Detail View
    const assignmentDetailView = document.getElementById('assignment-detail-view');
    const backToAssignmentsBtn = document.getElementById('back-to-assignments-btn');
    const assignmentDetailTitle = document.getElementById('assignment-detail-title');
    const assignmentDetailContent = document.getElementById('assignment-detail-content');
    const questionsList = document.getElementById('questions-list');
    const addQuestionBtn = document.getElementById('add-question-btn');
    const addQuestionForm = document.getElementById('add-question-form');
    const questionTextInput = document.getElementById('question-text');
    const postQuestionBtn = document.getElementById('post-question-btn');
    const cancelQuestionBtn = document.getElementById('cancel-question-btn');
    
    // DOM elements - Question Discussion View
    const questionDiscussionView = document.getElementById('question-discussion-view');
    const backToAssignmentBtn = document.getElementById('back-to-assignment-btn');
    const questionDiscussionTitle = document.getElementById('question-discussion-title');
    const questionContent = document.getElementById('question-content');
    const discussionMessages = document.getElementById('discussion-messages');
    const discussionMessageInput = document.getElementById('discussion-message-input');
    const sendDiscussionBtn = document.getElementById('send-discussion-btn');
    
    // State variables
    let isEditMode = false;
    let currentClassId = null;
    let currentAssignmentId = null;
    let currentQuestionId = null;
    
    // Load classes from storage
    loadClasses();
    
    // Main View event listeners
    addClassBtn.addEventListener('click', showAddClassForm);
    editModeBtn.addEventListener('click', toggleEditMode);
    saveClassBtn.addEventListener('click', saveClass);
    cancelBtn.addEventListener('click', hideAddClassForm);
    
    // Class Detail View event listeners
    backBtn.addEventListener('click', showMainView);
    tabButtons.forEach(button => {
      button.addEventListener('click', () => switchTab(button.dataset.tab));
    });
    
    // Assignments Tab event listeners
    addAssignmentBtn.addEventListener('click', showAddAssignmentForm);
    saveAssignmentBtn.addEventListener('click', saveAssignment);
    cancelAssignmentBtn.addEventListener('click', hideAddAssignmentForm);
    
    // AI Chat Tab event listeners
    sendMessageBtn.addEventListener('click', sendChatMessage);
    messageInput.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendChatMessage();
      }
    });
    
    // Assignment Detail View event listeners
    backToAssignmentsBtn.addEventListener('click', showAssignmentsTab);
    addQuestionBtn.addEventListener('click', showAddQuestionForm);
    postQuestionBtn.addEventListener('click', postQuestion);
    cancelQuestionBtn.addEventListener('click', hideAddQuestionForm);
    
    // Question Discussion View event listeners
    backToAssignmentBtn.addEventListener('click', showAssignmentDetail);
    sendDiscussionBtn.addEventListener('click', sendDiscussionMessage);
    discussionMessageInput.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendDiscussionMessage();
      }
    });
    
    // Navigation functions
    function showMainView() {
      mainView.classList.remove('hidden');
      classDetailView.classList.add('hidden');
      assignmentDetailView.classList.add('hidden');
      questionDiscussionView.classList.add('hidden');
      currentClassId = null;
    }
    
    function showClassDetail(classId) {
      const classes = getClasses();
      const classItem = classes.find(c => c.id === classId);
      
      if (classItem) {
        currentClassId = classId;
        classDetailTitle.textContent = classItem.name;
        
        mainView.classList.add('hidden');
        classDetailView.classList.remove('hidden');
        assignmentDetailView.classList.add('hidden');
        questionDiscussionView.classList.add('hidden');
        
        // Show assignments tab by default
        switchTab('assignments');
        loadAssignments(classId);
      }
    }
    
    function showAssignmentsTab() {
      assignmentDetailView.classList.add('hidden');
      questionDiscussionView.classList.add('hidden');
      assignmentsTab.classList.remove('hidden');
      
      // Reset current selections
      currentAssignmentId = null;
      currentQuestionId = null;
      
      switchTab('assignments');
    }
    
    function showAssignmentDetail(assignmentId) {
      if (!assignmentId && currentAssignmentId) {
        assignmentId = currentAssignmentId;
      }
      
      const assignments = getAssignments(currentClassId);
      const assignment = assignments.find(a => a.id === assignmentId);
      
      if (assignment) {
        currentAssignmentId = assignmentId;
        assignmentDetailTitle.textContent = assignment.title;
        
        // Format due date
        const dueDate = new Date(assignment.dueDate);
        const formattedDate = dueDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        
        assignmentDetailContent.innerHTML = `
          <div class="assignment-info">
            <p><strong>Due Date:</strong> ${formattedDate}</p>
            <p><strong>Description:</strong></p>
            <p>${assignment.description || 'No description provided.'}</p>
          </div>
        `;
        
        assignmentsTab.classList.add('hidden');
        assignmentDetailView.classList.remove('hidden');
        
        loadQuestions(assignmentId);
      }
    }
    
    function showQuestionDiscussion(questionId) {
      const questions = getQuestions(currentAssignmentId);
      const question = questions.find(q => q.id === questionId);
      
      if (question) {
        currentQuestionId = questionId;
        questionDiscussionTitle.textContent = question.text.substring(0, 50) + (question.text.length > 50 ? '...' : '');
        
        // Format date
        const timestamp = new Date(question.timestamp);
        const formattedDate = timestamp.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        questionContent.innerHTML = `
          <div class="question-info">
            <p class="question-text">${question.text}</p>
            <p class="question-meta">Asked by ${question.author || 'Anonymous'} on ${formattedDate}</p>
          </div>
        `;
        
        assignmentDetailView.classList.add('hidden');
        questionDiscussionView.classList.remove('hidden');
        
        loadDiscussionMessages(questionId);
      }
    }
    
    // Tab switching
    function switchTab(tabName) {
      // Update tab buttons
      tabButtons.forEach(button => {
        if (button.dataset.tab === tabName) {
          button.classList.add('active');
        } else {
          button.classList.remove('active');
        }
      });
      
      // Update tab contents
      tabContents.forEach(content => {
        if (content.id === `${tabName}-tab`) {
          content.classList.add('active');
          content.classList.remove('hidden');
        } else {
          content.classList.remove('active');
          content.classList.add('hidden');
        }
      });
      
      // Load content based on tab
      if (tabName === 'assignments') {
        loadAssignments(currentClassId);
      } else if (tabName === 'ai-chat') {
        loadChatMessages(currentClassId);
      }
    }
    
    // Edit mode toggle
    function toggleEditMode() {
      isEditMode = !isEditMode;
      
      if (isEditMode) {
        document.body.classList.add('edit-mode');
        editModeBtn.textContent = 'Done Editing';
      } else {
        document.body.classList.remove('edit-mode');
        editModeBtn.textContent = 'Edit Mode';
      }
      
      // Reload classes to update UI
      loadClasses();
    }
    
    // Form visibility functions
    function showAddClassForm() {
      addClassForm.classList.remove('hidden');
      classNameInput.focus();
    }
    
    function hideAddClassForm() {
      addClassForm.classList.add('hidden');
      classNameInput.value = '';
      classUrlInput.value = '';
    }
    
    function showAddAssignmentForm() {
      addAssignmentForm.classList.remove('hidden');
      assignmentTitleInput.focus();
    }
    
    function hideAddAssignmentForm() {
      addAssignmentForm.classList.add('hidden');
      assignmentTitleInput.value = '';
      assignmentDueDateInput.value = '';
      assignmentDescriptionInput.value = '';
    }
    
    function showAddQuestionForm() {
      addQuestionForm.classList.remove('hidden');
      questionTextInput.focus();
    }
    
    function hideAddQuestionForm() {
      addQuestionForm.classList.add('hidden');
      questionTextInput.value = '';
    }
    
    // Data loading functions
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
    
    function loadAssignments(classId) {
      if (!classId) return;
      
      const assignments = getAssignments(classId);
      renderAssignments(assignments);
    }
    
    function loadQuestions(assignmentId) {
      if (!assignmentId) return;
      
      const questions = getQuestions(assignmentId);
      renderQuestions(questions);
    }
    
    function loadChatMessages(classId) {
      if (!classId) return;
      
      const messages = getChatMessages(classId);
      renderChatMessages(messages);
    }
    
    function loadDiscussionMessages(questionId) {
      if (!questionId) return;
      
      const messages = getDiscussionMessages(questionId);
      renderDiscussionMessages(messages);
    }
    
    // Render functions
    function renderClasses(classes) {
      classesContainer.innerHTML = '';
      
      classes.forEach(function(classItem) {
        const classElement = document.createElement('div');
        classElement.className = 'class-item';
        classElement.dataset.id = classItem.id;
        classElement.innerHTML = `
          <span class="class-name">${classItem.name}</span>
          ${isEditMode ? `<button class="delete-btn" data-id="${classItem.id}">Delete</button>` : ''}
        `;
        
        // Open class detail when clicked (unless in edit mode)
        classElement.addEventListener('click', function(e) {
          if (!isEditMode && e.target.className !== 'delete-btn') {
            showClassDetail(classItem.id);
          }
        });
        
        classesContainer.appendChild(classElement);
      });
      
      // Add delete button event listeners
      document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function(e) {
          e.stopPropagation();
          const id = this.getAttribute('data-id');
          deleteClass(id);
        });
      });
    }
    
    function renderAssignments(assignments) {
      assignmentsList.innerHTML = '';
      
      if (assignments.length === 0) {
        assignmentsList.innerHTML = '<p class="empty-message">No assignments yet. Add your first assignment!</p>';
        return;
      }
      
      assignments.forEach(function(assignment) {
        const dueDate = new Date(assignment.dueDate);
        const formattedDate = dueDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
        
        const assignmentElement = document.createElement('div');
        assignmentElement.className = 'assignment-item';
        assignmentElement.dataset.id = assignment.id;
        assignmentElement.innerHTML = `
          <div class="assignment-info">
            <span class="assignment-title">${assignment.title}</span>
            <span class="assignment-due-date">Due: ${formattedDate}</span>
          </div>
          <button class="delete-assignment-btn" data-id="${assignment.id}">×</button>
        `;
        
        assignmentElement.addEventListener('click', function(e) {
          if (e.target.className !== 'delete-assignment-btn') {
            showAssignmentDetail(assignment.id);
          }
        });
        
        assignmentsList.appendChild(assignmentElement);
      });
      
      // Add delete button event listeners
      document.querySelectorAll('.delete-assignment-btn').forEach(button => {
        button.addEventListener('click', function(e) {
          e.stopPropagation();
          const id = this.getAttribute('data-id');
          deleteAssignment(id);
        });
      });
    }
    
    function renderQuestions(questions) {
      questionsList.innerHTML = '';
      
      if (questions.length === 0) {
        questionsList.innerHTML = '<p class="empty-message">No questions yet. Be the first to ask!</p>';
        return;
      }
      
      questions.forEach(function(question) {
        const timestamp = new Date(question.timestamp);
        const formattedDate = timestamp.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
        
        const questionElement = document.createElement('div');
        questionElement.className = 'question-item';
        questionElement.dataset.id = question.id;
        questionElement.innerHTML = `
          <div class="question-preview">
            <span class="question-text">${question.text.substring(0, 60)}${question.text.length > 60 ? '...' : ''}</span>
            <div class="question-meta">
              <span class="question-author">${question.author || 'Anonymous'}</span>
              <span class="question-date">${formattedDate}</span>
              <span class="question-replies">${(question.replies || 0)} replies</span>
            </div>
          </div>
        `;
        
        questionElement.addEventListener('click', function() {
          showQuestionDiscussion(question.id);
        });
        
        questionsList.appendChild(questionElement);
      });
    }
    
    function renderChatMessages(messages) {
      chatMessages.innerHTML = '';
      
      if (messages.length === 0) {
        // Add welcome message from AI
        const welcomeMessage = {
          sender: 'ai',
          text: `Hello! I'm your AI assistant for this class. How can I help you today?`,
          timestamp: new Date().toISOString()
        };
        
        messages.push(welcomeMessage);
        saveChatMessages(currentClassId, messages);
      }
      
      messages.forEach(function(message) {
        const timestamp = new Date(message.timestamp);
        const formattedTime = timestamp.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        });
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.sender}-message`;
        messageElement.innerHTML = `
          <div class="message-content">
            <p>${message.text}</p>
            <span class="message-time">${formattedTime}</span>
          </div>
        `;
        
        chatMessages.appendChild(messageElement);
      });
      
      // Scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function renderDiscussionMessages(messages) {
      discussionMessages.innerHTML = '';
      
      if (messages.length === 0) {
        discussionMessages.innerHTML = '<p class="empty-message">No replies yet. Start the discussion!</p>';
        return;
      }
      
      messages.forEach(function(message) {
        const timestamp = new Date(message.timestamp);
        const formattedTime = timestamp.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        const messageElement = document.createElement('div');
        messageElement.className = 'discussion-message';
        messageElement.innerHTML = `
          <div class="message-content">
            <div class="message-header">
              <span class="message-author">${message.author || 'Anonymous'}</span>
              <span class="message-time">${formattedTime}</span>
            </div>
            <p>${message.text}</p>
          </div>
        `;
        
        discussionMessages.appendChild(messageElement);
      });
      
      // Scroll to bottom
      discussionMessages.scrollTop = discussionMessages.scrollHeight;
    }
    
    // Data manipulation functions
    function saveClass() {
      const name = classNameInput.value.trim();
      let url = classUrlInput.value.trim();
      
      if (name === '') {
        return;
      }
      
      // Add http:// if missing
      if (url !== '' && !url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      chrome.storage.sync.get('classes', function(data) {
        const classes = data.classes || [];
        const newClass = {
          id: generateId(),
          name,
          url: url || '#'
        };
        
        classes.push(newClass);
        
        chrome.storage.sync.set({ 'classes': classes }, function() {
          renderClasses(classes);
          hideAddClassForm();
        });
      });
    }
    
    function deleteClass(id) {
      chrome.storage.sync.get('classes', function(data) {
        const classes = data.classes || [];
        const updatedClasses = classes.filter(classItem => classItem.id !== id);
        
        chrome.storage.sync.set({ 'classes': updatedClasses }, function() {
          renderClasses(updatedClasses);
        });
      });
    }
    
    function saveAssignment() {
      const title = assignmentTitleInput.value.trim();
      const dueDate = assignmentDueDateInput.value;
      const description = assignmentDescriptionInput.value.trim();
      
      if (title === '' || dueDate === '') {
        return;
      }
      
      const assignments = getAssignments(currentClassId);
      const newAssignment = {
        id: generateId(),
        title,
        dueDate,
        description,
        classId: currentClassId
      };
      
      assignments.push(newAssignment);
      saveAssignments(currentClassId, assignments);
      
      renderAssignments(assignments);
      hideAddAssignmentForm();
    }
    
    function deleteAssignment(id) {
      const assignments = getAssignments(currentClassId);
      const updatedAssignments = assignments.filter(assignment => assignment.id !== id);
      
      saveAssignments(currentClassId, updatedAssignments);
      renderAssignments(updatedAssignments);
    }
    
    function postQuestion() {
      const text = questionTextInput.value.trim();
      
      if (text === '') {
        return;
      }
      
      const questions = getQuestions(currentAssignmentId);
      const newQuestion = {
        id: generateId(),
        text,
        author: 'You', // In a real app, you'd get the user's name
        timestamp: new Date().toISOString(),
        assignmentId: currentAssignmentId,
        replies: 0
      };
      
      questions.push(newQuestion);
      saveQuestions(currentAssignmentId, questions);
      
      renderQuestions(questions);
      hideAddQuestionForm();
    }
    
    function sendChatMessage() {
      const text = messageInput.value.trim();
      
      if (text === '') {
        return;
      }
      
      const messages = getChatMessages(currentClassId);
      
      // Add user message
      const userMessage = {
        sender: 'user',
        text,
        timestamp: new Date().toISOString()
      };
      
      messages.push(userMessage);
      
      // For demo purposes, add an AI response
      // In a real app, you'd call an AI API here
      setTimeout(() => {
        const aiResponse = {
          sender: 'ai',
          text: generateAIResponse(text),
          timestamp: new Date().toISOString()
        };
        
        messages.push(aiResponse);
        saveChatMessages(currentClassId, messages);
        renderChatMessages(messages);
      }, 1000);
      
      saveChatMessages(currentClassId, messages);
      renderChatMessages(messages);
      
      messageInput.value = '';
    }
    
    function sendDiscussionMessage() {
      const text = discussionMessageInput.value.trim();
      
      if (text === '') {
        return;
      }
      
      const messages = getDiscussionMessages(currentQuestionId);
      const newMessage = {
        id: generateId(),
        text,
        author: 'You', // In a real app, you'd get the user's name
        timestamp: new Date().toISOString(),
        questionId: currentQuestionId
      };
      
      messages.push(newMessage);
      
      // Update reply count for the question
      const questions = getQuestions(currentAssignmentId);
      const question = questions.find(q => q.id === currentQuestionId);
      if (question) {
        question.replies = (question.replies || 0) + 1;
        saveQuestions(currentAssignmentId, questions);
      }
      
      saveDiscussionMessages(currentQuestionId, messages);
      renderDiscussionMessages(messages);
      
      discussionMessageInput.value = '';
    }
    
    // Storage helper functions
    function getClasses() {
      const classes = localStorage.getItem('classes');
      return classes ? JSON.parse(classes) : getDefaultClasses();
    }
    
    function getDefaultClasses() {
      return [
        { id: generateId(), name: "Computer Science 101", url: "https://example.com/cs101" },
        { id: generateId(), name: "Mathematics 202", url: "https://example.com/math202" },
        { id: generateId(), name: "Physics 110", url: "https://example.com/physics110" },
        { id: generateId(), name: "English Literature", url: "https://example.com/english" }
      ];
    }
    
    function getAssignments(classId) {
      const key = `assignments_${classId}`;
      const assignments = localStorage.getItem(key);
      return assignments ? JSON.parse(assignments) : getDefaultAssignments(classId);
    }
    
    function getDefaultAssignments(classId) {
      return [
        {
          id: generateId(),
          title: "Midterm Project",
          dueDate: "2023-11-15",
          description: "Complete the midterm project as described in the syllabus.",
          classId: classId
        },
        {
          id: generateId(),
          title: "Weekly Problem Set",
          dueDate: "2023-10-20",
          description: "Complete problems 1-10 on page 75 of the textbook.",
          classId: classId
        }
      ];
    }
    
    function getQuestions(assignmentId) {
        const key = `questions_${assignmentId}`;
        const questions = localStorage.getItem(key);
        return questions ? JSON.parse(questions) : [];
      }
      
      function getChatMessages(classId) {
        const key = `chat_${classId}`;
        const messages = localStorage.getItem(key);
        return messages ? JSON.parse(messages) : [];
      }
      
      function getDiscussionMessages(questionId) {
        const key = `discussion_${questionId}`;
        const messages = localStorage.getItem(key);
        return messages ? JSON.parse(messages) : [];
      }
      
      function saveAssignments(classId, assignments) {
        const key = `assignments_${classId}`;
        localStorage.setItem(key, JSON.stringify(assignments));
      }
      
      function saveQuestions(assignmentId, questions) {
        const key = `questions_${assignmentId}`;
        localStorage.setItem(key, JSON.stringify(questions));
      }
      
      function saveChatMessages(classId, messages) {
        const key = `chat_${classId}`;
        localStorage.setItem(key, JSON.stringify(messages));
      }
      
      function saveDiscussionMessages(questionId, messages) {
        const key = `discussion_${questionId}`;
        localStorage.setItem(key, JSON.stringify(messages));
      }
      
      // Utility functions
      function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
      }
      
      function generateAIResponse(message) {
        // Mock AI responses - in a real app, you'd call an AI API
        const responses = [
          "That's a great question! Based on the course material, I'd suggest reviewing chapter 5 in the textbook.",
          "Let me help you with that. This concept relates to what we covered in last week's lecture about problem-solving strategies.",
          "I understand your question. Have you tried applying the formula we discussed in class? It might help solve this particular problem.",
          "Good question! This is a common area of confusion. The key thing to remember is how these concepts connect to the larger framework we've been studying.",
          "I'd approach this problem by breaking it down into smaller steps. First, identify the variables, then apply the relevant principles we've discussed."
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
      }
      
      // Initialize localStorage from Chrome storage on first load
      function initializeFromChromeStorage() {
        chrome.storage.sync.get('classes', function(data) {
          if (data.classes) {
            localStorage.setItem('classes', JSON.stringify(data.classes));
          }
        });
      }
      
      // Call initialization function
      initializeFromChromeStorage();
    });