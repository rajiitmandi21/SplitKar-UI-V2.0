# SplitKar Functional Documentation

## 📋 Product Overview

SplitKar is a comprehensive expense splitting application designed to simplify group expense management, friend-to-friend payments, and financial transparency in shared activities. The platform enables users to track expenses, split bills fairly, settle debts, and maintain clear financial records across various group activities.

## 🎯 Core Objectives

### Primary Goals
- **Simplify Expense Splitting**: Make it easy to divide costs among group members
- **Ensure Financial Transparency**: Provide clear visibility into who owes what
- **Streamline Settlements**: Facilitate quick and easy debt resolution
- **Maintain Accurate Records**: Keep detailed history of all transactions
- **Enable Social Finance**: Build trust through transparent financial interactions

### Success Metrics
- **User Engagement**: Daily/Monthly Active Users
- **Transaction Volume**: Number of expenses and settlements processed
- **User Satisfaction**: App store ratings and user feedback
- **Financial Accuracy**: Zero-discrepancy expense calculations
- **Settlement Rate**: Percentage of debts settled within 30 days

## 👥 User Personas

### Primary Users

#### 1. The Social Organizer (Sarah, 28)
- **Profile**: Frequently organizes group activities, trips, and events
- **Pain Points**: Manually tracking who paid for what, chasing people for money
- **Goals**: Effortless expense tracking, automatic splitting, quick settlements
- **Usage Pattern**: Creates groups, adds expenses, sends payment reminders

#### 2. The Casual Participant (Mike, 24)
- **Profile**: Joins group activities but doesn't organize them
- **Pain Points**: Forgetting what they owe, unclear expense breakdowns
- **Goals**: Clear visibility of debts, easy payment methods, expense history
- **Usage Pattern**: Views expenses, settles debts, checks balances

#### 3. The Budget-Conscious User (Lisa, 32)
- **Profile**: Carefully tracks personal finances and group expenses
- **Pain Points**: Lack of detailed expense categorization and analytics
- **Goals**: Detailed expense tracking, spending analytics, budget management
- **Usage Pattern**: Reviews expense details, analyzes spending patterns, sets budgets

#### 4. The Frequent Traveler (David, 35)
- **Profile**: Travels with friends/colleagues regularly
- **Pain Points**: Complex multi-currency expenses, varying group compositions
- **Goals**: Multi-currency support, flexible group management, receipt storage
- **Usage Pattern**: Creates travel groups, handles complex splits, manages receipts

## 🔧 Functional Requirements

### 1. User Management

#### 1.1 User Registration & Authentication
**Requirement**: Users must be able to create accounts and securely access the platform.

**Acceptance Criteria**:
- Users can register with email and password
- Email verification is required for account activation
- Users can log in with verified credentials
- Password reset functionality is available
- Two-factor authentication is optional but recommended

