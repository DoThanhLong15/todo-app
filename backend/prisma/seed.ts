import 'dotenv/config';

import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is not set.');
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data (in reverse order of creation to avoid FK constraints)
  console.log('🗑️  Clearing existing data...');
  await prisma.taskAssignee.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();
  await prisma.workspace.deleteMany();

  // ============================================================
  // 1️⃣ CREATE 2 USERS
  // ============================================================
  console.log('👤 Creating users...');

  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      name: 'John Doe',
      password: 'password',
      avatarUrl: 'https://api.example.com/avatars/john.jpg',
      isEmailVerified: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      name: 'Jane Smith',
      password: 'password',
      avatarUrl: 'https://api.example.com/avatars/jane.jpg',
      isEmailVerified: true,
    },
  });

  console.log(
    `✅ Created users: ${user1.name} (${user1.email}), ${user2.name} (${user2.email})`,
  );

  // ============================================================
  // 2️⃣ CREATE 1 WORKSPACE
  // ============================================================
  console.log('🏢 Creating workspace...');

  const workspace = await prisma.workspace.create({
    data: {
      name: 'Acme Corporation',
      slug: 'acme-corp',
      ownerId: user1.id,
    },
  });

  console.log(`✅ Created workspace: ${workspace.name} (${workspace.slug})`);

  // ============================================================
  // 3️⃣ CREATE MEMBERSHIPS
  // ============================================================
  console.log('👥 Creating memberships...');

  const membership1 = await prisma.membership.create({
    data: {
      userId: user1.id,
      workspaceId: workspace.id,
      role: 'OWNER',
    },
  });

  const membership2 = await prisma.membership.create({
    data: {
      userId: user2.id,
      workspaceId: workspace.id,
      role: 'MEMBER',
    },
  });

  console.log(
    `✅ Created memberships: ${user1.name} as OWNER, ${user2.name} as MEMBER`,
  );

  // ============================================================
  // 4️⃣ CREATE 2 PROJECTS
  // ============================================================
  console.log('📁 Creating projects...');

  const project1 = await prisma.project.create({
    data: {
      name: 'Website Redesign',
      description: 'Modernize company website with new design system',
      workspaceId: workspace.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Mobile App Development',
      description: 'Build native mobile app for iOS and Android',
      workspaceId: workspace.id,
    },
  });

  console.log(`✅ Created projects: ${project1.name}, ${project2.name}`);

  // ============================================================
  // 5️⃣ CREATE 5 TASKS
  // ============================================================
  console.log('✅ Creating tasks...');

  const tasks = [
    // Project 1: Website Redesign
    {
      title: 'Design homepage mockup',
      description: 'Create Figma mockup for the new homepage with hero section',
      status: 'IN_PROGRESS' as const,
      priority: 'HIGH' as const,
      projectId: project1.id,
      createdById: user1.id,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    },
    {
      title: 'Setup development environment',
      description: 'Install dependencies, configure ESLint, Prettier',
      status: 'DONE' as const,
      priority: 'MEDIUM' as const,
      projectId: project1.id,
      createdById: user1.id,
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
    // Project 2: Mobile App Development
    {
      title: 'Login screen implementation',
      description:
        'Implement email and password based login using Firebase Auth',
      status: 'TODO' as const,
      priority: 'HIGH' as const,
      projectId: project2.id,
      createdById: user2.id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
    {
      title: 'Database schema design',
      description: 'Design PostgreSQL schema for app data models',
      status: 'TODO' as const,
      priority: 'MEDIUM' as const,
      projectId: project2.id,
      createdById: user2.id,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    },
    {
      title: 'Create API endpoints documentation',
      description: 'Document all REST API endpoints with OpenAPI/Swagger',
      status: 'IN_PROGRESS' as const,
      priority: 'LOW' as const,
      projectId: project2.id,
      createdById: user1.id,
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    },
  ];

  const createdTasks = await Promise.all(
    tasks.map((task) =>
      prisma.task.create({
        data: task,
        include: { project: true, assignees: true },
      }),
    ),
  );

  console.log(`✅ Created 5 tasks`);
  createdTasks.forEach((task) => {
    console.log(`   - ${task.title} (${task.status}) [${task.priority}]`);
  });

  // ============================================================
  // 6️⃣ ASSIGN USERS TO TASKS (bonus - for testing)
  // ============================================================
  console.log('🔗 Assigning users to tasks...');

  await prisma.taskAssignee.create({
    data: {
      taskId: createdTasks[0].id, // Design homepage → John
      userId: user1.id,
    },
  });

  await prisma.taskAssignee.create({
    data: {
      taskId: createdTasks[2].id, // Login screen → Jane
      userId: user2.id,
    },
  });

  await prisma.taskAssignee.create({
    data: {
      taskId: createdTasks[3].id, // Database schema → Both
      userId: user1.id,
    },
  });

  await prisma.taskAssignee.create({
    data: {
      taskId: createdTasks[3].id,
      userId: user2.id,
    },
  });

  console.log(`✅ Assigned users to tasks`);

  // ============================================================
  // SUMMARY
  // ============================================================
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('✨ Seed completed successfully!');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('\n📊 DATA CREATED:');
  console.log(`   • 2 Users`);
  console.log(`     - ${user1.name} (${user1.email}) — Password: password`);
  console.log(`     - ${user2.name} (${user2.email}) — Password: password`);
  console.log(`   • 1 Workspace: ${workspace.name}`);
  console.log(`   • 2 Projects`);
  console.log(`   • 5 Tasks with assignments`);
  console.log('\n🧪 TEST CREDENTIALS:');
  console.log(`   Email: ${user1.email}`);
  console.log(`   Password: password`);
  console.log('═══════════════════════════════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
