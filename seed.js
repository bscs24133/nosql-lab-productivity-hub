// seed.js
// =============================================================================
//  Seed the database with realistic test data.
//  Run with: npm run seed
//
//  Required minimum:
//    - 2 users
//    - 4 projects (split across the users)
//    - 5 tasks (with embedded subtasks and tags arrays)
//    - 5 notes (some attached to projects, some standalone)
//
//  Use the bcrypt module to hash passwords before inserting users.
//  Use ObjectId references for relationships (projectId, ownerId).
// =============================================================================

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connect } = require('./db/connection');

(async () => {
  const db = await connect();

  // OPTIONAL: clear existing data so re-seeding is idempotent
  await db.collection('users').deleteMany({});
  await db.collection('projects').deleteMany({});
  await db.collection('tasks').deleteMany({});
  await db.collection('notes').deleteMany({});
  console.log('Inserted 4 projects...');
  // =============================================================================
  //  console.log('Cleared existing data...');

  // ==================== USERS ====================
  const hash1 = await bcrypt.hash('password123', 10);
  const hash2 = await bcrypt.hash('securepass456', 10);

  const u1 = await db.collection('users').insertOne({
    email: 'ali@example.com',
    passwordHash: hash1,
    name: 'Ali Hassan',
    createdAt: new Date('2024-01-10')
  });

  const u2 = await db.collection('users').insertOne({
    email: 'sara@example.com',
    passwordHash: hash2,
    name: 'Sara Khan',
    createdAt: new Date('2024-01-15')
  });

  const userId1 = u1.insertedId;
  const userId2 = u2.insertedId;
  console.log('Inserted 2 users...');

  // ==================== PROJECTS ====================
  const p1 = await db.collection('projects').insertOne({
    ownerId: userId1,
    name: 'Final Year Project',
    description: 'My capstone project for university',
    archived: false,
    createdAt: new Date('2024-01-12')
  });

  const p2 = await db.collection('projects').insertOne({
    ownerId: userId1,
    name: 'Personal Website',
    description: 'Portfolio site redesign',
    archived: false,
    createdAt: new Date('2024-01-20')
  });

  const p3 = await db.collection('projects').insertOne({
    ownerId: userId2,
    name: 'Research Paper',
    description: 'Database systems research',
    archived: false,
    createdAt: new Date('2024-02-01')
  });

  const p4 = await db.collection('projects').insertOne({
    ownerId: userId2,
    name: 'Old Internship Tasks',
    // no description — schema flexibility: description is optional
    archived: true,
    createdAt: new Date('2023-12-01')
  });

  const projectId1 = p1.insertedId;
  const projectId2 = p2.insertedId;
  const projectId3 = p3.insertedId;
  const projectId4 = p4.insertedId;
  console.log('Inserted 4 projects...');

  // ==================== TASKS ====================
  await db.collection('tasks').insertOne({
    ownerId: userId1,
    projectId: projectId1,
    title: 'Write project proposal',
    status: 'done',
    priority: 5,
    tags: ['writing', 'urgent'],
    subtasks: [
      { title: 'Draft introduction', done: true },
      { title: 'Define objectives', done: true },
      { title: 'Submit to supervisor', done: true }
    ],
    dueDate: new Date('2024-02-01'), // optional field — present on this task
    createdAt: new Date('2024-01-13')
  });

  await db.collection('tasks').insertOne({
    ownerId: userId1,
    projectId: projectId1,
    title: 'Build database schema',
    status: 'in-progress',
    priority: 4,
    tags: ['backend', 'database'],
    subtasks: [
      { title: 'Design ER diagram', done: true },
      { title: 'Implement in MongoDB', done: false }
    ],
    dueDate: new Date('2024-03-15'), // optional field — present on this task
    createdAt: new Date('2024-01-18')
  });

  await db.collection('tasks').insertOne({
    ownerId: userId1,
    projectId: projectId2,
    title: 'Design homepage layout',
    status: 'todo',
    priority: 3,
    tags: ['design', 'frontend'],
    subtasks: [
      { title: 'Create wireframe', done: false },
      { title: 'Choose color palette', done: false }
    ],
    // no dueDate — schema flexibility: dueDate omitted on this task
    createdAt: new Date('2024-01-22')
  });

  await db.collection('tasks').insertOne({
    ownerId: userId2,
    projectId: projectId3,
    title: 'Literature review',
    status: 'in-progress',
    priority: 4,
    tags: ['research', 'reading'],
    subtasks: [
      { title: 'Find 10 relevant papers', done: true },
      { title: 'Summarize each paper', done: false },
      { title: 'Write review section', done: false }
    ],
    dueDate: new Date('2024-04-01'), // optional field — present on this task
    createdAt: new Date('2024-02-05')
  });

  await db.collection('tasks').insertOne({
    ownerId: userId2,
    projectId: projectId3,
    title: 'Write methodology section',
    status: 'todo',
    priority: 2,
    tags: ['writing'],
    subtasks: [
      { title: 'Outline methodology', done: false }
    ],
    // no dueDate — schema flexibility: dueDate omitted on this task
    createdAt: new Date('2024-02-10')
  });

  console.log('Inserted 5 tasks...');

  // ==================== NOTES ====================
  await db.collection('notes').insertOne({
    ownerId: userId1,
    projectId: projectId1, // attached to a project
    title: 'Supervisor meeting notes',
    content: 'Discussed project scope and initial requirements with supervisor.',
    tags: ['meeting', 'important'],
    createdAt: new Date('2024-01-14')
  });

  await db.collection('notes').insertOne({
    ownerId: userId1,
    projectId: projectId2, // attached to a project
    title: 'Design inspiration links',
    content: 'Collected references from Dribbble and Behance for portfolio design.',
    tags: ['design', 'reference'],
    createdAt: new Date('2024-01-25')
  });

  await db.collection('notes').insertOne({
    ownerId: userId1,
    // no projectId — standalone note
    title: 'Books to read',
    content: 'Clean Code, The Pragmatic Programmer, Designing Data-Intensive Applications.',
    tags: ['personal', 'reading'],
    createdAt: new Date('2024-01-30')
  });

  await db.collection('notes').insertOne({
    ownerId: userId2,
    projectId: projectId3, // attached to a project
    title: 'Key papers found',
    content: 'Found 3 highly cited papers on NoSQL performance benchmarking.',
    tags: ['research', 'important'],
    createdAt: new Date('2024-02-06')
  });

  await db.collection('notes').insertOne({
    ownerId: userId2,
    // no projectId — standalone note
    title: 'Random ideas',
    content: 'Possible future research directions after this paper is done.',
    tags: ['ideas', 'personal'],
    createdAt: new Date('2024-02-12')
  });

  console.log('Inserted 5 notes...');
  console.log('✅ Database seeded successfully!');
 

  console.log('TODO: implement seed.js');
  process.exit(0);
})();
//
  //  Hints:
  //    - Hash passwords:   const hash = await bcrypt.hash('password123', 10);
  //    - Capture inserted ids:
  //        const u = await db.collection('users').insertOne({ ... });
  //        const userId = u.insertedId;
  //    - Use those ids when inserting projects/tasks/notes.
  //    - Demonstrate schema flexibility: include at least one optional field
  //      on SOME documents but not all (e.g. dueDate on some tasks only).
  //
  //  Sample task shape:
  //    {
  //      ownerId: <ObjectId>,
  //      projectId: <ObjectId>,
  //      title: "Write report introduction",
  //      status: "todo",
  //      priority: 3,
  //      tags: ["writing", "urgent"],
  //      subtasks: [
  //        { title: "Outline sections", done: true },
  //        { title: "Draft", done: false }
  //      ],
  //      createdAt: new Date()
  //    }
  // =============================================================================