**User Stories**:
\`\`\`
As a new user,
I want to create an account with my email,
So that I can start tracking expenses with my friends.

As a returning user,
I want to log in securely,
So that I can access my expense data.
\`\`\`

#### 1.2 Profile Management
**Requirement**: Users must be able to manage their personal information and preferences.

**Acceptance Criteria**:
- Users can update their name, email, and phone number
- Users can add/update their UPI ID for payments
- Users can set notification preferences
- Users can upload a profile picture
- Users can change their password

### 2. Friend Management

#### 2.1 Friend Connections
**Requirement**: Users must be able to connect with other users to share expenses.

**Acceptance Criteria**:
- Users can search for friends by email or phone number
- Users can send friend requests
- Users can accept/decline friend requests
- Users can view their friends list
- Users can remove friends from their network

**User Stories**:
\`\`\`
As a user,
I want to add my friends to the platform,
So that I can split expenses with them.

As a user,
I want to see all my connected friends,
So that I can easily select them when creating groups.
\`\`\`

### 3. Group Management

#### 3.1 Group Creation & Administration
**Requirement**: Users must be able to create and manage expense groups.

**Acceptance Criteria**:
- Users can create groups with a name and description
- Group creators can add/remove members
- Group creators can assign admin roles to other members
- Groups can have multiple admins
- Group creators can delete groups (with confirmation)

**User Stories**:
\`\`\`
As a trip organizer,
I want to create a group for our vacation,
So that all trip-related expenses can be tracked together.

As a group admin,
I want to add new members to the group,
So that they can participate in expense sharing.
\`\`\`

#### 3.2 Group Membership
**Requirement**: Users must be able to participate in multiple groups with different roles.

**Acceptance Criteria**:
- Users can be members of multiple groups simultaneously
- Users can have different roles in different groups (member, admin, creator)
- Users can leave groups (except if they have unsettled debts)
- Users can view all groups they're part of
- Users receive notifications for group activities

### 4. Expense Management

#### 4.1 Expense Creation
**Requirement**: Users must be able to record expenses and specify how they should be split.

**Acceptance Criteria**:
- Users can create expenses with title, amount, description, and date
- Users can categorize expenses (food, transport, accommodation, etc.)
- Users can upload receipt images
- Users can specify who paid for the expense
- Users can choose splitting methods (equal, custom amounts, percentages)

**User Stories**:
\`\`\`
As a group member,
I want to add an expense I paid for,
So that the cost can be split among relevant group members.

As a user,
I want to specify exactly how an expense should be split,
So that everyone pays their fair share.
\`\`\`

#### 4.2 Expense Splitting Options
**Requirement**: The system must support various expense splitting methods.

**Splitting Methods**:
1. **Equal Split**: Divide amount equally among selected members
2. **Custom Amounts**: Specify exact amount for each member
3. **Percentage Split**: Assign percentages to each member
4. **Shares Split**: Assign shares/units to each member
5. **Itemized Split**: Split by individual items within the expense

**Acceptance Criteria**:
- System validates that splits add up to the total amount
- Users can exclude certain group members from specific expenses
- System handles rounding to ensure no money is lost
- Users can modify splits before finalizing the expense

#### 4.3 Expense Modification
**Requirement**: Users must be able to edit or delete expenses under certain conditions.

**Acceptance Criteria**:
- Expense creators can edit expenses within 24 hours of creation
- Expenses can be deleted only if no settlements have been made
- All group members are notified of expense modifications
- Edit history is maintained for transparency
- Admins can modify any group expense

### 5. Balance & Settlement Management

#### 5.1 Balance Calculation
**Requirement**: The system must accurately calculate and display user balances.

**Acceptance Criteria**:
- System calculates individual balances within each group
- System shows overall balance across all groups
- Balances are updated in real-time when expenses are added/modified
- System identifies who owes money to whom
- System optimizes debt relationships to minimize transactions

**User Stories**:
\`\`\`
As a user,
I want to see how much I owe or am owed in each group,
So that I can settle my debts appropriately.

As a user,
I want to see my overall financial position,
So that I can manage my finances effectively.
\`\`\`

#### 5.2 Settlement Processing
**Requirement**: Users must be able to record and track debt settlements.

**Acceptance Criteria**:
- Users can record payments made outside the app
- Users can initiate payments through integrated payment methods
- Both parties must confirm settlement completion
- Settlement history is maintained
- Balances are updated automatically upon settlement confirmation

**Settlement Methods**:
1. **Manual Recording**: Users manually record cash/external payments
2. **UPI Integration**: Direct UPI payments through the app
3. **Bank Transfer**: Record bank transfer details
4. **Digital Wallet**: Integration with popular wallet apps

### 6. Notification System

#### 6.1 Real-time Notifications
**Requirement**: Users must receive timely notifications about relevant activities.

**Notification Types**:
- New expense added to group
- Payment request received
- Settlement completed
- Friend request received
- Group invitation received
- Payment reminder
- Expense modification alerts

**Delivery Channels**:
- In-app notifications
- Email notifications
- SMS notifications (optional)
- Push notifications ( 
- In-app notifications
- Email notifications
- SMS notifications (optional)
- Push notifications (mobile app)
- WhatsApp notifications (for payment reminders)

**Acceptance Criteria**:
- Users can customize notification preferences for each channel
- Notifications are sent in real-time for critical actions
- Users can snooze or dismiss notifications
- Notification history is maintained
- Users can opt-out of non-essential notifications

### 7. Analytics & Reporting

#### 7.1 Expense Analytics
**Requirement**: Users must be able to analyze their spending patterns and group expenses.

**Analytics Features**:
- Monthly/yearly spending summaries
- Category-wise expense breakdown
- Group spending comparisons
- Individual contribution analysis
- Trend analysis over time
- Export capabilities (PDF, CSV)

**User Stories**:
\`\`\`
As a budget-conscious user,
I want to see my spending patterns by category,
So that I can better manage my finances.

As a group admin,
I want to see group spending analytics,
So that I can understand our collective expenses.
\`\`\`

#### 7.2 Settlement Analytics
**Requirement**: Users must be able to track settlement patterns and outstanding debts.

**Analytics Features**:
- Settlement completion rates
- Average time to settle debts
- Outstanding debt summaries
- Payment method preferences
- Debt aging reports

### 8. Security & Privacy

#### 8.1 Data Protection
**Requirement**: User financial data must be protected with industry-standard security measures.

**Security Features**:
- End-to-end encryption for sensitive data
- Secure API endpoints with authentication
- Regular security audits
- GDPR compliance for data handling
- Secure payment processing
- Data backup and recovery procedures

**Acceptance Criteria**:
- All financial data is encrypted at rest and in transit
- User passwords are hashed using bcrypt
- API endpoints require valid JWT tokens
- Sensitive operations require additional verification
- Users can export or delete their data upon request

#### 8.2 Privacy Controls
**Requirement**: Users must have control over their data visibility and sharing.

**Privacy Features**:
- Profile visibility settings
- Group expense visibility controls
- Data sharing preferences
- Account deletion options
- Activity log access

## 🔄 User Workflows

### Workflow 1: Creating and Splitting an Expense

\`\`\`mermaid
flowchart TD
    A[User opens expense form] --> B[Enter expense details]
    B --> C[Select group members]
    C --> D[Choose splitting method]
    D --> E{Equal split?}
    E -->|Yes| F[Auto-calculate amounts]
    E -->|No| G[Enter custom amounts/percentages]
    F --> H[Review split details]
    G --> H
    H --> I{Amounts correct?}
    I -->|No| D
    I -->|Yes| J[Save expense]
    J --> K[Notify group members]
    K --> L[Update balances]
\`\`\`

### Workflow 2: Settling a Debt

\`\`\`mermaid
flowchart TD
    A[User views balance] --> B[Select debt to settle]
    B --> C[Choose payment method]
    C --> D{UPI payment?}
    D -->|Yes| E[Process UPI payment]
    D -->|No| F[Record manual payment]
    E --> G[Payment confirmation]
    F --> H[Await confirmation from recipient]
    G --> I[Update balances]
    H --> I
    I --> J[Send settlement notification]
\`\`\`

### Workflow 3: Group Management

\`\`\`mermaid
flowchart TD
    A[User creates group] --> B[Add group details]
    B --> C[Invite members]
    C --> D[Members accept invitations]
    D --> E[Group becomes active]
    E --> F[Members can add expenses]
    F --> G[Track group balances]
    G --> H[Settle debts within group]
\`\`\`

## 📊 Business Rules

### 1. Expense Rules
- Expenses cannot be negative amounts
- Expense splits must equal the total expense amount
- Users can only edit expenses they created (within 24 hours)
- Deleted expenses must not have any associated settlements
- Receipt images are optional but recommended for expenses over $50

### 2. Group Rules
- Groups must have at least 2 members
- Group creators cannot leave if they have unsettled debts
- Group names must be unique within a user's groups
- Inactive groups (no activity for 6 months) are archived
- Maximum 50 members per group

### 3. Settlement Rules
- Settlements cannot exceed the outstanding debt amount
- Both parties must confirm settlements for completion
- Settlements cannot be reversed after 48 hours
- Partial settlements are allowed
- Settlement fees (if any) are clearly disclosed

### 4. Balance Rules
- Balances are calculated in real-time
- Rounding is done to 2 decimal places
- Negative balances indicate money owed
- Positive balances indicate money to be received
- Zero balances indicate no outstanding debts

## 🎨 User Experience Requirements

### 1. Usability Standards
- **Intuitive Navigation**: Users should find features within 3 clicks
- **Clear Visual Hierarchy**: Important information is prominently displayed
- **Consistent Design**: UI elements behave predictably across the app
- **Accessibility**: WCAG 2.1 AA compliance for inclusive design
- **Performance**: Pages load within 2 seconds on standard connections

### 2. Mobile Responsiveness
- **Touch-Friendly**: Buttons and inputs are appropriately sized for mobile
- **Responsive Layout**: Content adapts to different screen sizes
- **Offline Capability**: Basic functionality works without internet
- **Progressive Web App**: Installable on mobile devices
- **Native Feel**: Smooth animations and transitions

### 3. Error Handling
- **Graceful Degradation**: App remains functional when features fail
- **Clear Error Messages**: Users understand what went wrong and how to fix it
- **Recovery Options**: Users can easily retry failed actions
- **Validation Feedback**: Real-time validation for form inputs
- **Offline Sync**: Changes sync when connection is restored

## 🔮 Future Enhancements

### Phase 2 Features
- **Multi-currency Support**: Handle expenses in different currencies
- **Recurring Expenses**: Set up automatic recurring group expenses
- **Budget Management**: Set and track group budgets
- **Receipt OCR**: Automatically extract expense details from receipts
- **Integration APIs**: Connect with banking and payment apps

### Phase 3 Features
- **AI-Powered Insights**: Smart spending recommendations
- **Social Features**: Activity feeds and expense sharing
- **Advanced Analytics**: Predictive spending analysis
- **Business Accounts**: Features for small business expense management
- **Marketplace Integration**: Book and split travel/event expenses

## 📈 Success Criteria

### User Adoption Metrics
- **Registration Rate**: 70% of visitors who start registration complete it
- **Activation Rate**: 60% of registered users create their first expense within 7 days
- **Retention Rate**: 40% of users remain active after 30 days
- **Engagement Rate**: Active users create an average of 5 expenses per month

### Financial Metrics
- **Settlement Rate**: 80% of debts are settled within 30 days
- **Transaction Accuracy**: 99.9% accuracy in expense calculations
- **Payment Success Rate**: 95% of UPI payments complete successfully
- **User Satisfaction**: 4.5+ star rating on app stores

### Technical Metrics
- **Uptime**: 99.9% system availability
- **Performance**: 95% of pages load within 2 seconds
- **Error Rate**: Less than 0.1% of API requests result in errors
- **Security**: Zero data breaches or security incidents

This functional documentation serves as the foundation for all development, testing, and user experience decisions in the SplitKar application.
