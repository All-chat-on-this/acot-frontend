const enTranslation = {
  // Common
  app_name: 'ACOT',
  app_full_name: 'All Chat On This',
  app_description: 'Your customizable AI chat platform',
  
  // Auth
  login: 'Login',
  login_title: 'Login to your account',
  login_subtitle: 'Enter your credentials to access your account',
  username: 'Username',
  password: 'Password',
  enter_username: 'Enter your username',
  enter_password: 'Enter your password',
  logging_in: 'Logging in...',
  no_account: 'Don\'t have an account?',
  register: 'Register',
  demo_account: 'Demo Account',
  
  // Header/Navigation
  switch_dark_mode: 'Switch to Dark Mode',
  switch_light_mode: 'Switch to Light Mode',
  switch_standard_theme: 'Switch to Standard Theme',
  switch_dreamlikeColor_theme: 'Switch to DreamlikeColor Theme',
  dreamlikeColor: 'DreamlikeColor',
  profile: 'Profile',
  settings: 'Settings',
  logout: 'Logout',
  
  // Home Page
  welcome: 'Welcome to ACOT',
  welcome_back: 'Welcome back,',
  login_to_start: 'Login to get started',
  start_chat: 'Start Chat',
  new_chat_desc: 'Begin a new conversation with AI',
  configure_api: 'Configure API',
  configure_api_desc: 'Set up or modify your API configurations',
  profile_desc: 'View and update your profile settings',
  key_features: 'Key Features',
  feature_custom_api: 'Customizable API',
  feature_custom_api_desc: 'Connect to any AI service with a flexible API configuration system',
  feature_thought_chain: 'Thought Chain Visibility',
  feature_thought_chain_desc: 'See the AI\'s thought process with compatible models',
  feature_ui: 'Beautiful UI',
  feature_ui_desc: 'Modern interface with multiple themes including the signature dreamlikeColor effect',
  
  // Sidebar
  search_conversations: 'Search conversations...',
  new_conversation: 'New Conversation',
  conversations: 'Conversations',
  no_conversations: 'No conversations yet. Create one to get started!',
  no_search_results: 'No conversations match your search',
  api_configurations: 'API Configurations',
  
  // Chat
  no_conversation_selected: 'No conversation selected',
  select_conversation: 'Select a conversation from the sidebar or create a new one.',
  no_messages: 'No messages yet',
  start_conversation: 'Start a conversation by typing a message below.',
  type_message: 'Type your message here...',
  send_message: 'Send message',
  enter_to_send: 'Press Enter to send, Shift+Enter for a new line',
  hide_thinking: 'Hide thinking',
  show_thinking: 'Show thinking',
  ai_thinking_process: 'AI\'s thinking process:',
  configure_api_first: 'Please configure an API first',
  ai_assistant: 'AI Assistant',
  you: 'You',
  system: 'System',
  hide_thinking_process: 'Hide thinking process',
  show_thinking_process: 'Show thinking process',
  api_configuration: 'API Configuration',
  
  // Config
  api_configs: 'API Configurations',
  new_config: 'New Config',
  your_configs: 'Your Configurations',
  no_configs: 'No configurations yet.\nCreate one to get started.',
  select_config: 'Select a configuration from the list\nor create a new one.',
  edit: 'Edit',
  delete: 'Delete',
  api_url: 'API URL',
  api_key: 'API Key',
  api_key_placement: 'API Key Placement',
  default_authorization_header: 'Default Authorization Header',
  custom_header: 'Custom Header',
  request_body: 'Request Body',
  header_name: 'Header Name',
  body_path: 'Body Path',
  header_name_helper: 'Enter the custom header name for the API key',
  body_path_helper: 'Enter the field name in the request body where the API key should be placed',
  api_key_body_note: 'Your API key will be added to the request body as:',
  request_template: 'Request Template',
  response_template: 'Response Template',
  new_configuration: 'New Configuration',
  edit_configuration: 'Edit',
  config_name: 'Configuration Name',
  request_template_json: 'Request Template (JSON)',
  request_template_tooltip: 'Define the request body structure. Include placeholders for messages.',
  response_template_json: 'Response Template (JSON)',
  response_template_tooltip: 'Define how to extract content from the API response. Specify the path to role, content, and thinking fields.',
  test_connection: 'Test Connection',
  cancel: 'Cancel',
  save: 'Save',
  connection_successful: 'Connection Successful',
  connection_failed: 'Connection Failed',
  delete_confirm: 'Are you sure you want to delete "{{name}}"?',
  invalid_json: 'Invalid JSON format. Please check your templates.',

  // Profile
  nickname:'Nickname',
  
  // JSON Editor
  format: 'Format',
  path_editor: 'Path Editor',
  role_field_path: 'Role Field Path',
  content_field_path: 'Content Field Path',
  thinking_text_field_path: 'Thinking Text Field Path',
  role_field_placeholder: 'e.g., choices[0].message.role',
  content_field_placeholder: 'e.g., choices[0].message.content',
  thinking_text_field_placeholder: 'e.g., choices[0].thinking_text',
  role_field_description: 'The JSON path to extract the role from API response',
  content_field_description: 'The JSON path to extract the message content from API response',
  thinking_text_field_description: 'Optional: The JSON path to extract AI\'s thinking process (chain of thought)',
  preview_configuration: 'Preview Configuration',
  code_view: 'Code View',
  openai_model_status: 'OpenAI Model Status',
  
  // Language
  language: 'Language',
  english: 'English',
  chinese: 'Chinese'
};

export default enTranslation; 