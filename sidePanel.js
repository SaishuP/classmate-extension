document.addEventListener('DOMContentLoaded', function() {
    // DOM elements - Main Views
    const classesContainer = document.getElementById('classes-container');
    const classDetail = document.getElementById('class-detail');
    const assignmentDetail = document.getElementById('assignment-detail');
    const questionDetail = document.getElementById('question-detail');
    
    // DOM elements - Class Detail View
    const classTitle = document.getElementById('class-title');
    const backBtn = document.getElementById('back-btn');
    const assignmentsTabBtn = document.getElementById('assignments-tab-btn');
    const chatTabBtn = document.getElementById('chat-tab-btn');
    const assignmentsTab = document.getElementById('assignments-tab');
    const chatTab = document.getElementById('chat-tab');
    const assignmentsList = document.querySelector('.assignments-list');
    
    // DOM elements - Chat
    const chatMessages = document.getElementById('chat-messages');
    const chatInputField = document.getElementById('chat-input-field');
    const sendChatBtn = document.getElementById('send-chat-btn');
    
    // DOM elements - Assignment Detail
    const backToClassBtn = document.getElementById('back-to-class-btn');
    const assignmentTitle = document.getElementById('assignment-title');
    const assignmentDescription = document.getElementById('assignment-description');
    const questionsContainer = document.getElementById('questions-container');
    const newQuestionInput = document.getElementById('new-question-input');
    const postQuestionBtn = document.getElementById('post-question-btn');
    
    // DOM elements - Question Detail
    const backToAssignmentBtn = document.getElementById('back-to-assignment-btn');
    const questionTitle = document.getElementById('question-title');
    const questionContent = document.getElementById('question-content');
    const groupchatMessages = document.getElementById('groupchat-messages');
    const groupchatInputField = document.getElementById('groupchat-input-field');
    const sendGroupchatBtn = document.getElementById('send-groupchat-btn');
    
    // Current state
    let currentClassId = null;
    let currentAssignmentId = null;
    let currentQuestionId = null;
    
    // Mock data
    const mockData = {
      classes: [
        {
          id: 1,
          name: "Computer Science 101",
          url: "https://example.com/cs101",
          assignments: [
            {
              id: 101,
              title: "Introduction to Algorithms",
              dueDate: "2025-03-15",
              description: "Implement three basic sorting algorithms (bubble sort, insertion sort, and selection sort) in the language of your choice. Analyze their time and space complexity.",
              questions: [
                {
                  id: 1001,
                  title: "How to start with bubble sort?",
                  content: "I'm having trouble understanding how the bubble sort algorithm works. Can someone explain the basic concept?",
                  author: "Student1",
                  date: "2025-02-28",
                  messages: [
                    { author: "Student2", content: "Bubble sort works by repeatedly stepping through the list, comparing adjacent elements and swapping them if they're in the wrong order.", date: "2025-02-28" },
                    { author: "Instructor", content: "Here's a simple visualization: imagine bubbles in water rising to the surface. Heavier elements 'sink' while lighter ones 'rise' to their correct positions.", date: "2025-03-01" },
                    { author: "Student1", content: "That makes sense! So in each pass, the largest unsorted element 'bubbles up' to its correct position?", date: "2025-03-01" }
                  ]
                },
                {
                  id: 1002,
                  title: "Insertion sort vs Selection sort",
                  content: "What are the main differences between insertion sort and selection sort in terms of performance?",
                  author: "Student3",
                  date: "2025-03-01",
                  messages: [
                    { author: "Student4", content: "Insertion sort is usually more efficient for small or mostly sorted arrays, while selection sort performs the same regardless of input arrangement.", date: "2025-03-01" },
                    { author: "Student3", content: "Thanks! Do they have the same worst-case time complexity?", date: "2025-03-01" },
                    { author: "Instructor", content: "Yes, both have O(n²) worst-case time complexity, but insertion sort's best case is O(n) when the array is already sorted.", date: "2025-03-02" }
                  ]
                }
              ]
            },
            {
              id: 102,
              title: "Binary Search Trees",
              dueDate: "2025-03-22",
              description: "Implement a binary search tree with insert, delete, and search operations. Write a function to traverse the tree in-order, pre-order, and post-order.",
              questions: [
                {
                  id: 1003,
                  title: "Balancing BST",
                  content: "Does our implementation need to handle tree balancing? Or is a simple BST sufficient?",
                  author: "Student5",
                  date: "2025-03-02",
                  messages: [
                    { author: "Instructor", content: "A simple BST is sufficient for this assignment. We'll cover AVL trees and Red-Black trees in a future lesson.", date: "2025-03-02" }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 2,
          name: "Mathematics 202",
          url: "https://example.com/math202",
          assignments: [
            {
              id: 201,
              title: "Linear Algebra Problem Set",
              dueDate: "2025-03-10",
              description: "Complete problems 1-15 in Chapter 3 of the textbook. Focus on eigenvalues and eigenvectors.",
              questions: [
                {
                  id: 2001,
                  title: "Trouble with Problem 7",
                  content: "I'm stuck on problem 7 about finding eigenvalues for a 3x3 matrix. Any hints?",
                  author: "Student2",
                  date: "2025-02-27",
                  messages: [
                    { author: "Student6", content: "Remember to first find the characteristic polynomial by calculating det(A - λI).", date: "2025-02-27" },
                    { author: "Student2", content: "I got the polynomial, but I'm having trouble factoring it.", date: "2025-02-28" },
                    { author: "Instructor", content: "Try substituting some simple values first. Notice that λ=1 is a root, which should simplify your factoring.", date: "2025-02-28" }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 3,
          name: "Physics 110",
          url: "https://example.com/physics110",
          assignments: [
            {
              id: 301,
              title: "Mechanics Lab Report",
              dueDate: "2025-03-18",
              description: "Write a lab report on the pendulum experiment conducted in class. Include your data, calculations, and analysis of experimental error.",
              questions: [
                {
                  id: 3001,
                  title: "Format for error analysis",
                  content: "What's the preferred format for presenting the error analysis in our lab reports?",
                  author: "Student7",
                  date: "2025-03-01",
                  messages: [
                    { author: "Instructor", content: "Include both absolute and percentage errors. You can use a table to compare theoretical and experimental values, with a column for percentage difference.", date: "2025-03-01" }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 4,
          name: "English Literature",
          url: "https://example.com/english",
          assignments: [
            {
              id: 401,
              title: "Shakespeare Analysis Essay",
              dueDate: "2025-03-25",
              description: "Write a 5-page analysis of the theme of ambition in Macbeth. Use at least three scholarly sources to support your arguments.",
              questions: [
                {
                  id: 4001,
                  title: "Citation format",
                  content: "Should we use MLA or Chicago style for citations in this essay?",
                  author: "Student8",
                  date: "2025-02-26",
                  messages: [
                    { author: "Instructor", content: "Please use MLA format for this assignment. Remember to include a works cited page at the end.", date: "2025-02-26" }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
    
    // AI chat responses (mock)
    const aiResponses = {
      "Computer Science 101": [
        "Sorting algorithms form the foundation of many computer science concepts. What specific aspect would you like to learn about?",
        "Binary search trees are efficient data structures for searching. The average time complexity for operations is O(log n).",
        "The key difference between time and space complexity is that time complexity measures the running time of an algorithm, while space complexity measures the memory usage."
      ],
      "Mathematics 202": [
        "Linear algebra has many applications in machine learning, particularly in understanding transformations and dimensionality reduction.",
        "When finding eigenvalues, remember that they're the values of λ that satisfy the equation det(A - λI) = 0.",
        "Matrices represent linear transformations. Each eigenvalue and eigenvector pair tells you a direction in which the transformation acts as a simple scaling."
      ],
      "Physics 110": [
        "In physics, error analysis is crucial because no measurement is perfect. Both systematic and random errors must be accounted for.",
        "The period of a pendulum is proportional to the square root of its length, assuming small angle approximations.",
        "When analyzing experimental data, statistical methods help determine if your results are significant."
      ],
      "English Literature": [
        "In Macbeth, ambition serves as both a driving force and a destructive element. Consider how Shakespeare portrays the consequences of unchecked ambition.",
        "Literary analysis should balance close reading of the text with broader contextual understanding.",
        "MLA format requires in-text citations with author's last name and page number (Smith 45)."
      ]
    };
    
    // Initialize the extension
    loadClasses();
    
    // Button event listeners
    backBtn.addEventListener('click', showClassesList);
    backToClassBtn.addEventListener('click', function() {
      showClassDetail(currentClassId);
    });
    backToAssignmentBtn.addEventListener('click', function() {
      showAssignmentDetail(currentClassId, currentAssignmentId);
    });
    
    // Tab navigation
    assignmentsTabBtn.addEventListener('click', function() {
      showTab(assignmentsTab, assignmentsTabBtn);
      hideTab(chatTab, chatTabBtn);
    });
    
    chatTabBtn.addEventListener('click', function() {
      showTab(chatTab, chatTabBtn);
      hideTab(assignmentsTab, assignmentsTabBtn);
    });
    
    // Chat functionality
    sendChatBtn.addEventListener('click', sendChatMessage);
    chatInputField.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendChatMessage();
      }
    });
    
    // Question posting
    postQuestionBtn.addEventListener('click', postNewQuestion);
    
    // Groupchat functionality
    sendGroupchatBtn.addEventListener('click', sendGroupchatMessage);
    groupchatInputField.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendGroupchatMessage();
      }
    });
    
    // Load classes from mock data
    function loadClasses() {
      const classes = mockData.classes;
      renderClasses(classes);
    }
    
    // Render classes in the side panel
    function renderClasses(classes) {
      classesContainer.innerHTML = '';
      
      classes.forEach(function(classItem) {
        const classElement = document.createElement('div');
        classElement.className = 'class-item';
        classElement.innerHTML = `
          <span class="class-name">${classItem.name}</span>
        `;
        
        // Open class detail when clicked
        classElement.addEventListener('click', function() {
          showClassDetail(classItem.id);
        });
        
        classesContainer.appendChild(classElement);
      });
    }
    
    // Show class detail view
    function showClassDetail(classId) {
      currentClassId = classId;
      const classData = mockData.classes.find(c => c.id === classId);
      
      if (!classData) return;
      
      // Hide other views
      classesContainer.classList.add('hidden');
      assignmentDetail.classList.add('hidden');
      questionDetail.classList.add('hidden');
      
      // Show class detail
      classDetail.classList.remove('hidden');
      classTitle.textContent = classData.name;
      
      // Default to assignments tab
      showTab(assignmentsTab, assignmentsTabBtn);
      hideTab(chatTab, chatTabBtn);
      
      // Render assignments
      renderAssignments(classData.assignments);
      
      // Clear chat
      chatMessages.innerHTML = '';
      chatInputField.value = '';
    }
    
    // Show tab and highlight button
    function showTab(tabElement, buttonElement) {
      tabElement.classList.remove('hidden');
      buttonElement.classList.add('active');
    }
    
    // Hide tab and remove button highlight
    function hideTab(tabElement, buttonElement) {
      tabElement.classList.add('hidden');
      buttonElement.classList.remove('active');
    }
    
    // Render assignments for a class
    function renderAssignments(assignments) {
      assignmentsList.innerHTML = '';
      
      assignments.forEach(function(assignment) {
        const assignmentElement = document.createElement('div');
        assignmentElement.className = 'assignment-item';
        assignmentElement.innerHTML = `
          <div class="assignment-name">${assignment.title}</div>
          <div class="assignment-due">Due: ${formatDate(assignment.dueDate)}</div>
        `;
        
        // Open assignment detail when clicked
        assignmentElement.addEventListener('click', function() {
          showAssignmentDetail(currentClassId, assignment.id);
        });
        
        assignmentsList.appendChild(assignmentElement);
      });
    }
    
    // Show assignment detail view
    function showAssignmentDetail(classId, assignmentId) {
      currentClassId = classId;
      currentAssignmentId = assignmentId;
      
      const classData = mockData.classes.find(c => c.id === classId);
      if (!classData) return;
      
      const assignmentData = classData.assignments.find(a => a.id === assignmentId);
      if (!assignmentData) return;
      
      // Hide other views
      classesContainer.classList.add('hidden');
      classDetail.classList.add('hidden');
      questionDetail.classList.add('hidden');
      
      // Show assignment detail
      assignmentDetail.classList.remove('hidden');
      assignmentTitle.textContent = assignmentData.title;
      assignmentDescription.textContent = assignmentData.description;
      
      // Render questions
      renderQuestions(assignmentData.questions);
    }
    
    // Render questions for an assignment
    function renderQuestions(questions) {
      questionsContainer.innerHTML = '';
      
      if (questions.length === 0) {
        questionsContainer.innerHTML = '<p>No questions yet. Be the first to ask!</p>';
        return;
      }
      
      questions.forEach(function(question) {
        const questionElement = document.createElement('div');
        questionElement.className = 'question-item';
        questionElement.innerHTML = `
          <div class="question-title">${question.title}</div>
          <div class="question-meta">Asked by ${question.author} on ${formatDate(question.date)}</div>
        `;
        
        // Open question detail when clicked
        questionElement.addEventListener('click', function() {
          showQuestionDetail(currentClassId, currentAssignmentId, question.id);
        });
        
        questionsContainer.appendChild(questionElement);
      });
    }
    
    // Show question detail view
    function showQuestionDetail(classId, assignmentId, questionId) {
      currentClassId = classId;
      currentAssignmentId = assignmentId;
      currentQuestionId = questionId;
      
      const classData = mockData.classes.find(c => c.id === classId);
      if (!classData) return;
      
      const assignmentData = classData.assignments.find(a => a.id === assignmentId);
      if (!assignmentData) return;
      
      const questionData = assignmentData.questions.find(q => q.id === questionId);
      if (!questionData) return;
      
      // Hide other views
      classesContainer.classList.add('hidden');
      classDetail.classList.add('hidden');
      assignmentDetail.classList.add('hidden');
      
      // Show question detail
      questionDetail.classList.remove('hidden');
      questionTitle.textContent = questionData.title;
      questionContent.textContent = questionData.content;
      
      // Render group chat messages
      renderGroupchatMessages(questionData.messages);
    }
    
    // Render group chat messages
    function renderGroupchatMessages(messages) {
      groupchatMessages.innerHTML = '';
      
      if (!messages || messages.length === 0) {
        groupchatMessages.innerHTML = '<p>No messages yet. Start the discussion!</p>';
        return;
      }
      
      messages.forEach(function(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message other-message';
        messageElement.innerHTML = `
          <div class="message-author">${message.author}</div>
          <div class="message-content">${message.content}</div>
          <div class="message-date">${formatDate(message.date)}</div>
        `;
        
        groupchatMessages.appendChild(messageElement);
      });
      
      // Scroll to bottom
      groupchatMessages.scrollTop = groupchatMessages.scrollHeight;
    }
    
    // Send a chat message to AI
    function sendChatMessage() {
      const message = chatInputField.value.trim();
      if (message === '') return;
      
      // Add user message
      const userMessageElement = document.createElement('div');
      userMessageElement.className = 'message user-message';
      userMessageElement.innerHTML = `
        <div class="message-content">${message}</div>
        <div class="message-date">Just now</div>
      `;
      chatMessages.appendChild(userMessageElement);
      
      // Clear input
      chatInputField.value = '';
      
      // Get class name for AI response
      const classData = mockData.classes.find(c => c.id === currentClassId);
      if (!classData) return;
      
      // Simulate AI response
      setTimeout(function() {
        const responses = aiResponses[classData.name];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const aiMessageElement = document.createElement('div');
        aiMessageElement.className = 'message ai-message';
        aiMessageElement.innerHTML = `
          <div class="message-author">AI Assistant</div>
          <div class="message-content">${randomResponse}</div>
          <div class="message-date">Just now</div>
        `;
        chatMessages.appendChild(aiMessageElement);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 1000);
    }
    
    // Post a new question
    function postNewQuestion() {
      const questionText = newQuestionInput.value.trim();
      if (questionText === '') return;
      
      // Create new question object
      const newQuestion = {
        id: Date.now(), // Use timestamp as ID
        title: questionText.split('\n')[0] || 'New Question',
        content: questionText,
        author: "You",
        date: new Date().toISOString().split('T')[0],
        messages: []
      };
      
      // Add to mock data
      const classData = mockData.classes.find(c => c.id === currentClassId);
      if (!classData) return;
      
      const assignmentData = classData.assignments.find(a => a.id === currentAssignmentId);
      if (!assignmentData) return;
      
      assignmentData.questions.push(newQuestion);
      
      // Re-render questions
      renderQuestions(assignmentData.questions);
      
      // Clear input
      newQuestionInput.value = '';
    }
    
    // Send a group chat message
    function sendGroupchatMessage() {
      const message = groupchatInputField.value.trim();
      if (message === '') return;
      
      // Get current question data
      const classData = mockData.classes.find(c => c.id === currentClassId);
      if (!classData) return;
      
      const assignmentData = classData.assignments.find(a => a.id === currentAssignmentId);
      if (!assignmentData) return;
      
      const questionData = assignmentData.questions.find(q => q.id === currentQuestionId);
      if (!questionData) return;
      
      // Create new message
      const newMessage = {
        author: "You",
        content: message,
        date: new Date().toISOString().split('T')[0]
      };
      
      // Add to mock data
      questionData.messages.push(newMessage);
      
      // Re-render messages
      renderGroupchatMessages(questionData.messages);
      
      // Clear input
      groupchatInputField.value = '';
    }
    
    // Show the classes list (return to main view)
    function showClassesList() {
      classesContainer.classList.remove('hidden');
      classDetail.classList.add('hidden');
      assignmentDetail.classList.add('hidden');
      questionDetail.classList.add('hidden');
    }
    
    // Format date for display
    function formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
  });