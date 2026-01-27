// src/data/posts.js
import img from "../assets/images/teamimage.png";
import img2 from "../assets/images/heroImage.jpg";
import img3 from "../assets/images/aboutImage.jpg";

export const posts = [
  {
    id: 0,
    title: "Building Scalable Microservices Architecture",
    excerpt:
            `Demo
      Live App: https://cloudsweeper.io

      CloudSweeper connects to AWS and Azure using read-only access.
      No write permissions, no complex automation.
      You can onboard in a few minutes by providing minimal connectivity details and immediately see idle-resource recommendations after the first scan is complete.

      The Story Behind It
      Cloud cost waste is not a visibility problem — it’s a confidence problem.

      In almost every AWS or Azure environment I worked with, teams already suspected there was waste:
      Idle VMs, unused databases, orphaned disks, forgotten IPs. Dashboards made that obvious.

      What stopped the action was fear.

      No engineer wants to be the person who deletes something and breaks production.
      When ownership is unclear and usage patterns are noisy, the safest choice is to do nothing.
      So waste quietly accumulates month after month.

      CloudSweeper started as an internal experiment to close that gap.

      The idea was simple: instead of just flagging “possible waste,” combine real usage metrics,
      configuration data, and historical behavior — then explain why a resource looks idle, and how confident the system is about that conclusion.

      Today, CloudSweeper acts as an AI-enabled FinOps agent that helps engineers move from visibility to confident decision-making — without automation, without risk, and always with humans in the loop.

      Technical Highlights
      CloudSweeper is built as an async, multi-tenant Python system designed to scan safely
      customer-owned cloud environments without disrupting workloads.

      Core Stack
      Python 3.13 (fully async)
      aioboto3 for AWS interactions
      Azure SDKs (azure-*) for Azure resource and metrics access
      aiohttp for async HTTP operations
      Pydantic v2 for strict data validation and schema enforcement
      Azure Cosmos DB for multi-tenant state and scan results
      python-dotenv for environment configuration
      Cloud Scanning Architecture
      Secure read-only IAM / RBAC access (no delete permissions, ever)
      Async scanners for AWS and Azure resources
      Metrics-driven idle detection using:
      CloudWatch (AWS)
      Azure Monitor
      Conservative defaults:
      If metrics are missing or ambiguous, the resource is skipped
      No assumptions, no forced classification
      Each idle candidate includes a human-readable idle reason

      (e.g. actual CPU %, thresholds, and time window), not just a binary flag.

      AI-Powered Recommendation Engine
      AI evaluates enriched resource context (metrics, configs, tags, history)
      Produces structured recommendations:
      KEEP
      DOWNSIZE
      DELETE
      Each recommendation includes:
      A confidence score
      Cost impact estimates
      Reasoning trace
      The system is explicitly engineer-in-the-loop:
      No automatic actions are taken.

      Notifications & Integrations
      Webhook-based notifications for detected idle resources
      Payloads include detailed idle reasons and context
      Supports integration with tools like Slack, Teams, or internal systems
      Retry logic and validation to ensure delivery reliability
      Design Principles
      Async-first for scale and speed
      Modular codebase with strict size limits per module
      Transparent logging and graceful degradation
      Safety over aggressiveness
      Explainability over black-box decisions.
      Why This Scales
      CloudSweeper is designed to scale across hundreds or thousands of cloud accounts:

      Fully async scanning architecture
      Stateless scanners with tenant isolation
      Cloud-provider–agnostic recommendation layer
      Designed for continuous scans, not one-off audits
      As cloud usage grows, CloudSweeper grows with it—without requiring more human effort.`,
    author: "John Doe",
    avatar: img2,
    date: "Oct 8, 2025",
    readingTime: "6 min",
    image: img,
    tags: ["React", "JavaScript", "Web Development"],
    reactionsCount: 120,
    commentsCount: 45,
    views: 301,

  },
  {
    id: 1,
    title: "The Future of Modern Workspaces: Designing for Flexibility and Collaboration",
    excerpt:
      `In today's rapidly evolving work environment, the design of physical and digital workspaces has become more critical than ever. As organizations embrace hybrid and remote work models, creating spaces that foster both productivity and collaboration has emerged as a key priority for forward-thinking companies.

The traditional office layout, with its rigid cubicles and assigned desks, is giving way to more flexible, adaptive environments. These modern workspaces are designed to accommodate various work styles and activities, from focused individual work to dynamic team collaboration. The shift reflects a deeper understanding of how people work best and what they need to thrive in professional settings.

One of the most significant trends in workspace design is the emphasis on flexibility. Modular furniture, movable partitions, and multi-purpose spaces allow organizations to quickly adapt their environments to changing needs. This adaptability has proven especially valuable in recent years, as companies navigate uncertain conditions and evolving team structures.

Technology integration plays a crucial role in modern workspace design. Seamless connectivity, smart booking systems, and collaborative tools enable teams to work together effectively, whether they're in the same room or scattered across the globe. The best workspaces blend physical and digital elements to create cohesive, intuitive experiences.

Looking ahead, the workspace of the future will likely continue evolving to meet new challenges and opportunities. Sustainability, well-being, and inclusivity are becoming central considerations in design decisions. As we move forward, the most successful workspaces will be those that put people first, creating environments where creativity flourishes and teams can do their best work.`,
    author: "Jane Smith",
    avatar: img3,
    date: "Nov 10, 2025",
    readingTime: "8 min",
    image: img2,
    tags: ["PHP", "Performance", "Frontend"],
    reactionsCount: 98,
    commentsCount: 32,
    views: 263,
  },
  {
    id: 2,
    title: "React Performance Optimization Techniques",
    excerpt:
      "Discover practical techniques to optimize React applications and improve performance.",
    author: "Jane Smith",
    avatar: img,
    date: "Sep 10, 2025",
    readingTime: "10 min",
    image: img3,
    tags: ["React", "Backend", "Frontend"],
    reactionsCount: 148,
    commentsCount: 61,
    views: 452,
  },
];
